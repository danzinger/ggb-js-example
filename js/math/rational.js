export function gcd(a, b) { a=Math.abs(a); b=Math.abs(b); while (b) [a,b]=[b,a%b]; return a || 1; }
export function rational(n, d=1) {
  if (!Number.isInteger(n) || !Number.isInteger(d) || d===0) throw new TypeError("Invalid rational");
  const sign=d<0?-1:1, divisor=gcd(n,d);
  return Object.freeze({n:sign*n/divisor,d:Math.abs(d)/divisor});
}
export function formatRational(v) { return v.d===1?String(v.n):`${v.n}/${v.d}`; }
export function formatLinear({slope,intercept}) {
  let x=slope.d===1?(slope.n===1?"x":slope.n===-1?"−x":`${slope.n}x`):`${formatRational(slope)}x`;
  if (slope.n===0) x="";
  const b=intercept.n;
  return !x?String(b):b===0?x:`${x} ${b>0?"+":"−"} ${Math.abs(b)}`;
}
