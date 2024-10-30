import { useState } from 'react';

export default function App() {
    const config = window.__uv$config || null;

    const [collapsed, setCollapsed] = useState(true);
    const [url, setUrl] = useState(
        config.decodeUrl(window.location.href.split(config.prefix)[1]) || ''
    );

    const toggleCollapsed = () => setCollapsed(!collapsed);

    const handleUrlChange = (event) => setUrl(event.target.value);

    const handleHomeClick = () => {
        window.location.href = '/';
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let formattedUrl = url.trim();
        if (!isUrl(formattedUrl))
            formattedUrl = 'https://www.google.com/search?q=' + formattedUrl;
        else if (
            !formattedUrl.startsWith('http://') &&
            !formattedUrl.startsWith('https://')
        ) {
            formattedUrl = 'http://' + formattedUrl;
        }
        window.location.href = config.encodeUrl(formattedUrl) || formattedUrl;
    };

    const isUrl = (val = '') =>
        /^https?:\/\//.test(val) || (val.includes('.') && !val.startsWith(' '));

    if (!config) return <div>No config</div>;

    return (
        <div
            id="topbar"
            className={`bar-container ${collapsed ? 'collapsed' : ''}`}
        >
            <form id="url-form" onSubmit={handleFormSubmit}>
                <button type="button" onClick={handleHomeClick}>
                    🏠 Home
                </button>
                <input
                    type="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter URL"
                />
                <button type="submit">Go</button>
            </form>
            <button className="toggle-btn" onClick={toggleCollapsed}>
                {collapsed ? '▼' : '▲'}
            </button>
        </div>
    );
}
