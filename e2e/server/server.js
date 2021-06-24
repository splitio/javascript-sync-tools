const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const PORT = 3000;

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/segmentChanges/:name\\?since=:since': '/segmentChanges?name=:name&since=:since',
}));

server.use(middlewares);

// eslint-disable-next-line
function modifyResponseBody(req, res, next) {
  var oldSend = res.send;

  res.send = function () {
    // arguments[0] (or `data`) contains the response body
    const newBody = JSON.parse(arguments[0]).pop();
    arguments[0] = JSON.stringify(newBody);
    oldSend.apply(res, arguments);
  };
  next();
}

server.use(modifyResponseBody);

server.use(router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});
