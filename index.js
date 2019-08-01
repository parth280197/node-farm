const http = require('http');
const url = require('url');
const fs = require('fs');
//server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;
  if (pathName === '/' || pathName === '/overview') {
    res.end("This is overview");
  } else if (pathName === '/product') {
    res.end('This is the product');
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text-html',
      'own-header': 'hello world',
    });
    res.end('<h1>404 Not Found</h1>');
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
})
