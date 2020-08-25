var express = require('express');
var app = express();
app.use(express.static('public'));

const libs = require('./libs');
libs.forEach(lib => require(`./libs/${lib}`)(app));