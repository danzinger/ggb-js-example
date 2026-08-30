import {nextFunction, VIEW} from "../math/generator.js";
import {formatLinear} from "../math/rational.js";
import {parseLinear, sameRational} from "../math/parser.js";

const SVG_NS="http://www.w3.org/2000/svg";
export class FunctionTrainer extends HTMLElement {
  constructor(){super();this.current=null;this.api=null;this.attempts=0;}
  connectedCallback(){
    this.innerHTML=`<section class="trainer" aria-label="Linear function trainer"><div class="plot-shell"><div class="plot" id="ggb-plot"></div><svg class="plot-fallback" role="img" aria-label="Coordinate system with a linear function"></svg><span class="plot-status" role="status">Preparing graph…</span></div><div class="trainer-panel"><form class="answer-row" novalidate><label class="prefix" for="function-answer">f(x) =</label><input id="function-answer" inputmode="text" autocomplete="off" spellcheck="false" aria-describedby="trainer-feedback" placeholder="for example 2/3x − 1"><button type="submit">Check</button></form><p class="feedback" id="trainer-feedback" aria-live="polite"></p><div class="trainer-actions"><button type="button" class="secondary" data-action="hint">Show a reading aid</button><button type="button" class="secondary" data-action="next">Another line</button></div></div></section>`;
    this.form=this.querySelector("form");this.input=this.querySelector("input");this.feedback=this.querySelector(".feedback");this.svg=this.querySelector("svg");
    this.form.addEventListener("submit",e=>this.check(e));this.querySelector('[data-action="next"]').addEventListener("click",()=>this.next());this.querySelector('[data-action="hint"]').addEventListener("click",()=>this.hint());
    this.next();this.loadGeoGebra();
  }
  next(){this.current=nextFunction(Math.random,this.current?.id);this.attempts=0;this.input.value="";this.input.removeAttribute("aria-invalid");this.say("Read two exact points from the grid, then enter the equation.");this.drawFallback(false);this.drawGeoGebra();}
  check(event){event.preventDefault();const parsed=parseLinear(this.input.value);if(!parsed.ok){this.input.setAttribute("aria-invalid","true");this.say(parsed.message,"error");this.input.focus();return;}this.input.removeAttribute("aria-invalid");this.attempts+=1;const slope=sameRational(parsed.slope,this.current.slope),intercept=sameRational(parsed.intercept,this.current.intercept);
    if(slope&&intercept){this.say(`Correct. f(x) = ${formatLinear(this.current)}.`,"correct");return;}
    if(!slope&&!intercept)this.say("The slope and the y-intercept are both different. Start at the point on the y-axis.","error");
    else if(!slope)this.say("The y-intercept is right. Recheck rise ÷ run between two grid points.","error");
    else this.say("The slope is right. Recheck where the line crosses the y-axis.","error");
    if(this.attempts>=2)this.drawFallback(true);
  }
  hint(){this.drawFallback(true);const[a,b]=this.current.points;this.say(`Use (${a.x}, ${a.y}) and (${b.x}, ${b.y}). The rise is ${b.y-a.y}; the run is ${b.x-a.x}.`);}
  say(message,kind="note"){this.feedback.textContent=message;this.feedback.dataset.kind=kind;}
  drawFallback(withAid){
    const size=600, step=size/(VIEW.maxX-VIEW.minX), px=x=>(x-VIEW.minX)*step, py=y=>(VIEW.maxY-y)*step;this.svg.replaceChildren();this.svg.setAttribute("viewBox",`0 0 ${size} ${size}`);
    for(let n=VIEW.minX;n<=VIEW.maxX;n+=1){const v=document.createElementNS(SVG_NS,"line");v.setAttribute("x1",px(n));v.setAttribute("x2",px(n));v.setAttribute("y1",0);v.setAttribute("y2",size);v.setAttribute("stroke",n===0?"currentColor":"#aaa39a");v.setAttribute("stroke-opacity",n===0?".65":".3");this.svg.append(v);const h=v.cloneNode();h.setAttribute("x1",0);h.setAttribute("x2",size);h.setAttribute("y1",py(n));h.setAttribute("y2",py(n));this.svg.append(h);}
    const line=document.createElementNS(SVG_NS,"line"),y1=this.current.slope.n/this.current.slope.d*VIEW.minX+this.current.intercept.n,y2=this.current.slope.n/this.current.slope.d*VIEW.maxX+this.current.intercept.n;line.setAttribute("x1",px(VIEW.minX));line.setAttribute("y1",py(y1));line.setAttribute("x2",px(VIEW.maxX));line.setAttribute("y2",py(y2));line.setAttribute("stroke","#8d6843");line.setAttribute("stroke-width","5");this.svg.append(line);
    if(withAid){const[a,b]=this.current.points;const path=document.createElementNS(SVG_NS,"path");path.setAttribute("d",`M${px(a.x)} ${py(a.y)} H${px(b.x)} V${py(b.y)}`);path.setAttribute("fill","none");path.setAttribute("stroke","#276148");path.setAttribute("stroke-width","3");path.setAttribute("stroke-dasharray","8 6");this.svg.append(path);for(const p of[a,b]){const c=document.createElementNS(SVG_NS,"circle");c.setAttribute("cx",px(p.x));c.setAttribute("cy",py(p.y));c.setAttribute("r","7");c.setAttribute("fill","#276148");this.svg.append(c);}}
  }
  async loadGeoGebra(){
    try{await loadScript("https://www.geogebra.org/apps/deployggb.js",10000);if(typeof window.GGBApplet!=="function")throw new Error("API unavailable");const box=this.querySelector(".plot-shell"),size=Math.max(320,Math.round(box.clientWidth));new window.GGBApplet({id:`trainer_${crypto.randomUUID().replaceAll("-","")}`,appName:"graphing",width:size,height:size,showToolBar:false,showMenuBar:false,showAlgebraInput:false,showResetIcon:false,enableRightClick:false,enableShiftDragZoom:false,appletOnLoad:api=>{this.api=api;this.querySelector(".plot-status").textContent="GeoGebra ready";this.svg.hidden=true;this.configureApi();this.drawGeoGebra();}},true).inject(this.querySelector(".plot"));}catch{this.querySelector(".plot-status").textContent="Local graph · GeoGebra unavailable";}
  }
  configureApi(){try{this.api.setPerspective("G");this.api.setCoordSystem(VIEW.minX,VIEW.maxX,VIEW.minY,VIEW.maxY);this.api.setAxisSteps(1,1,1,1);this.api.setGraphicsOptions(1,{grid:true,axes:true,gridDistance:{x:1,y:1}});}catch{/* older API fallback */}}
  drawGeoGebra(){if(!this.api||!this.current)return;try{this.api.deleteObject("f");this.api.evalCommand(`f(x)=(${this.current.slope.n}/${this.current.slope.d})*x+${this.current.intercept.n}`);this.api.setColor("f",141,104,67);this.api.setLineThickness("f",6);this.configureApi();}catch{this.svg.hidden=false;}}
}
function loadScript(src,timeout){return new Promise((resolve,reject)=>{if(window.GGBApplet)return resolve();const existing=document.querySelector(`script[src="${src}"]`);if(existing){existing.addEventListener("load",resolve,{once:true});return;}const script=document.createElement("script"),timer=setTimeout(()=>reject(new Error("timeout")),timeout);script.src=src;script.async=true;script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);reject(new Error("load"));};document.head.append(script);});}
