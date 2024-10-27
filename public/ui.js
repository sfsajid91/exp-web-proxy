const scramjet = new ScramjetController({
    files: {
        wasm: '/scram/scramjet.wasm.js',
        worker: '/scram/scramjet.worker.js',
        client: '/scram/scramjet.client.js',
        shared: '/scram/scramjet.shared.js',
        sync: '/scram/scramjet.sync.js',
    },
    siteFlags: {
        'https://worker-playground.glitch.me/.*': {
            serviceworkers: true,
        },
    },
    // codec: {
    //     encode: `if (!url) return url;
    // return btoa(encodeURIComponent(url));`,
    //     decode: `if (!url) return url;
    // return decodeURIComponent(atob(url));`,
    // },
});

scramjet.init('./sw.js');

const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

const store = $store(
    {
        url: 'https://google.com',
        wispurl:
            _CONFIG?.wispurl ||
            (location.protocol === 'https:' ? 'wss' : 'ws') +
                '://' +
                location.host +
                '/wisp/',
        bareurl:
            _CONFIG?.bareurl ||
            (location.protocol === 'https:' ? 'https' : 'http') +
                '://' +
                location.host +
                '/bare/',
        proxy: '',
    },
    { ident: 'settings', backing: 'localstorage', autosave: 'auto' }
);

connection.setTransport('/epoxy/index.mjs', [{ wisp: store.wispurl }]);

window.addEventListener('load', async () => {
    const form = document.querySelector('#url-form');
    const input = document.querySelector('#url-input');
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach((link) => {
        const originalHref = link.getAttribute('data-url');
        link.href = scramjet.encodeUrl(originalHref);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        let url = input.value.trim();
        if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
        else if (!(url.startsWith('https://') || url.startsWith('http://')))
            url = 'http://' + url;

        window.open(scramjet.encodeUrl(url));
    });
});
function isUrl(val = '') {
    return (
        /^https?:\/\//.test(val) || (val.includes('.') && !val.startsWith(' '))
    );
}
