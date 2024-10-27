class CustomSharedWorker {
    constructor(scriptURL) {
        this.ports = new Set();
        this.messageQueue = [];
        this.isInitialized = false;

        // Load and execute the worker script
        fetch(scriptURL)
            .then((response) => response.text())
            .then((code) => {
                // Create a safe execution context
                const workerContext = {
                    onconnect: null,
                    postMessage: this.broadcast.bind(this),
                    addEventListener: this.addEventListener.bind(this),
                    removeEventListener: this.removeEventListener.bind(this),
                    close: () => {
                        this.ports.clear();
                        this.messageQueue = [];
                    },
                };

                // Execute the worker code in the context
                const executeWorker = new Function('self', code);
                executeWorker(workerContext);

                this.workerContext = workerContext;
                this.isInitialized = true;

                // Process any queued messages
                this.messageQueue.forEach((msg) => this.handleMessage(msg));
                this.messageQueue = [];
            });
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
