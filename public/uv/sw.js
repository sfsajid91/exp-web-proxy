importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

const uv = new UVServiceWorker();

const isReactRoute = (url) => {
    try {
        const decodedUrl = __uv$config.decodeUrl(
            url.split(__uv$config.prefix)[1]
        );
        return decodedUrl.includes(__uv$config.reactApp);
    } catch (error) {
        return false;
    }
};

async function handleRequest(event) {
    if (uv.route(event)) {
        if (isReactRoute(event.request.url)) {
            const decodedUrl = __uv$config.decodeUrl(
                event.request.url.split(__uv$config.prefix)[1]
            );
            const newUrl = new URL(decodedUrl);

            return fetch(newUrl.pathname);
        }
        return await uv.fetch(event);
    }

    return await fetch(event.request);
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});
