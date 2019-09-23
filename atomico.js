import{State as e}from"./index.js";import{useState as t}from"atomico";export default function(r,n){let[o,d]=t(()=>{let t=e(n);return{ref:t,send:()=>t.send(data,e=>d(e))}});return[o.ref.state,o.send]}
//# sourceMappingURL=atomico.js.map
