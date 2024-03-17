const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');

const App = require('./shared/App').default;

const server = express();

server.use(express.static('dist'));

server.get('*', (req, res) => {
  const context = {};
  const appString = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App type="SSR" />
    </StaticRouter>
  );
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div id="root">${appString}</div>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
