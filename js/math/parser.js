import {rational} from "./rational.js";
const allowed=/^[0-9xX+\-−*/·(),.\s]+$/u;
export function normalizeInput(raw){return raw.trim().replaceAll("−","-").replaceAll("·","*").replace(/(\d),(\d)/g,"$1.$2").replace(/\s+/g,"").replace(/(\d|\))(?=x|X|\()/g,"$1*").replace(/(x|X|\))(?=\d|\()/g,"$1*").toLowerCase();}
export function validateInput(raw){
  if(!raw.trim())return{ok:false,code:"empty",message:"Enter an expression after f(x) =."};
  if(/[\r\n]/.test(raw))return{ok:false,code:"lines",message:"Keep the equation on one line."};
  if(!allowed.test(raw))return{ok:false,code:"character",message:"Use numbers, x, arithmetic signs and parentheses only."};
  const value=normalizeInput(raw);let depth=0;
  for(let i=0;i<value.length;i+=1){if(value[i]==="(")depth+=1;if(value[i]===")")depth-=1;if(depth<0)return{ok:false,code:"parenthesis",position:i,message:"This closing parenthesis has no opening partner."};}
  if(depth)return{ok:false,code:"parenthesis",position:value.length,message:"Close the open parenthesis."};
  const malformed=value.match(/(?:\+\+|--|\+-|-\+|\/\/|\*\*|\/\*|\*\/|^[*/]|[+\-*/]$)/);
  if(malformed)return{ok:false,code:"operator",position:malformed.index,message:"Two operators meet where a number or x is expected."};
  if(/\d+\.\d*\./.test(value))return{ok:false,code:"number",message:"A number can contain only one decimal separator."};
  return{ok:true,value};
}
export function parseLinear(raw){
  const checked=validateInput(raw);if(!checked.ok)return checked;
  const tokens=checked.value.match(/\d+(?:\.\d+)?|x|[()+\-*/]/g)||[];let index=0;
  const add=(a,b)=>({m:addR(a.m,b.m),b:addR(a.b,b.b)}),neg=a=>({m:rational(-a.m.n,a.m.d),b:rational(-a.b.n,a.b.d)});
  function atom(){const token=tokens[index++];if(token==="("){const out=sum();if(tokens[index++]!==")")throw new Error("parenthesis");return out;}if(token==="+")return atom();if(token==="-")return neg(atom());if(token==="x")return{m:rational(1),b:rational(0)};if(/^\d/.test(token||""))return{m:rational(0),b:rationalFromDecimal(token)};throw new Error("term");}
  function factor(){let left=atom();while(tokens[index]==="*"||tokens[index]===
"/"){const op=tokens[index++],right=atom();if(op==="*"){if(left.m.n&&right.m.n)throw new Error("nonlinear");left=left.m.n?scale(left,right.b):scale(right,left.b);}else{if(right.m.n||right.b.n===0)throw new Error("division");left=scale(left,rational(right.b.d,right.b.n));}}return left;}
  function sum(){let left=factor();while(tokens[index]==="+"||tokens[index]==="-"){const op=tokens[index++],right=factor();left=add(left,op==="+"?right:neg(right));}return left;}
  try{const result=sum();if(index!==tokens.length)throw new Error("term");return{ok:true,slope:result.m,intercept:result.b,value:checked.value};}catch(error){const messages={nonlinear:"That expression is not linear in x.",division:"Divide only by a non-zero number.",term:"A number, x or a parenthesized expression is missing.",parenthesis:"Check the parentheses."};return{ok:false,code:error.message,message:messages[error.message]||"That expression cannot be read."};}
}
function rationalFromDecimal(value){const[whole,fraction=""]=value.split(".");return rational(Number(whole+fraction),10**fraction.length);}
function addR(a,b){return rational(a.n*b.d+b.n*a.d,a.d*b.d);}function mulR(a,b){return rational(a.n*b.n,a.d*b.d);}function scale(v,k){return{m:mulR(v.m,k),b:mulR(v.b,k)};}
export function sameRational(a,b){return a.n===b.n&&a.d===b.d;}
