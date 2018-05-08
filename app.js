const http = require('http')
const { PORT = 3000 } = process.env
const ShowLink = require('./nobrowser')
http.createServer((req, res) => {
  ShowLink.showlinks().then(d => {
    res.end(d);
  })
}).listen(PORT)
