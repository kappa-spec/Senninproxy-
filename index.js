import express from 'express';
import http from 'node:http';
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http.createServer();
const app = express();
const bare = createBareServer('/bare/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Ultravioletの公式静的ファイルを/uv/として配信（重要）
app.use('/uv/', express.static(uvPath));

// 2. 自分の静的ファイル（publicフォルダ）を配信
app.use(express.static(path.join(__dirname, 'public')));

// 3. 検索API (DuckDuckGo固定)
app.get('/api/search', (req, res) => {
    const q = req.query.q;
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    res.json({ url });
});

// Bareサーバーのルーティング設定
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
