import {rational} from "./rational.js";
export const VIEW=Object.freeze({minX:-6,maxX:6,minY:-6,maxY:6});
const SLOPES=[[-4,1],[-3,1],[-2,1],[-3,2],[-1,1],[-2,3],[-1,2],[1,2],[2,3],[1,1],[3,2],[2,1],[3,1],[4,1]];
export function latticePoints(fn,view=VIEW) {
  const points=[];
  for(let x=view.minX+1;x<=view.maxX-1;x+=1){const top=fn.slope.n*x+fn.intercept.n*fn.slope.d;if(top%fn.slope.d)continue;const y=top/fn.slope.d;if(y>=view.minY+1&&y<=view.maxY-1)points.push({x,y});}
  return points;
}
export function candidateBank(){const bank=[];for(const[n,d]of SLOPES)for(let b=-4;b<=4;b+=1){const fn={slope:rational(n,d),intercept:rational(b),id:`${n}:${d}:${b}`};const points=latticePoints(fn);if(points.length>=2&&points.some(({x})=>x===0))bank.push(Object.freeze({...fn,points:Object.freeze(points)}));}return Object.freeze(bank);}
export const CANDIDATES=candidateBank();
export function mulberry32(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function nextFunction(random=Math.random,previousId=""){let fn=CANDIDATES[Math.floor(random()*CANDIDATES.length)];if(fn.id===previousId)fn=CANDIDATES[(CANDIDATES.indexOf(fn)+1)%CANDIDATES.length];return fn;}
