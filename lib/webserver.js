module.exports = app => {
  
  app.get('/', function (req, res) {
    res.sendFile('/index.html');
  });
  
  var server = app.listen(3000, function () {

    var port = server.address().port;
    console.log((new Date()) + ' canvasgame webserver listening at %d', port);
    console.log((new Date()) + ' http://localhost:%d', port);
  
  });
}