var express = require('express');
var app = express();
app.use(express.static('public'));

const libs = require('./lib');
libs.forEach(lib => require(`./lib/${lib}`)(app));