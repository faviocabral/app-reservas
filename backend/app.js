const express = require("express")
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { 
    cors: {
      origin: "http://localhost:3000",
      methods: ['GET', 'POST']
    }
});


io.on("connection", (socket) => {
  console.log("conectado al servidor socket.. " , socket.id)
  //cuando alguien se conecta avisar a todos.. 
  socket.broadcast.emit("usuarios", 'contado al servidor ' + socket.id)

    socket.on('connect', (msg)=>{
        console.log('alguien se conecto', msg)
    })

    socket.on('addEvent', (msg)=>{
      console.log(msg)
      socket.broadcast.emit("addingEvent",  msg )
    })

    socket.on('changeEvent', (msg)=>{
      console.log(msg)
      socket.broadcast.emit("changingEvent",  msg )
    })

    socket.on('addedEvent', (msg)=>{
      console.log(msg)
      socket.broadcast.emit("addedInEvent",  msg )
    })
    
  socket.on('cancelEvent', (msg)=>{
    console.log(msg)
    socket.broadcast.emit("cancelingEvent",  msg )
  })
  

});
console.log('servidor socket port 8000')
httpServer.listen(8000);