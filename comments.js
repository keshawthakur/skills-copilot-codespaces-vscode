// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl.pathname);

  if (parsedUrl.pathname === '/comments' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  } else if (parsedUrl.pathname === '/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const comment = JSON.parse(body);
      comments.push(comment);
      fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(201);
          res.end();
        }
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});