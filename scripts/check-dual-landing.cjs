const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const profile = fs.mkdtempSync(
  path.join(os.tmpdir(), "smartpet-legal-browser-"),
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
    "--remote-debugging-port=9232",
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
let contactAttempts = 0;
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
async function intercept({requestId,request}) {
  const url=new URL(request.url);let body={},status=200;
  if(url.hostname==='tiles.openfreemap.org')body={version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#e8f0eb'}}]};
  else if(request.method==='OPTIONS')body={};
  else if(url.pathname==='/api/v1/auth/register'){
    const sent=JSON.parse(request.postData);calls.push(sent);
    assert.equal(sent.aceptaTerminos,true);assert.equal(sent.aceptaPrivacidad,true);assert.equal(sent.versionLegal,'2026-11-18.1');assert(!('rol' in sent));
    status=400;body={message:'Registro de prueba. Datos conservados.'};
  }else if(url.pathname==='/api/v1/contacto'){
    const sent=JSON.parse(request.postData);calls.push({contact:sent});contactAttempts+=1;
    assert.deepEqual(sent,{nombre:'Ana Prueba',email:'ana@example.com',asunto:'Consulta general',mensaje:'Quiero recibir más información sobre SmartPet.',sitioWeb:''});
    if(contactAttempts===1)body={enviado:true};
    else{status=503;body={message:'Servicio de correo no disponible.'};}
  }else throw new Error('Unexpected API request '+request.url);
  await send('Fetch.fulfillRequest',{requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:'application/json'},{name:'Access-Control-Allow-Origin',value:'*'},{name:'Access-Control-Allow-Headers',value:'Content-Type,Authorization'},{name:'Access-Control-Allow-Methods',value:'POST,GET,OPTIONS'}],body:Buffer.from(JSON.stringify(body)).toString('base64')});
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true,
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

(async()=>{
 let target;
 for(let i=0;i<50;i++){try{target=(await(await fetch('http://127.0.0.1:9232/json/list')).json()).find(t=>t.type==='page');if(target)break;}catch{}await delay(100);}
 assert(target);ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=({data})=>{const e=JSON.parse(data);if(e.id){const p=pending.get(e.id);pending.delete(e.id);if(e.error)p?.reject(Error(JSON.stringify(e.error)));else p?.resolve(e.result);}else if(e.method==='Fetch.requestPaused')void intercept(e.params).catch(error=>errors.push(String(error)));else if(e.method==='Runtime.exceptionThrown')errors.push(JSON.stringify(e.params))};
 await send('Page.enable');await send('Runtime.enable');
 await send('Fetch.enable',{patterns:[{urlPattern:'*/api/v1/*',requestStage:'Request'},{urlPattern:'https://tiles.openfreemap.org/*',requestStage:'Request'}]});
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});

 await navigate('/');await wait("!!document.querySelector('h1')");
 const business=await evaluate("document.querySelector('h1').textContent");
 const chatbotButton='button[aria-label="Abrir asistente de SmartPet"]';
 assert.equal(await evaluate(`!!document.querySelector('${chatbotButton}')`),true);
 await evaluate(`document.querySelector('${chatbotButton}').click()`);
 await wait("!!document.querySelector('#smartpet-business-chatbot')");
 assert.equal(await evaluate("document.querySelector('#smartpet-business-chatbot').textContent.includes('Próximamente')"),true);
 assert.equal(await evaluate("document.querySelector('#smartpet-business-chatbot input').disabled"),true);
 assert.equal(await evaluate("document.querySelector('#smartpet-business-chatbot button[aria-label=\"Enviar mensaje\"]').disabled"),true);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
 await wait("!document.querySelector('#smartpet-business-chatbot')");
 await wait("document.activeElement?.getAttribute('aria-label')==='Abrir asistente de SmartPet'");
 assert.equal(await evaluate("!!document.querySelector('a[href=\"mailto:cristian.gedalge2018@gmail.com\"]')"),true);
 assert.equal(await evaluate("!!document.querySelector('a[href=\"tel:+59177074673\"]')"),true);
 assert.equal(await evaluate("document.querySelector('#contacto address')?.textContent.includes('Av. Beni, calle 12, Santa Cruz, Bolivia')"),true);
 await fill('footer input[name="nombre"]','Ana Prueba');
 await fill('footer input[name="email"]','ana@example.com');
 await fill('footer input[name="asunto"]','Consulta general');
 await fill('footer textarea[name="mensaje"]','Quiero recibir más información sobre SmartPet.');
 await click('Enviar mensaje','document.querySelector("footer")');
 await wait("document.querySelector('footer [role=\"status\"]')?.textContent.includes('Tu mensaje fue enviado')");
 assert.equal(await evaluate("document.querySelector('footer input[name=\"nombre\"]').value"),'');
 await fill('footer input[name="nombre"]','Ana Prueba');
 await fill('footer input[name="email"]','ana@example.com');
 await fill('footer input[name="asunto"]','Consulta general');
 await fill('footer textarea[name="mensaje"]','Quiero recibir más información sobre SmartPet.');
 await click('Enviar mensaje','document.querySelector("footer")');
 await wait("document.querySelector('footer [role=\"alert\"]')?.textContent.includes('Servicio de correo no disponible')");
 assert.equal(await evaluate("document.querySelector('footer input[name=\"nombre\"]').value"),'Ana Prueba');
 assert.equal(await evaluate("document.querySelectorAll('a[href=\"/login\"],a[href=\"/register\"]').length"),0);
 await evaluate("document.querySelector('header a[href=\"/establecimientos\"]').click()");
 await wait("location.pathname==='/establecimientos' && !!document.querySelector('main a[href=\"/register\"]')");
 assert.notEqual(await evaluate("document.querySelector('h1').textContent"),business);
 assert.equal(await evaluate("!!document.querySelector('button[aria-label*=\"asistente de SmartPet\"]')"),false);
 assert.equal(await evaluate("Array.from(document.querySelectorAll('#public-navigation a')).some(a=>a.textContent.trim()==='Sitio empresarial')"),false);
 assert.equal(await evaluate("!!document.querySelector('header a[href=\"/login\"]')"),true);
 assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"),true);
 const desktop=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'smartpet-establishments-desktop.png'),Buffer.from(desktop.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(200);
 assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"),true);
 await navigate('/');await wait("location.pathname==='/' && !!document.querySelector('button[aria-label=\"Abrir asistente de SmartPet\"]')");
 assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"),true);
 await evaluate("document.querySelector('button[aria-label=\"Abrir asistente de SmartPet\"]').click()");
 await wait("!!document.querySelector('#smartpet-business-chatbot')");
 assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"),true);
 await evaluate("document.querySelector('button[aria-label=\"Cerrar asistente de SmartPet\"]').click()");
 await wait("!document.querySelector('#smartpet-business-chatbot')");
 await navigate('/establecimientos');await wait("!!document.querySelector('main a[href=\"/register\"]')");
 await evaluate("document.querySelector('main a[href=\"/register\"]').click()");await wait("!!document.querySelector('input[name=\"nombre\"]')");
 await navigate('/establecimientos');await wait("!!document.querySelector('main a[href=\"/login\"]')");
 await evaluate("document.querySelector('main a[href=\"/login\"]').click()");await wait("!!document.querySelector('input[type=\"password\"]')");
 assert.equal(errors.length,0,errors.join('\n'));console.log('Dual landing: chatbot, contact, portal navigation, mobile layout, registration and login passed.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(ws?.readyState===1){try{await send('Browser.close')}catch{}ws.close()}browser.kill()});
