import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer();
const port = process.env.PORT || 3000;

// Create bare server
const bareServer = createBareServer('/bare/');

// bareServer.on('request', (req, res) => {
//     console.log('Bare server request');
//     res.end('Hello, world!');
// });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uv/', express.static(uvPath));

// Handle requests
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// Handle upgrades
server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

// Start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Handle shutdown
process.on('SIGINT', () => {
    bareServer.close();
    process.exit(0);
});
