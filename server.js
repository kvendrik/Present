var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

io.on('connection', function(socket){
  socket.on('change', function(idxs){
    socket.broadcast.emit('change', idxs);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});