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
    "--remote-debugging-port=9230",
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
async function intercept({requestId,request}) {
  const url=new URL(request.url);let body={},status=200;
  if(url.hostname==='tiles.openfreemap.org')body={version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#e8f0eb'}}]};
  else if(request.method==='OPTIONS')body={};
  else if(url.pathname==='/api/v1/auth/register'){
    const sent=JSON.parse(request.postData);calls.push(sent);
    assert.equal(sent.aceptaTerminos,true);assert.equal(sent.aceptaPrivacidad,true);assert.equal(sent.versionLegal,'2026-11-18.1');assert(!('rol' in sent));
    status=400;body={message:'Registro de prueba. Datos conservados.'};
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
// Tests use a separate browser profile, a local map style and mocked registration.
(async () => {
  let target;
  for(let i=0;i<50;i++){try{target=(await(await fetch('http://127.0.0.1:9230/json/list')).json()).find(t=>t.type==='page');if(target)break;}catch{}await delay(100);}
  assert(target,'Browser did not start');ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  ws.onmessage=({data})=>{const event=JSON.parse(data);if(event.id){const task=pending.get(event.id);pending.delete(event.id);if(event.error)task?.reject(new Error(JSON.stringify(event.error)));else task?.resolve(event.result);}else if(event.method==='Fetch.requestPaused')void intercept(event.params).catch(err=>errors.push(String(err)));else if(event.method==='Runtime.exceptionThrown')errors.push(JSON.stringify(event.params.exceptionDetails));};
  await send('Page.enable');await send('Runtime.enable');
  await send('Fetch.enable',{patterns:[{urlPattern:'*/api/v1/*',requestStage:'Request'},{urlPattern:'https://tiles.openfreemap.org/*',requestStage:'Request'}]});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  for(const [route,title] of [['/terminos','Términos y condiciones'],['/privacidad','Política de privacidad']]){
    await navigate(route);await wait(`document.querySelector('h1')?.textContent===${JSON.stringify(title)}`);
    assert.equal(await evaluate(`document.body.innerText.includes('2026-11-18.1')`),true);
    assert.equal(await evaluate(`document.querySelectorAll('article section').length>=9`),true);
    assert.equal(await evaluate(`!!document.querySelector('footer a[href="/terminos"]') && !!document.querySelector('footer a[href="/privacidad"]')`),true);
  }
  await navigate('/register');await wait(`!!document.querySelector('input[name="nombre"]')`);
  for(const [name,value] of Object.entries({nombre:'Ana',apellido:'Prueba',email:'ana@example.com',telefono:'70000000',password:'password123'}))await fill(`input[name="${name}"]`,value);
  await click('Continuar');await wait(`!!document.querySelector('#acepta-terminos')`);
  await fill('input[name="nombreEstablecimiento"]','Refugio de prueba');await fill('input[name="direccion"]','Plaza central');await fill('input[name="telefonoContacto"]','70000000');
  assert.equal(await evaluate(`document.querySelector('button[type="submit"]').disabled`),true);
  assert.equal(await evaluate(`document.querySelector('#acepta-terminos').checked || document.querySelector('#acepta-privacidad').checked`),false);
  const link=await evaluate(`(()=>{const a=document.querySelector('a[href="/privacidad"][target="_blank"]');return {target:a.target,rel:a.rel};})()`);assert(link.rel.includes('noopener'));
  await evaluate(`document.querySelector('a[href="/privacidad"][target="_blank"]').click()`);
  await delay(600);
  const targets=(await send('Target.getTargets')).targetInfos;const legalTab=targets.find(t=>t.url==='http://127.0.0.1:5188/privacidad');assert(legalTab,'Legal document must open separately');
  await send('Target.closeTarget',{targetId:legalTab.targetId});
  assert.equal(await evaluate(`document.querySelector('input[name="nombreEstablecimiento"]').value`),'Refugio de prueba');
  assert.equal(await evaluate(`document.querySelector('#acepta-privacidad').checked`),false);
  await evaluate(`document.querySelector('#acepta-terminos').click()`);await delay(50);
  assert.equal(await evaluate(`document.querySelector('button[type="submit"]').disabled`),true);
  await evaluate(`document.querySelector('#acepta-privacidad').click()`);await delay(50);
  assert.equal(await evaluate(`document.querySelector('button[type="submit"]').disabled`),false);
  // Keyboard selection uses the existing accessible location picker.
  await wait(`!!document.querySelector('.location-map canvas')`);
  await evaluate(`document.querySelector('.location-map').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`);
  await wait(`document.querySelector('.location-selection').textContent.includes('Ubicación seleccionada')`);
  await evaluate(`document.querySelector('form').requestSubmit()`);
  await wait(`document.body.innerText.includes('Registro de prueba. Datos conservados.')`);assert.equal(calls.length,1);
  await evaluate(`document.querySelector('#acepta-privacidad').click()`);
  await evaluate(`document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await delay(100);
  assert.equal(calls.length,1,'Submit guard must block unchecked acceptance');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(100);
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true);
  await navigate('/privacidad');await wait(`document.querySelector('h1')?.textContent==='Política de privacidad'`);
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true);
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'smartpet-privacy-mobile.png'),Buffer.from(shot.data,'base64'));
  assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({ok:true,checks:['public documents','footer links','not prechecked','one checkbox insufficient','new tab preserves form','both required','payload version','submit guard','mobile width']}));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(ws?.readyState===1){try{await send('Browser.close');}catch{}ws.close();}browser.kill();});
