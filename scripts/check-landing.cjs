const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const profile = fs.mkdtempSync(
  path.join(os.tmpdir(), "smartpet-landing-browser-"),
);
const browser = spawn(
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  [
    "--headless=new",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--no-first-run",
    "--disable-extensions",
    "--disable-background-networking",
    "--remote-debugging-port=9229",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws,
  seq = 0;
const pending = new Map();
const errors = [];
const calls = [];
let fail = false;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Timeout " + method));
    }, 10000);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      reject,
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function intercept({ requestId, request }) {
  const url = new URL(request.url);
  calls.push(url.pathname);
  let body = [],
    status = 200;
  if (request.method === "OPTIONS") body = {};
  else if (url.pathname === "/api/v1/adopciones") {
    if (fail) {
      fail = false;
      status = 503;
      body = { message: "Prueba de error" };
    }
  } else throw new Error("Unexpected API call " + url.pathname);
  await send("Fetch.fulfillRequest", {
    requestId,
    responseCode: status,
    responseHeaders: [
      { name: "Content-Type", value: "application/json" },
      { name: "Access-Control-Allow-Origin", value: "*" },
    ],
    body: Buffer.from(JSON.stringify(body)).toString("base64"),
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function wait(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await delay(100);
  }
  throw new Error(
    "Missing UI: " +
      expression +
      "\n" +
      (await evaluate("document.body.innerText")),
  );
}
async function click(text, scope = "document") {
  const code = `Array.from(${scope}.querySelectorAll('button,a')).find(el=>el.textContent.trim()===${JSON.stringify(text)})`;
  await wait(`!!(${code})`);
  await evaluate(`(${code}).click()`);
}
async function fill(selector, value) {
  await evaluate(
    `(()=>{const el=document.querySelector(${JSON.stringify(selector)});const p=el.tagName==='SELECT'?HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`,
  );
}
async function navigate(route) {
  await send("Page.navigate", { url: "http://127.0.0.1:5188" + route });
}
(async () => {
  let target;
  for (let i = 0; i < 50; i++) {
    try {
      target = (
        await (await fetch("http://127.0.0.1:9229/json/list")).json()
      ).find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await delay(100);
  }
  assert(target, "Browser did not start");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  ws.onmessage = ({ data }) => {
    const event = JSON.parse(data);
    if (event.id) {
      const task = pending.get(event.id);
      pending.delete(event.id);
      if (event.error) task?.reject(new Error(JSON.stringify(event.error)));
      else task?.resolve(event.result);
    } else if (event.method === "Fetch.requestPaused")
      void intercept(event.params).catch((err) => errors.push(String(err)));
    else if (event.method === "Runtime.exceptionThrown")
      errors.push(JSON.stringify(event.params.exceptionDetails));
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", {
    patterns: [{ urlPattern: "*/api/v1/*", requestStage: "Request" }],
  });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("/");
  await wait(
    `document.querySelector('h1')?.textContent.includes('Bienestar que nos une') && Array.from(document.images).every(img=>img.complete && img.naturalWidth>0)`,
  );
  assert.equal(
    calls.length,
    0,
    "Landing must not call private or catalog APIs",
  );
  assert.equal(await evaluate(`document.querySelectorAll('main').length`), 1);
  assert.equal(await evaluate(`document.querySelectorAll('footer').length`), 1);
  assert.equal(
    await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),
    true,
  );
  const screenshot = async (name, full = false) => {
    const r = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: full,
    });
    const file = path.join(os.tmpdir(), name);
    fs.writeFileSync(file, Buffer.from(r.data, "base64"));
    console.log(file);
  };
  await screenshot("smartpet-landing-desktop.png");
  await screenshot("smartpet-landing-full.png", true);
  assert.equal(
    await evaluate(
      `Array.from(document.querySelectorAll('a')).every(a=>a.getAttribute('href') && a.getAttribute('href')!=='#')`,
    ),
    true,
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await evaluate("window.scrollTo(0,0)");
  await delay(200);
  assert.equal(
    await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),
    true,
  );
  await screenshot("smartpet-landing-mobile.png");
  await evaluate(
    `document.querySelector('[aria-label="Abrir men\u00fa"]').click()`,
  );
  assert.equal(
    await evaluate(
      `document.querySelector('[aria-controls="public-navigation"]').getAttribute('aria-expanded')`,
    ),
    "true",
  );
  await evaluate(
    `document.querySelector('[aria-controls="public-navigation"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`,
  );
  assert.equal(
    await evaluate(
      `document.querySelector('[aria-controls="public-navigation"]').getAttribute('aria-expanded')`,
    ),
    "false",
  );
  assert.equal(
    await evaluate(
      `document.activeElement===document.querySelector('[aria-controls="public-navigation"]')`,
    ),
    true,
  );
  await evaluate(
    `document.querySelector('[aria-label="Abrir men\u00fa"]').click()`,
  );
  await click(
    "Servicios",
    "document.querySelector('#public-navigation')",
  );
  await wait(`location.hash==='#como-funciona'`);
  await delay(300);
  assert.equal(
    await evaluate(
      `document.querySelector('[aria-controls="public-navigation"]').getAttribute('aria-expanded')`,
    ),
    "false",
  );
  const top = await evaluate(
    `document.getElementById('como-funciona').getBoundingClientRect().top`,
  );
  assert(top >= 80 && top < 200, "Anchor hidden by header: " + top);
  await evaluate(`document.querySelector('summary').click()`);
  assert.equal(await evaluate(`document.querySelector('details').open`), true);
  await click("Explorar adopciones");
  await wait(
    `location.pathname==='/adopciones' && document.body.innerText.includes('Pronto habr\u00e1 nuevas historias')`,
  );
  assert.equal(await evaluate(`document.querySelectorAll('footer').length`), 1);
  assert.equal(await evaluate(`document.querySelectorAll('header').length`), 1);
  assert.equal(
    await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),
    true,
  );
  fail = true;
  await navigate("/adopciones");
  await wait(`!!document.querySelector('[role="alert"]')`);
  await click("Reintentar");
  await wait(
    `document.body.innerText.includes('Pronto habr\u00e1 nuevas historias')`,
  );
  await navigate("/#establecimientos");
  await wait(`!!document.getElementById('establecimientos')`);
  await delay(300);
  await click("Conocer el portal de establecimientos");
  await wait(`location.pathname==='/establecimientos'`);
  await click("Registrar establecimiento");
  await wait(
    `location.pathname==='/register' && !!document.querySelector('form')`,
  );
  await navigate("/");
  await wait(`!!document.querySelector('h1')`);
  const auth = {
    state: {
      token: "browser-token",
      user: {
        id: "test",
        rol: "ADMIN",
        nombre: "Admin",
        apellido: "Prueba",
        email: "test@example.com",
        estado: true,
        establecimiento: null,
      },
      isAuthenticated: true,
    },
    version: 0,
  };
  await evaluate(
    `localStorage.setItem('smartpet-auth-storage',${JSON.stringify(JSON.stringify(auth))})`,
  );
  await navigate("/establecimientos");
  await wait(
    `!!Array.from(document.querySelectorAll('a')).find(a=>a.textContent==='Ir a mi panel')`,
  );
  assert.equal(
    await evaluate(
      `Array.from(document.querySelectorAll('a')).find(a=>a.textContent==='Ir a mi panel').getAttribute('href')`,
    ),
    "/admin/dashboard",
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    JSON.stringify({
      ok: true,
      checks: [
        "desktop/mobile",
        "images",
        "footer",
        "menu/Escape",
        "anchors",
        "FAQ",
        "catalog empty/error/retry",
        "register CTA",
        "admin portal link",
        "no landing API calls",
      ],
    }),
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (ws?.readyState === 1) {
      try {
        await send("Browser.close");
      } catch {}
      ws.close();
    }
    browser.kill();
  });
