(()=>{var e={};e.id=928,e.ids=[928],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},60906:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>o.a,__next_app__:()=>m,originalPathname:()=>c,pages:()=>p,routeModule:()=>h,tree:()=>l}),t(54868),t(13239),t(58909);var a=t(93282),s=t(5736),i=t(93906),o=t.n(i),n=t(36880),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);t.d(r,d);let l=["",{children:["gallery",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,54868)),"/home/kyxdx/projects/LA/apps/web/src/app/gallery/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,13239)),"/home/kyxdx/projects/LA/apps/web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,58909)),"/home/kyxdx/projects/LA/apps/web/src/app/not-found.tsx"]}],p=["/home/kyxdx/projects/LA/apps/web/src/app/gallery/page.tsx"],c="/gallery/page",m={require:t,loadChunk:()=>Promise.resolve()},h=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/gallery/page",pathname:"/gallery",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},42081:(e,r,t)=>{Promise.resolve().then(t.bind(t,66411)),Promise.resolve().then(t.bind(t,82521)),Promise.resolve().then(t.bind(t,98048))},66411:(e,r,t)=>{"use strict";t.d(r,{default:()=>i});var a=t(73227);t(23677);let s=JSON.parse('["https://picsum.photos/600/600?random=1","https://picsum.photos/600/600?random=2","https://picsum.photos/600/600?random=3","https://picsum.photos/600/600?random=4","https://picsum.photos/600/600?random=5","https://picsum.photos/600/600?random=6","https://picsum.photos/600/600?random=7","https://picsum.photos/600/600?random=8","https://picsum.photos/600/600?random=9","https://picsum.photos/600/600?random=10","https://picsum.photos/600/600?random=11","https://picsum.photos/600/600?random=12"]');function i(){return(0,a.jsxs)("section",{id:"galeri",className:"py-20 bg-white overflow-hidden",children:[(0,a.jsxs)("div",{className:"max-w-7xl mx-auto px-6 mb-12 text-left",children:[(0,a.jsxs)("h2",{className:"text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4",children:["Momen ",a.jsx("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]",children:"Perjalanan"})]}),a.jsx("p",{className:"text-slate-500 text-sm md:text-base leading-relaxed max-w-xl",children:"Setiap langkah di Tanah Suci adalah cerita. Berikut adalah beberapa momen indah bersama para jamaah."})]}),a.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .expandable-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 12px;
          height: 80vh;
          min-height: 600px;
          transition: grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                      grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .expandable-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(6, 1fr);
            height: 120vh;
          }
          .expandable-grid:has(.m-col-1:hover) { grid-template-columns: 2.5fr 1fr; }
          .expandable-grid:has(.m-col-2:hover) { grid-template-columns: 1fr 2.5fr; }
          
          .expandable-grid:has(.m-row-1:hover) { grid-template-rows: 2.5fr 1fr 1fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-2:hover) { grid-template-rows: 1fr 2.5fr 1fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-3:hover) { grid-template-rows: 1fr 1fr 2.5fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-4:hover) { grid-template-rows: 1fr 1fr 1fr 2.5fr 1fr 1fr; }
          .expandable-grid:has(.m-row-5:hover) { grid-template-rows: 1fr 1fr 1fr 1fr 2.5fr 1fr; }
          .expandable-grid:has(.m-row-6:hover) { grid-template-rows: 1fr 1fr 1fr 1fr 1fr 2.5fr; }
        }

        @media (min-width: 769px) {
          .expandable-grid:has(.col-1:hover) { grid-template-columns: 2.5fr 1fr 1fr 1fr; }
          .expandable-grid:has(.col-2:hover) { grid-template-columns: 1fr 2.5fr 1fr 1fr; }
          .expandable-grid:has(.col-3:hover) { grid-template-columns: 1fr 1fr 2.5fr 1fr; }
          .expandable-grid:has(.col-4:hover) { grid-template-columns: 1fr 1fr 1fr 2.5fr; }

          .expandable-grid:has(.row-1:hover) { grid-template-rows: 2.5fr 1fr 1fr; }
          .expandable-grid:has(.row-2:hover) { grid-template-rows: 1fr 2.5fr 1fr; }
          .expandable-grid:has(.row-3:hover) { grid-template-rows: 1fr 1fr 2.5fr; }
        }

        .grid-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .grid-item:hover img {
          transform: scale(1.05);
        }

        /* Overlay */
        .grid-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .grid-item:hover::after {
          opacity: 1;
        }
      `}}),a.jsx("div",{className:"max-w-7xl mx-auto px-4 md:px-6",children:a.jsx("div",{className:"expandable-grid",children:s.map((e,r)=>{let t=r%4+1,s=Math.floor(r/4)+1,i=r%2+1,o=Math.floor(r/2)+1;return a.jsx("div",{className:`grid-item col-${t} row-${s} m-col-${i} m-row-${o}`,children:a.jsx("img",{src:e,alt:`Momen ${r+1}`})},r)})})})]})}},98048:(e,r,t)=>{"use strict";t.d(r,{default:()=>n});var a=t(73227);t(23677);var s=t(20649),i=t(41043),o=t(11250);function n(){let e=(0,i.usePathname)(),r=r=>e===r||e?.startsWith(r+"/")?"text-emerald-600 dark:text-emerald-400 font-bold":"hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors";return a.jsx("nav",{className:"w-full bg-white dark:bg-black/80 border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md",children:(0,a.jsxs)("div",{className:"container mx-auto px-6 h-20 flex items-center justify-between",children:[(0,a.jsxs)(s.default,{href:"/",className:"flex items-center gap-2.5",children:[a.jsx("img",{src:"/farha-logo-only.svg",alt:"FARHA Logo",className:"w-9 h-9"}),(0,a.jsxs)("div",{className:"leading-tight",children:[a.jsx("span",{className:"font-bold tracking-wide block text-[15px] text-slate-900 dark:text-white",style:{fontFamily:"var(--font-cinzel), serif"},children:"FARHA"}),a.jsx("span",{className:"font-medium tracking-[0.2em] uppercase block text-[10px] text-[#C9A84C]",children:"Umrah Services"})]})]}),"/"===e?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300",children:[a.jsx(s.default,{href:"/products",className:r("/products"),children:"Katalog Modul"}),a.jsx(s.default,{href:"/packages",className:r("/packages"),children:"Paket Umrah"}),a.jsx(s.default,{href:"/muthawif",className:r("/muthawif"),children:"Direktori Muthawif"}),a.jsx(s.default,{href:"/blog",className:r("/blog"),children:"Blog"}),a.jsx(s.default,{href:"/tentang",className:r("/tentang"),children:"Tentang Kami"})]}),a.jsx("div",{children:a.jsx(o.z,{variant:"outline",className:"rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30",children:"Masuk"})})]}):a.jsx("div",{children:(0,a.jsxs)(s.default,{href:"/",className:"flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors",children:[(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[a.jsx("path",{d:"m12 19-7-7 7-7"}),a.jsx("path",{d:"M19 12H5"})]}),"Beranda"]})})]})})}},11250:(e,r,t)=>{"use strict";t.d(r,{z:()=>d});var a=t(73227),s=t(49389),i=t(31086),o=t(18755);let n=(0,i.j)("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/80",outline:"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",ghost:"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",destructive:"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",xs:"h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",sm:"h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",lg:"h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",icon:"size-8","icon-xs":"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3","icon-sm":"size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg","icon-lg":"size-9"}},defaultVariants:{variant:"default",size:"default"}});function d({className:e,variant:r="default",size:t="default",...i}){return a.jsx(s.z,{"data-slot":"button",className:(0,o.cn)(n({variant:r,size:t,className:e})),...i})}},18755:(e,r,t)=>{"use strict";t.d(r,{cn:()=>i});var a=t(91126),s=t(82890);function i(...e){return(0,s.m6)((0,a.W)(e))}},54868:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>d});var a=t(99013),s=t(53189);let i=(0,s.createProxy)(String.raw`/home/kyxdx/projects/LA/apps/web/src/app/components/home/GallerySection.tsx#default`),o=(0,s.createProxy)(String.raw`/home/kyxdx/projects/LA/apps/web/src/components/layout/Header.tsx#default`);var n=t(891);function d(){return(0,a.jsxs)("main",{className:"min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white",children:[a.jsx(o,{}),a.jsx("div",{className:"flex-1 pt-10 min-h-screen",children:a.jsx(i,{})}),a.jsx(n.Z,{})]})}},891:(e,r,t)=>{"use strict";t.d(r,{Z:()=>a});let a=(0,t(53189).createProxy)(String.raw`/home/kyxdx/projects/LA/apps/web/src/components/layout/Footer.tsx#default`)}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[778,422,124,971],()=>t(60906));module.exports=a})();