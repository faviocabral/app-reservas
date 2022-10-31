import { Server } from 'Socket.IO'

const SocketHandler = (req, res) => {

  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }
  
  const io = new Server(res.socket.server, {path: "/api/socket"});
  res.socket.server.io = io;

  io.on("connection", (socket)=>{
    socket.broadcast.emit("connet", 'bienvenido al sistema de agendamiento');
    socket.emit("hello", "world");
    socket.on('evento', (msg)=>{
        socket.emit("hello", msg)
    })
    //socket.broadcast.emit("newIncomingMessage", msg);
  });

  res.end()
}

export default { SocketHandler}
