const { fstat } = require('fs');
const { connect } = require('http2');

var app=require('express')();
var http=require('http').createServer(app);
var io=require('socket.io')(http);
var fs=require('fs');

//創建https
let sslOptions={
    key:fs.readFileSync(__dirname + '/privkey.key'),
    cert:fs.readFileSync(__dirname + '/cacert.pem')
};

const https = require('https').createServer(sslOptions, app);
https.listen(443,()=>{
    console.log('https:!!!');
})


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

app.get('/camera',(req,res)=>{
    res.sendFile(__dirname + '/camera.html');
})

http.listen(4000,()=>{
    console.log('http:???');
})

io.on('connection',(socket)=>{

    console.log('a user connected '+socket.id);

    socket.on('disconnect',()=>{
        console.log('disc '+socket.id);
    })

    /*socket.on('chat message',(msg)=>{
        console.log(socket.id+' : '+msg);
    })*/

    socket.on('chat message',(msg)=>{
        socket.broadcast.emit('chat message',msg);
    })

})