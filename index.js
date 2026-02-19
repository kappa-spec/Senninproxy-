import express from 'express';
import http from 'node:http';
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from 'cors';
import path from 'node:path';

const server = http.createServer();
const app = express();
const rootDir = process.cwd();
const bareServer = createBareServer('/bare/');
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(rootDir, "public")));

// 検索エンジンAPI (DuckDuckGo, Startpage, Braveを順に試行)
app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "missing q" });

  const engines = [
    "https://duckduckgo.com/?q=%s",
    "https://www.startpage.com/sp/search?q=%s",
    "https://search.brave.com/search?q=%s"
  ];

  const query = encodeURIComponent(q);

  for (const tpl of engines) {
    const url = tpl.replace("%s", query);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const r = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      clearTimeout(timer);
      if (r.ok) return res.json({ url });
    } catch (e) {
      // 次のエンジンへ
    }
  }
  return res.json({ url: `https://duckduckgo.com/?q=${query}` });
});

// Bare Serverのルーティング
server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`Chrome OS Server Listening on ${PORT}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  server.close(() => {
    bareServer.close();
    process.exit(0);
  });
}
