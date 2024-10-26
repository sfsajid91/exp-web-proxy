import { createBareServer } from '@nebula-services/bare-server-node';
import express from 'express';
import { createServer } from 'http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wisp from 'wisp-server-node';

//transports
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';

// dirnames
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);

const bare = createBareServer('/bare/', {
    logErrors: true,
    blockLocal: false,
});

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use((req, res, next) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, './public')));
app.use('/scram', express.static(path.join(__dirname, './scramjet')));
app.use('/baremux', express.static(baremuxPath));
app.use('/epoxy', express.static(epoxyPath));

httpServer.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        wisp.routeRequest(req, socket, head);
    }
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
});
