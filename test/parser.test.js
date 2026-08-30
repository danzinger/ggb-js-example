import test from"node:test";import assert from"node:assert/strict";import{parseLinear,validateInput}from"../js/math/parser.js";const value=x=>({m:`${x.slope.n}/${x.slope.d}`,b:`${x.intercept.n}/${x.intercept.d}`});
test("accepts common equivalent notation",()=>{for(const input of["3x+2","2+x*3","3*x+3-1","6/2x+2","3,0x+2"]){const parsed=parseLinear(input);assert.equal(parsed.ok,true,input);assert.deepEqual(value(parsed),{m:"3/1",b:"2/1"},input);}});
test("parses exact rational expressions",()=>{const parsed=parseLinear("(x+x)/3-1");assert.equal(parsed.ok,true);assert.deepEqual(value(parsed),{m:"2/3",b:"-1/1"});});
test("reports malformed input before mathematics",()=>{for(const input of["2x++1","f(x)=2x+1","2x;Delete(a)","2x+("]){const result=validateInput(input);assert.equal(result.ok,false,input);assert.ok(result.message);}});
test("rejects nonlinear expressions",()=>{const result=parseLinear("x*x+1");assert.equal(result.ok,false);assert.equal(result.code,"nonlinear");});
