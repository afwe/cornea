const { connect } = require('http2');

var app=require('express')();
var http=require('http').createServer(app);
var io=require('socket.io')(http);
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})
http.listen(4000,()=>{
    console.log('???');
})
io.on('connection',(socket)=>{
    console.log('a user connected '+socket.id);
    socket.on('disconnect',()=>{
        console.log('disc '+socket.id);
    })
    socket.on('chat message',(msg)=>{
        console.log(socket.id+' : '+msg);
    })
})