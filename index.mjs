import express from 'express';
import { createServer } from 'node:http';
import { hostname } from 'node:os';
import path from 'node:path';
import wisp from 'wisp-server-node';

// static paths
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

const app = express();
const server = createServer(app);

const __dirname = path.resolve();
const publicPath = path.join(__dirname, 'public');

// Middleware to set headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Static file serving
app.use(express.static(publicPath));
app.use('/uv/', express.static(uvPath));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/baremux/', express.static(baremuxPath));

// Special route for uv.config.js
app.get('/uv/uv.config.js', (req, res) => {
    res.sendFile('uv/uv.config.js', { root: publicPath });
});

// WebSocket upgrade handling
server.on('upgrade', (req, socket, head) => {
    if (req.url.endsWith('/wisp/')) wisp.routeRequest(req, socket, head);
    else socket.end();
});

// Listening event
server.on('listening', () => {
    const address = server.address();

    console.log('Listening on:');
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
    console.log(
        `\thttp://${
            address.family === 'IPv6' ? `[${address.address}]` : address.address
        }:${address.port}`
    );
});

// Shutdown handling
function shutdown() {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Port configuration
let port = parseInt(process.env.PORT || '');
if (isNaN(port)) port = 3000;

// Start the server
server.listen(port, '0.0.0.0');
