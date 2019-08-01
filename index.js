const http = require('http');
const url = require('url');
const fs = require('fs');
//server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const dataObj = JSON.parse(data);
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ORGANIC%}/g, product.organic);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);

  return output;
}

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //Overview page
  if (pathname === '/' || pathname === '/overview') {

    res.writeHead(200, { 'Content-type': 'text-html' });
    const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardHtml);
    console.log(cardHtml);
    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //Api
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
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
