const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

require('../ioHandler')(io);

module.exports = app;
