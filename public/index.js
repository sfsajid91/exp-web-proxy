const form = document.querySelector('#url-form');
const input = document.querySelector('#url-input');
const quickLinks = document.querySelectorAll('.quick-link');

quickLinks.forEach((link) => {
    const originalHref = link.getAttribute('data-url');
    link.href = __uv$config.prefix + __uv$config.encodeUrl(originalHref);
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await window.navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix,
    });

    let url = input.value.trim();
    if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
    else if (!(url.startsWith('https://') || url.startsWith('http://')))
        url = 'http://' + url;

    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});

function isUrl(val = '') {
    return (
        /^https?:\/\//.test(val) || (val.includes('.') && !val.startsWith(' '))
    );
}
