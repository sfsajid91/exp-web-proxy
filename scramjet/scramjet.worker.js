(()=>{"use strict";var e={1762:function(e,t,r){r.d(t,{Z:function(){return o}});let o={fmt:function(e,t,...r){let o=Error.prepareStackTrace;Error.prepareStackTrace=(e,t)=>{t.shift(),t.shift(),t.shift();let r="";for(let e=1;e<Math.min(2,t.length);e++)t[e].getFunctionName()&&(r+=`${t[e].getFunctionName()} -> `+r);return r+=t[0].getFunctionName()||"Anonymous"};let s=function(){try{throw Error()}catch(e){return e.stack}}();Error.prepareStackTrace=o;let n=console[e]||console.log;n(`%c${s}%c ${t}`,`
		background-color: ${{log:"#000",warn:"#f80",error:"#f00",debug:"transparent"}[e]};
		color: ${{log:"#fff",warn:"#fff",error:"#fff",debug:"gray"}[e]};
		padding: ${{log:2,warn:4,error:4,debug:0}[e]}px;
		font-weight: bold;
		font-family: monospace;
		font-size: 0.9em;
	`,`${"debug"===e?"color: gray":""}`,...r)},log:function(e,...t){this.fmt("log",e,...t)},warn:function(e,...t){this.fmt("warn",e,...t)},error:function(e,...t){this.fmt("error",e,...t)},debug:function(e,...t){this.fmt("debug",e,...t)}}}},t={};function r(o){var s=t[o];if(void 0!==s)return s.exports;var n=t[o]={exports:{}};return e[o](n,n.exports,r),n.exports}r.d=function(e,t){for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)};class o{handle;origin;syncToken;promises;messageChannel;connected;constructor(e,t){this.handle=e,this.origin=t,this.syncToken=0,this.promises={},this.messageChannel=new MessageChannel,this.connected=!1,this.messageChannel.port1.addEventListener("message",e=>{"scramjet$type"in e.data&&("init"===e.data.scramjet$type?this.connected=!0:this.handleMessage(e.data))}),this.messageChannel.port1.start(),this.handle.postMessage({scramjet$type:"init",scramjet$port:this.messageChannel.port2},[this.messageChannel.port2])}handleMessage(e){let t=this.promises[e.scramjet$token];t&&(t(e),delete this.promises[e.scramjet$token])}async fetch(e){let t=this.syncToken++,r={scramjet$type:"fetch",scramjet$token:t,scramjet$request:{url:e.url,body:e.body,headers:Array.from(e.headers.entries()),method:e.method,mode:e.mode,destinitation:e.destination}},o=e.body?[e.body]:[];this.handle.postMessage(r,o);let{scramjet$response:s}=await new Promise(e=>{this.promises[t]=e});return!!s&&new Response(s.body,{headers:s.headers,status:s.status,statusText:s.statusText})}}!("$scramjet"in self)&&(self.$scramjet={version:{build:"909fd31",version:"1.0.2-dev"},codec:{},flagEnabled:function(e,t){let r=s.config.defaultFlags[e];for(let r in s.config.siteFlags){let o=s.config.siteFlags[r];if(new RegExp(r).test(t.href)&&e in o)return o[e]}return r}});let s=self.$scramjet,n=Function,{util:{BareClient:i,ScramjetHeaders:a,BareMuxConnection:c},url:{rewriteUrl:l,unrewriteUrl:d,rewriteBlob:u,unrewriteBlob:h},rewrite:{rewriteCss:f,unrewriteCss:m,rewriteHtml:p,unrewriteHtml:g,rewriteSrcset:y,rewriteJs:b,rewriteHeaders:w,rewriteWorkers:v,htmlRules:k},CookieStore:x}=s.shared;function R(e){return{origin:e,base:e}}async function S(e,t){let r=new URLSearchParams(new URL(e.url).search);if(r.has("url"))return Response.redirect(l(r.get("url"),R(new URL(r.get("url")))));try{let o=new URL(e.url),n="";if(o.searchParams.has("type")&&(n=o.searchParams.get("type"),o.searchParams.delete("type")),o.searchParams.has("dest")&&o.searchParams.delete("dest"),o.pathname.startsWith(this.config.prefix+"blob:")||o.pathname.startsWith(this.config.prefix+"data:")){let r,s=o.pathname.substring(this.config.prefix.length);s.startsWith("blob:")&&(s=h(s));let i=await fetch(s,{});i.body&&(r=await j(i,t?{base:new URL(new URL(t.url).origin),origin:new URL(new URL(t.url).origin)}:R(new URL(d(e.referrer))),e.destination,n,this.cookieStore));let a=Object.fromEntries(i.headers.entries());return crossOriginIsolated&&(a["Cross-Origin-Opener-Policy"]="same-origin",a["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(r,{status:i.status,statusText:i.statusText,headers:a})}let i=new URL(d(o)),c=this.serviceWorkers.find(e=>e.origin===i.origin);if(c&&c.connected&&"swruntime"!==r.get("from")){let t=await c.fetch(e);if(t)return t}if(i.origin==new URL(e.url).origin)throw Error("attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting");let l=new a;for(let[t,r]of e.headers.entries())l.set(t,r);if(t&&new URL(t.url).pathname.startsWith(s.config.prefix)){let e=new URL(d(t.url));e.toString().includes("youtube.com")||(l.set("Referer",e.toString()),l.set("Origin",e.origin))}let u=this.cookieStore.getCookies(i,!1);u.length&&l.set("Cookie",u),l.set("Sec-Fetch-Mode","cors"),l.set("Sec-Fetch-Site","same-origin"),l.set("Sec-Fetch-Dest","empty");let f=new E("request");f.url=i,f.body=e.body,f.method=e.method,f.destination=e.destination,f.client=t,f.requestHeaders=l.headers,this.dispatchEvent(f);let m=f.response||await this.client.fetch(f.url,{method:f.method,body:f.body,headers:f.requestHeaders,credentials:"omit",mode:"cors"===e.mode?e.mode:"same-origin",cache:e.cache,redirect:"manual",duplex:"half"});return await $(i,n,e.destination,m,this.cookieStore,t,this)}catch(t){if(console.error("ERROR FROM SERVICE WORKER FETCH",t),!["document","iframe"].includes(e.destination))return new Response(void 0,{status:500});return function(e,t){let r={"content-type":"text/html"};return crossOriginIsolated&&(r["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(function(e,t){let r=`
                errorTrace.value = ${JSON.stringify(e)};
                fetchedURL.textContent = ${JSON.stringify(t)};
                for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(location.hostname)};
                reload.addEventListener("click", () => location.reload());
                version.textContent = ${JSON.stringify(s.version.version)};
                build.textContent = ${JSON.stringify(s.version.build)};
        `;return`<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Scramjet</title>
        <style>
        :root {
            --deep: #080602;
            --shallow: #181412;
            --beach: #f1e8e1;
            --shore: #b1a8a1;
            --accent: #ffa938;
            --font-sans: -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
            --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        *:not(div,p,span,ul,li,i,span) {
            background-color: var(--deep);
            color: var(--beach);
            font-family: var(--font-sans);
        }

        textarea,
        button {
            background-color: var(--shallow);
            border-radius: 0.6em;
            padding: 0.6em;
            border: none;
            appearance: none;
            font-family: var(--font-sans);
            color: var(--beach);
        }

        button.primary {
            background-color: var(--accent);
            color: var(--deep);
            font-weight: bold;
        }

        textarea {
            resize: none;
            height: 20em;
            text-align: left;
            font-family: var(--font-monospace);
        }

        body {
            width: 100vw;
            height: 100vh;
            justify-content: center;
            align-items: center;
        }

        body,
        html,
        #inner {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 0.5em;
            overflow: hidden;
        }

        #inner {
            z-index: 100;
        }

        #cover {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: color-mix(in srgb, var(--deep) 70%, transparent);
            z-index: 99;
        }

        #info {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 1em;
        }

        #version-wrapper {
            width: 100%;
            text-align: center;
            position: absolute;
            bottom: 0.2rem;
            font-size: 0.8rem;
            color: var(--shore)!important;
            i {
                background-color: color-mix(in srgb, var(--deep), transparent 50%);
                border-radius: 9999px;
                padding: 0.2em 0.5em;
            }
            z-index: 101;
        }
        </style>
    </head>
    <body>
        <div id="cover"></div>
        <div id="inner">
            <h1 id="errorTitle">Uh oh!</h1>
            <p>There was an error loading <b id="fetchedURL"></b></p>
            <!-- <p id="errorMessage">Internal Server Error</p> -->

            <div id="info">
                <textarea id="errorTrace" cols="40" rows="10" readonly>
                </textarea>
                <div id="troubleshooting">
                    <p>Try:</p>
                    <ul>
                        <li>Checking your internet connection</li>
                        <li>Verifying you entered the correct address</li>
                        <li>Clearing the site data</li>
                        <li>Contacting <b id="hostname"></b>'s administrator</li>
                        <li>Verify the server isn't censored</li>
                    </ul>
                    <p>If you're the administrator of <b id="hostname"></b>, try:</p>
                        <ul>
                        <li>Restarting your server</li>
                        <li>Updating Scramjet</li>
                        <li>Troubleshooting the error on the <a href="https://github.com/MercuryWorkshop/scramjet" target="_blank">GitHub repository</a></li>
                    </ul>
                </div>
            </div>
            <br>
            <button id="reload" class="primary">Reload</button>
        </div>
        <p id="version-wrapper"><i>Scramjet v<span id="version"></span> (build <span id="build"></span>)</i></p>
        <script src="${"data:application/javascript,"+encodeURIComponent(r)}"></script>
    </body>
</html>

        `}(String(e),t),{status:500,headers:r})}(t,d(e.url))}}async function $(e,t,r,o,s,n,i){let a;let c=w(o.rawHeaders,R(e)),l=c["set-cookie"]||[];for(let t in l)n&&n.postMessage({scramjet$type:"cookie",cookie:t,url:e.href});for(let t in await s.setCookies(l instanceof Array?l:[l],e),c)Array.isArray(c[t])&&(c[t]=c[t][0]);if(o.body&&(a=await j(o,R(e),r,t,s)),["document","iframe"].includes(r)){let e=c["content-disposition"];if(!/\s*?((inline|attachment);\s*?)filename=/i.test(e)){let t=/^\s*?attachment/i.test(e)?"attachment":"inline",[r]=new URL(o.finalURL).pathname.split("/").slice(-1);c["content-disposition"]=`${t}; filename=${JSON.stringify(r)}`}}"text/event-stream"===c.accept&&(c["content-type"]="text/event-stream"),delete c["permissions-policy"],crossOriginIsolated&&["document","iframe","worker","sharedworker","style","script"].includes(r)&&(c["Cross-Origin-Embedder-Policy"]="require-corp",c["Cross-Origin-Opener-Policy"]="same-origin");let d=new C("handleResponse");return d.responseBody=a,d.responseHeaders=c,d.status=o.status,d.statusText=o.statusText,d.destination=r,d.url=e,d.rawResponse=o,d.client=n,i.dispatchEvent(d),new Response(d.responseBody,{headers:d.responseHeaders,status:d.status,statusText:d.statusText})}async function j(e,t,r,o,s){switch(r){case"iframe":case"document":if(e.headers.get("content-type")?.startsWith("text/html"))return p(await e.text(),s,t,!0);return e.body;case"script":return b(await e.arrayBuffer(),t);case"style":return f(await e.text(),t);case"sharedworker":case"worker":return v(await e.arrayBuffer(),o,t);default:return e.body}}s.config;class C extends Event{responseHeaders;responseBody;status;statusText;destination;url;rawResponse;client}class E extends Event{url;destination;client;method;body;requestHeaders;response}var O=r(1762).Z;class T extends EventTarget{client;config;syncPool={};synctoken=0;cookieStore=new s.shared.CookieStore;serviceWorkers=[];constructor(){super(),this.client=new s.shared.util.BareClient;let e=indexedDB.open("$scramjet",1);e.onsuccess=()=>{let t=e.result.transaction("cookies","readonly").objectStore("cookies").get("cookies");t.onsuccess=()=>{t.result&&(this.cookieStore.load(t.result),O.log("Loaded cookies from IDB!"))}},addEventListener("message",async({data:t})=>{if("scramjet$type"in t){if("registerServiceWorker"===t.scramjet$type){this.serviceWorkers.push(new o(t.port,t.origin));return}"cookie"===t.scramjet$type&&(this.cookieStore.setCookies([t.cookie],new URL(t.url)),e.result.transaction("cookies","readwrite").objectStore("cookies").put(this.cookieStore.dump(),"cookies"))}})}async loadConfig(){if(this.config)return;let e=indexedDB.open("$scramjet",1);return new Promise((t,r)=>{e.onsuccess=async()=>{let o=e.result.transaction("config","readonly").objectStore("config").get("config");o.onsuccess=()=>{this.config=o.result,s.config=o.result,s.codec.encode=n("url",s.config.codec.encode),s.codec.decode=n("url",s.config.codec.decode),t()},o.onerror=()=>r(o.error)},e.onerror=()=>r(e.error)})}route({request:e}){return!!e.url.startsWith(location.origin+this.config.prefix)||!1}async fetch({request:e,clientId:t}){let r=await self.clients.get(t);return S.call(this,e,r)}}self.ScramjetServiceWorker=T})();
//# sourceMappingURL=scramjet.worker.js.map