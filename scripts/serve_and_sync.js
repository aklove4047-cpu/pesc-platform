const http = require('http');
const fs = require('fs');
const path = require('path');

const payloadPath = path.join(__dirname, 'sync_payload.json');
const payload = fs.readFileSync(payloadPath);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.url === '/payload') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(payload);
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(3335, () => {
  console.log('SYNC_SERVER_READY_PORT_3335');
});
