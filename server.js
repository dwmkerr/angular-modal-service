var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'samples')));
app.use(express.static(path.join(__dirname, 'src')));
app.listen(3000);
console.log('Rocking port 3000');