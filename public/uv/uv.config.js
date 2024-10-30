/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/uv/proxy/',
    encodeUrl: Ultraviolet.codec.base64.encode,
    decodeUrl: Ultraviolet.codec.base64.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    reactApp: '/reactlkjps/',
};

self.addEventListener('DOMContentLoaded', () => {
    if (!self.location.href.includes(__uv$config.prefix)) return;

    const root = self.document.createElement('div');
    root.id = __uv$config.reactApp + 'root' || 'react-root';
    const shadowRoot = root.attachShadow({ mode: 'open' });
    self.document.body.appendChild(root);

    const reactApp = self.document.createElement('script');
    reactApp.src = __uv$config.reactApp + 'bundle.js';
    reactApp.defer = true;
    reactApp.type = 'module';
    shadowRoot.appendChild(reactApp);

    const reactStyle = self.document.createElement('link');
    reactStyle.href = __uv$config.reactApp + 'index.css';
    reactStyle.rel = 'stylesheet';
    shadowRoot.appendChild(reactStyle);
});
