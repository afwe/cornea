const { fstat } = require('fs');
const { connect } = require('http2');

var app=require('express')();
var http=require('http').createServer(app);
var fs=require('fs');

//創建https
let sslOptions={
    key:fs.readFileSync(__dirname + '/privkey.key'),
    cert:fs.readFileSync(__dirname + '/cacert.pem')
};

const https = require('https').createServer(sslOptions, app);

var io=require('socket.io')(https);

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

io.on('connect',(socket)=>{
    //链接加入
    socket.join(socket.id);

    console.log('a user connected '+socket.id);

    socket.on('disconnect',()=>{
        console.log('disc '+socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
    })

    /*socket.on('chat message',(msg)=>{
        console.log(socket.id+' : '+msg);
    })*/

    socket.on('chat message',(msg)=>{
        socket.broadcast.emit('chat message',msg);
    })/*获得某用户的广播消息*/

    socket.on('new user on', (data)=>{
        console.log(socket.id + '  say  ' + data.msg);
        socket.broadcast.emit('need connect', {
            sender : socket.id, 
            msg : data.msg
        });
    })/*用户加入发信*/

    socket.on('connect ok', (data)=>{
        io.to(data.receiver).emit('connect ok',{
            sender : data.sender
        });
    })/*回响*/

    socket.on('sdp', (data)=>{
        console.log('sdp');
        console.log(data.description);
        socket.to(data.to).emit('sdp', {
            description: data.description, 
            sender: data.sender
        });
    })

    socket.on('ice candidates', (data)=>{
        console.log('ice candidate: '+data);
        socket.to(data.to).emit('ice candidates ',{
            cadidate: data.candidates, 
            sender: data.sender
        })
    })



})