var express = require('express');
var app = express();

app.use(express.static('./'))

var port = 8711;

console.log("http://localhost:"+port);
console.log("でサーバを起動しました。");

app.listen(port)