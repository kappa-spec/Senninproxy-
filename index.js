const express = require('express');
const { createServer } = require('node:http');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const path = require('node:path');

const app = express();
const server = createServer(app);

// Ultravioletのコアファイルを配信
app.use('/uv/', express.static(uvPath));

// フロントエンドファイルを配信
app.use(express.static(path.join(__dirname, 'public')));

// 404エラー時はメインページへ戻す設定
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
