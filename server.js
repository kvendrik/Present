var express = require('express'),
    app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var options = {},
    defaults = {
        port: 1337
    };

var extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};

//parse command line args
process.argv.forEach(function(val, idx){
    if(val.indexOf('--') === 0){
        //is flag
        var parts = val.replace('--', '').split('='),
            val = parts[1];

        if(typeof val === 'undefined'){
            //is undefined
            val = true;
        } else if(!isNaN(val)){
            //is number
            val = Number(val);
        }

        options[parts[0]] = val;
    }
});

//merge default and options
var options = extend({}, defaults, options);

//listen for connections
io.on('connection', function(socket){
    socket.on('change', function(idxs){
        console.log(idxs);
        socket.broadcast.emit('change', idxs);
    });
});

//serve static files on req
app.use('/', express.static(__dirname+'/app'));

//listen on port
http.listen(options.port, function() {
    console.log('listening on *:'+options.port);
});
