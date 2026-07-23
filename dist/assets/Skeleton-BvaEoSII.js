import{j as e}from"./query-zLq00BGJ.js";const i={text:"h-4 rounded w-full",avatar:"rounded-full",card:"rounded-xl h-48 w-full",image:"rounded-lg h-32 w-full"};function u({type:a="text",width:r,height:l,count:t=1,className:n=""}){const o=Array.from({length:t},(s,d)=>d);return e.jsxs("div",{className:"space-y-3",role:"status","aria-label":"Loading",children:[o.map(s=>e.jsx("div",{className:`
            animate-pulse bg-gray-200 dark:bg-gray-700
            ${i[a]}
            
            ${n}
          `,style:{width:r||(a==="avatar"?"3rem":void 0),height:l||(a==="avatar"?"3rem":void 0)}},s)),e.jsx("span",{className:"sr-only",children:"Loading..."})]})}export{u as S};
