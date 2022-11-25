const app = require("express")() 
const http = require("http").Server(app )
var cors = require('cors')
app.use(cors())

const io = require("socket.io")(http, 
  { 
    cors: {
      origin: "http://localhost:3000",
      methods: ['GET', 'POST']
    }
}  
); 
const moment = require('moment');  

var allClients = []
io.on("connection", (socket) => {

  console.log("conectado al servidor socket.. " , socket.id)
  //cuando alguien se conecta avisar a todos.. 
  socket.broadcast.emit("usuarios", 'contado al servidor ' + socket.id)

    socket.on('connect', (msg)=>{
        console.log('alguien se conecto', msg)
    })

    socket.on("disconnect", () => { 
      console.log('alguien se desconecto', socket.id) 
      //allClients = allClients.filter(item => item.id === socket.id) // filtramos el que se desconecto el socket
      //console.log(allClients , socket.id , moment().format('YYYY-MM-DD HH:mm:ss') )

    })

    socket.on('addEvent', (msg)=>{
      //agregamos la agenda al usuario para bloquear fecha de agenda... 
      allClients.forEach(item=> { 
                          if(msg.id === item.id){
                            item.agenda = msg.agenda
                          } 
                        }) 
      socket.broadcast.emit("addingEvent",  msg )
      console.log(allClients)
    })

    socket.on('changeEvent', (msg)=>{
      console.log(msg)
      socket.broadcast.emit("changingEvent",  msg )
    })

    socket.on('addedEvent', (msg)=>{
      console.log(allClients)
      socket.broadcast.emit("addedInEvent",  msg )
    })
    
  socket.on('cancelEvent', (msg)=>{
    //allClients = allClients.map(item=>{ return{...item, agenda: (msg.id === item.id)? {} : item.agenda } })
    allClients.forEach(item=> { 
      if(msg.id === item.id){
        item.agenda = {}
      } 
    }) 

    socket.broadcast.emit("cancelingEvent",  msg )
    console.log(allClients)
  })

  socket.on('usuario', (msg)=>{
    
    if( allClients.findIndex(item => item.user.user === msg.user.user) < 0 )
      allClients.push(msg)

    allClients = allClients.map(item=>{ return{...item, id: (msg.user.user === item.user.user)? socket.id : item.id } }) 
    console.log(allClients , socket.id , moment().format('YYYY-MM-DD HH:mm:ss') )
    socket.broadcast.emit("usuarioConectado",  allClients )
  })

  socket.on('usuario-out', (user)=>{ 
    console.log(user)
  })

  
});


app.get('/getOtherAgenda' , (req, res)=>{
  res.status(200).json( { allClients })
})

app.get('/' , (req, res)=>{
  res.status(200).send( '<h3>Servidor socket Agenda Renting CAr !</h3>' )
})


console.log('servidor socket port 8000')
http.listen(8000);