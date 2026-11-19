const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const profile = fs.mkdtempSync(
  path.join(os.tmpdir(), "smartpet-heatmap-browser-"),
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
    "--remote-debugging-port=9228",
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
let role = "ENCARGADO",
  fail = false,
  empty = false,
  slow = false;
const user = () => ({
  id: "user-1",
  nombre: "Ana",
  apellido: "Prueba",
  email: "test@example.com",
  telefono: null,
  fotoUrl: null,
  rol: role,
  estado: true,
  establecimiento: null,
});
const points = [
  [-63.182, -17.783, 8],
  [-63.185, -17.786, 3],
  [-63.179, -17.78, 1],
];
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
  let body = {},
    status = 200;
  if (url.hostname === "tiles.openfreemap.org")
    body = {
      version: 8,
      sources: {},
      layers: [
        {
          id: "base",
          type: "background",
          paint: { "background-color": "#e8f0eb" },
        },
      ],
    };
  else if (request.method === "OPTIONS") body = {};
  else if (url.pathname.endsWith("/auth/profile")) body = user();
  else if (url.pathname.endsWith("/analitica/mapa-calor")) {
    const query = Object.fromEntries(url.searchParams);
    calls.push(query);
    assert(request.headers.Authorization || request.headers.authorization);
    if (slow) {
      slow = false;
      await delay(1200);
    }
    if (fail) {
      fail = false;
      status = 503;
      body = { message: "Error temporal de prueba" };
    } else
      body = {
        ...query,
        totalReportes: empty ? 0 : 12,
        datos: {
          type: "FeatureCollection",
          features: empty
            ? []
            : points.map(([x, y, cantidad]) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: [x, y] },
                properties: { cantidad },
              })),
        },
      };
  } else if (url.pathname.endsWith("/animales-resguardados")) body = [];
  else throw new Error("Unexpected request " + request.url);
  await send("Fetch.fulfillRequest", {
    requestId,
    responseCode: status,
    responseHeaders: [
      { name: "Content-Type", value: "application/json" },
      { name: "Access-Control-Allow-Origin", value: "*" },
      {
        name: "Access-Control-Allow-Headers",
        value: "Authorization,Content-Type",
      },
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
        await (await fetch("http://127.0.0.1:9228/json/list")).json()
      ).find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await delay(100);
  }
  assert(target, "Headless browser did not start");
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
      void intercept(event.params).catch((err) => {
        if (!String(err).includes("Invalid InterceptionId"))
          errors.push(String(err));
      });
    else if (event.method === "Runtime.exceptionThrown")
      errors.push(JSON.stringify(event.params.exceptionDetails));
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", {
    patterns: [
      { urlPattern: "*/api/v1/*", requestStage: "Request" },
      {
        urlPattern: "https://tiles.openfreemap.org/*",
        requestStage: "Request",
      },
    ],
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `if(!localStorage.getItem('smartpet-auth-storage'))localStorage.setItem('smartpet-auth-storage',${JSON.stringify(JSON.stringify({ state: { token: "browser-test-token", user: user(), isAuthenticated: true }, version: 0 }))})`,
  });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("/heatmap");
  await wait(
    `document.querySelector('.heatmap-map')?.dataset.ready==='true' && document.body.innerText.includes('12 reportes')`,
  );
  assert.equal(calls.at(-1).tipo, "ALERTAS");
  assert.equal(calls.at(-1).estado, "ACTIVA");
  await delay(1000);
  const screenshot = async (name) => {
    const result = await send("Page.captureScreenshot", { format: "png" });
    const file = path.join(os.tmpdir(), name);
    fs.writeFileSync(file, Buffer.from(result.data, "base64"));
    console.log(file);
  };
  await screenshot("smartpet-heatmap-desktop.png");
  // A known point is visible at fitted zoom >=12. Click it through the real map canvas.
  const box = await evaluate(
    `(()=>{const r=document.querySelector('.maplibregl-canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`,
  );
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    button: "left",
    clickCount: 1,
    ...box,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    button: "left",
    clickCount: 1,
    ...box,
  });
  await wait(`document.body.innerText.includes('Ubicación aproximada.')`);
  await click("Avistamientos");
  await wait(
    `document.body.innerText.includes('12 reportes') && !document.querySelector('.maplibregl-popup')`,
  );
  assert.equal(calls.at(-1).tipo, "AVISTAMIENTOS");
  assert.equal(calls.at(-1).estado, "ACTIVO");
  await fill('select[aria-label="Estado"]', "CERRADO");
  await wait(`document.body.innerText.includes('12 reportes')`);
  assert.equal(calls.at(-1).estado, "CERRADO");
  await fill('input[aria-label="Desde"]', "2026-11-01");
  await fill('input[aria-label="Hasta"]', "2026-11-17");
  await click("Aplicar fechas");
  await wait(`document.body.innerText.includes('12 reportes')`);
  assert.equal(calls.at(-1).desde, "2026-11-01");
  assert.equal(calls.at(-1).hasta, "2026-11-17");
  slow = true;
  await click("Alertas de extravío");
  await wait(`document.body.innerText.includes('Cargando reportes')`);
  await click("Avistamientos");
  await wait(`document.body.innerText.includes('12 reportes')`);
  await delay(1400);
  assert.equal(
    await evaluate(`document.querySelector('h2').textContent`),
    "Avistamientos",
  );
  empty = true;
  await click("Actualizar datos");
  await wait(`document.body.innerText.includes('No hay reportes para')`);
  empty = false;
  fail = true;
  await click("Actualizar datos");
  await wait(`document.body.innerText.includes('Error temporal de prueba')`);
  await click("Reintentar");
  await wait(`document.body.innerText.includes('12 reportes')`);
  await click("Recargar mapa");
  await wait(`document.querySelector('.heatmap-map')?.dataset.ready==='true'`);
  assert.equal(
    await evaluate(`document.querySelectorAll('.maplibregl-canvas').length`),
    1,
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await delay(300);
  assert.equal(
    await evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"),
    true,
  );
  await screenshot("smartpet-heatmap-mobile-width.png");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await click("Resguardados");
  await wait(`!document.querySelector('.maplibregl-canvas')`);
  role = "ADMIN";
  await evaluate(
    `localStorage.setItem('smartpet-auth-storage',${JSON.stringify(JSON.stringify({ state: { token: "admin-test-token", user: { ...user(), rol: "ADMIN" }, isAuthenticated: true }, version: 0 }))})`,
  );
  await navigate("/admin/heatmap");
  await wait(
    `document.querySelector('.heatmap-map')?.dataset.ready==='true' && document.body.innerText.includes('12 reportes')`,
  );
  assert.equal(
    await evaluate(`!!document.querySelector('a[href="/admin/heatmap"]')`),
    true,
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    JSON.stringify({
      ok: true,
      queries: calls.length,
      checks: [
        "heatmap WebGL",
        "popup",
        "types",
        "states",
        "dates",
        "stale requests",
        "empty",
        "error/retry",
        "remount/unmount",
        "responsive",
        "ADMIN and ENCARGADO",
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
