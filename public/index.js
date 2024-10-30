const form = document.querySelector('#url-form');
const input = document.querySelector('#url-input');
const quickLinks = document.querySelectorAll('.quick-link');

quickLinks.forEach((link) => {
    const originalHref = link.getAttribute('data-url');
    link.href = __uv$config.prefix + __uv$config.encodeUrl(originalHref);
});
const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

window.addEventListener('load', async () => {
    try {
        await registerSW();

        let wispUrl =
            (location.protocol === 'https:' ? 'wss' : 'ws') +
            '://' +
            location.host +
            '/wisp/';

        if ((await connection.getTransport()) !== '/epoxy/index.mjs') {
            await connection.setTransport('/epoxy/index.mjs', [
                { wisp: wispUrl },
            ]);
        }
    } catch (err) {
        console.error('Service Worker Registration Failed:', err);
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let url = input.value.trim();
    if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
    else if (!(url.startsWith('https://') || url.startsWith('http://')))
        url = 'http://' + url;

    // window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    window.open(__uv$config.prefix + __uv$config.encodeUrl(url), '_blank');
});

function isUrl(val = '') {
    return (
        /^https?:\/\//.test(val) || (val.includes('.') && !val.startsWith(' '))
    );
}
