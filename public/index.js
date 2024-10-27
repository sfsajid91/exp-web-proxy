const form = document.querySelector('#url-form');
const input = document.querySelector('#url-input');
const quickLinks = document.querySelectorAll('.quick-link');

quickLinks.forEach((link) => {
    const originalHref = link.getAttribute('data-url');
    link.href = __uv$config.prefix + __uv$config.encodeUrl(originalHref);
});

window.addEventListener('load', async () => {
    try {
        await registerSW();
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

    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});

function isUrl(val = '') {
    return (
        /^https?:\/\//.test(val) || (val.includes('.') && !val.startsWith(' '))
    );
}

async function registerSW() {
    // Check if service workers are supported
    if (!navigator.serviceWorker) {
        throw new Error('Service workers are not supported in this browser');
    }

    // Check if already registered
    const registration = await navigator.serviceWorker.getRegistration(
        __uv$config.prefix
    );
    if (registration) {
        console.log('Service worker already registered');
        return registration;
    }

    // Register new service worker with specific options
    const sw = await navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix,
        updateViaCache: 'none',
        type: 'module',
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    console.log('Service worker registered successfully');
    return sw;
}
