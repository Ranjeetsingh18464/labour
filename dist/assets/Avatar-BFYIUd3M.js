import{j as i}from"./query-zLq00BGJ.js";const n={sm:"w-8 h-8 text-xs",md:"w-10 h-10 text-sm",lg:"w-12 h-12 text-base",xl:"w-16 h-16 text-lg"},o=["bg-red-500","bg-blue-500","bg-green-500","bg-yellow-500","bg-purple-500","bg-pink-500","bg-indigo-500","bg-teal-500"];function b(t){return t?t.split(" ").map(r=>r[0]).join("").toUpperCase().slice(0,2):"?"}function d(t){if(!t)return o[0];let r=0;for(let e=0;e<t.length;e++)r=t.charCodeAt(e)+((r<<5)-r);return o[Math.abs(r)%o.length]}function c({src:t,alt:r="",name:e,size:l="md",className:s=""}){const g=b(e),a=d(e);return t?i.jsx("img",{src:t,alt:r||e||"Avatar",className:`
          rounded-full object-cover border-2 border-gray-200 dark:border-gray-700
          ${n[l]}
          ${s}
        `}):i.jsx("div",{className:`
        rounded-full flex items-center justify-center font-bold text-white
        border-2 border-gray-200 dark:border-gray-700
        ${a}
        ${n[l]}
        ${s}
      `,children:g})}export{c as A};
