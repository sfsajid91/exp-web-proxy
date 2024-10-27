class CustomSharedWorker {
    constructor(scriptURL, options = {}) {
        this.scriptURL = scriptURL;
        this.name = options.name || '';
        this.ports = new Set();
        this.messageQueue = [];
        this.isInitialized = false;
        this.onerror = null;

        this.init();
    }

    init() {
        fetch(this.scriptURL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then((code) => {
                const workerContext = {
                    name: this.name,
                    onconnect: null,
                    onerror: this.handleError.bind(this),
                    postMessage: this.broadcast.bind(this),
                    addEventListener: this.addEventListener.bind(this),
                    removeEventListener: this.removeEventListener.bind(this),
                    close: this.terminate.bind(this),
                };

                try {
                    const executeWorker = new Function('self', code);
                    executeWorker(workerContext);
                } catch (error) {
                    this.handleError(error);
                    return;
                }

                this.workerContext = workerContext;
                this.isInitialized = true;

                this.messageQueue.forEach((msg) => this.handleMessage(msg));
                this.messageQueue = [];
            })
            .catch(this.handleError.bind(this));
    }

    handleError(error) {
        console.error('CustomSharedWorker error:', error);
        if (this.onerror) {
            this.onerror(error);
        }
    }

    terminate() {
        this.ports.forEach((port) => port.close());
        this.ports.clear();
        this.messageQueue = [];
        this.isInitialized = false;
        this.workerContext = null;
    }

    // Create a new MessagePort-like interface
    createPort() {
        const port = {
            start: () => {},
            close: () => this.ports.delete(port),
            postMessage: (message) => {
                if (this.isInitialized) {
                    this.handleMessage({ data: message, port });
                } else {
                    this.messageQueue.push({ data: message, port });
                }
            },
            addEventListener: (type, listener) => {
                port.listeners = port.listeners || new Map();
                if (!port.listeners.has(type)) {
                    port.listeners.set(type, new Set());
                }
                port.listeners.get(type).add(listener);
            },
            removeEventListener: (type, listener) => {
                if (port.listeners?.has(type)) {
                    port.listeners.get(type).delete(listener);
                }
            },
            dispatchEvent: (event) => {
                const listeners = port.listeners?.get(event.type) || new Set();
                listeners.forEach((listener) => listener(event));
            },
            onerror: null,
        };

        // Simulate MessagePort connection
        this.ports.add(port);
        if (this.workerContext?.onconnect) {
            this.workerContext.onconnect({
                ports: [port],
            });
        }

        return port;
    }

    // Handle incoming messages from ports
    handleMessage({ data, port }) {
        if (this.workerContext?.onmessage) {
            this.workerContext.onmessage({
                data,
                ports: Array.from(this.ports),
                source: port,
            });
        }
    }

    // Broadcast message to all connected ports
    broadcast(message) {
        this.ports.forEach((port) => {
            port.dispatchEvent(new MessageEvent('message', { data: message }));
        });
    }

    addEventListener(type, listener) {
        this.workerContext.onmessage = listener;
    }

    removeEventListener(type, listener) {
        if (this.workerContext.onmessage === listener) {
            this.workerContext.onmessage = null;
        }
    }
}

// Polyfill for environments without SharedWorker
if (typeof SharedWorker === 'undefined') {
    window.SharedWorker = CustomSharedWorker;
}
