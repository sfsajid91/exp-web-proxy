/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/proxy/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.base64.encode,
    decodeUrl: Ultraviolet.codec.base64.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

self.addEventListener('DOMContentLoaded', () => {
    if (!window.location.href.includes(__uv$config.prefix)) return;

    const css = `
        #topbar, #topbar * {
            all: initial;
        }
        #topbar {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.3s ease;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            grid-auto-rows: 1fr;
            z-index: 9999;
        }
        #topbar .bar-container {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 0 0 5px 5px;
            padding: 5px 10px;
            display: flex;
            gap: 4px;
            align-items: center;
        }
        #topbar.collapsed {
            transform: translateY(-50%) translateX(-50%);
        }
        #topbar input {
            width: 300px;
            padding: 5px;
            margin-right: 5px;
            border: 1px solid #ccc;
            color: #333;
        }
        #topbar button, #topbar btn {
            padding: 5px 10px;
            background-color: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
        #url-form {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 4px;
        }
        #topbar .toggle-btn {
            background-color: #ddd;
            font-size: 0.75rem;
            padding: 10px;
            color: #333;
            display: block;
            margin-left: auto;
        }
    `;

    document.head.appendChild(document.createElement('style')).textContent =
        css;

    const topbar = document.createElement('div');
    topbar.id = 'topbar';
    topbar.classList.add('collapsed');
    const topbarContent = `
    <div class="bar-container">
        <form id="url-form">
            <button type="button" id="home-btn">🏠 Home</button>
            <input type="url" id="url-input" placeholder="Enter URL" />
            <button type="submit">Go</button>
        </form>
    </div>
    <div class="toggle-btn-container">
        <button class="toggle-btn" id="toggle-btn">▼</button>
    </div>
    `;
    topbar.innerHTML = topbarContent;
    document.body.appendChild(topbar);

    const toggleBtn = document.getElementById('toggle-btn');
    const urlInput = document.getElementById('url-input');
    const urlForm = document.getElementById('url-form');
    const homeBtn = document.getElementById('home-btn');

    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

    // set the initial url
    const initialUrl = window.location.href.split(__uv$config.prefix)[1];
    urlInput.value = __uv$config.decodeUrl(initialUrl);

    topbar.addEventListener('focusout', (event) => {
        if (!topbar.contains(event.relatedTarget)) {
            topbar.classList.add('collapsed');
        }
    });

    urlForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let url = urlInput.value.trim();
        if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
        else if (!(url.startsWith('https://') || url.startsWith('http://')))
            url = 'http://' + url;

        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });

    function isUrl(val = '') {
        return (
            /^https?:\/\//.test(val) ||
            (val.includes('.') && !val.startsWith(' '))
        );
    }

    toggleBtn.addEventListener('click', () => {
        topbar.classList.toggle('collapsed');
        toggleBtn.textContent = topbar.classList.contains('collapsed')
            ? '▼'
            : '▲';
    });
});

// create a fixed top bar with a url input and a collapse/expand button
