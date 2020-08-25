module.exports = app => {

  var server = app.listen(3000, function () {

    var port = server.address().port;
    console.log((new Date()) + ' canvasgame webserver listening at %d', port);
    console.log((new Date()) + ' http://localhost:%d', port);
  
  });

}