import{j as o}from"./query-zLq00BGJ.js";import{S as d}from"./index-DY_Qqyuq.js";import{m as c}from"./ui-D75zfhHo.js";const f={primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",secondary:"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600",outline:"border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20",ghost:"text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700",danger:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"},m={sm:"px-3 py-1.5 text-sm gap-1.5",md:"px-4 py-2 text-sm gap-2",lg:"px-6 py-3 text-base gap-2.5"},y={sm:14,md:16,lg:20};function k({children:a,variant:g="primary",size:e="md",loading:t=!1,disabled:i=!1,icon:s,onClick:n,type:l="button",className:b="",fullWidth:u=!1}){const r=i||t;return o.jsxs(c.button,{type:l,disabled:r,onClick:n,whileHover:r?{}:{scale:1.02},whileTap:r?{}:{scale:.98},className:`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${f[g]}
        ${m[e]}
        ${u?"w-full":""}
        ${r?"opacity-50 cursor-not-allowed":"cursor-pointer"}
        ${b}
      `,children:[t?o.jsx(d,{size:e==="sm"?"sm":"md"}):s?o.jsx(s,{size:y[e]}):null,a]})}export{k as B};
