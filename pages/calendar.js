import React, {useEffect, useRef, createRef, useState , useMemo , useContext } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import Layout from '../components/Layout'
import {io } from "socket.io-client"
import moment from 'moment';
import { toast } from 'react-toastify'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Stepper, Step } from 'react-form-stepper'
import Buscador from '../components/Buscador.js' //modal.
import Cookies from 'js-cookie'

let socket 
socket = io("http://192.168.10.80:8000", {withCredentials: true,});

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function Calendar() {

  /*
  const [evento , setEvento ] = useState([
    //{ title: 'EN USO...' , date : '2022-10-04' , overlap:false , display:'background' },
    { id:1, title: 'event 1', date: '2022-10-01' , start: '2022-10-17' , end: '2022-10-20' },
    { id:2, title: 'event 2', start: '2022-10-10 08:00', end: '2022-10-10 18:00' , color: 'green' },
    { id:3, title: 'event 3', date: '2022-10-10',color  : '#000', valor: 'mas datos', vinculos:[{agenda: 1 , vehiculo: 'kia rio'}, {agenda: 2 , vehiculo: 'kia picanto'}] },
  ])
*/
const [evento , setEvento ] = useState([])
const [otroEventos , setOtroEventos ] = useState([])
   //MODELOS HABILITADOS 
  const modelos = [
    {modelo: 'Kia Niro', foto: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/niro-sg2/discover/kia-niro-ev-my23-actionpanel-get-yours.jpg'},
    {modelo: 'Kia Soluto', foto: 'https://kia.com.py/images/grilla/14_soluto_thumb2.png'},
    {modelo: 'Nissan Kicks', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv6dQRAzhjwtMvYHPYACwHdSyTGiFN8LF2fw&usqp=CAU'},
    {modelo: 'Nissan Versa', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxodJdQYmKh5LEgfK4OxRaSybmdSp3BfcjHg&usqp=CAU'},
  ]

  //VEHICULOS ASIGNADOS 
  const [asignados, setAsignados] = useState([])
  const [listaAsignados , setListaAsignados] = useState([])
  const [updEvent, setUpdEvent] = useState([])
  const calendarRef = createRef()
  const [modal, setModal] = useState('')
  const [alto, setAlto] = useState(100);
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)
  const [agenda, setAgenda] = useState({}) 
  const [baseDatos, setBaseDatos] = useState([])
  const fechaIRef = useRef()
  const fechaFRef = useRef()
  const clienteRef = useRef()
  const buscarRef = useRef()
  const codigoCliRef = useRef()
  const nombreCliRef = useRef()
  const tallerRef = useRef()
  const [listaCliente, setListaCliente] = useState([]) // para abrir la ventana de
  const dataInterface = {fechai:'' , fechaf:'', codigoCliente:'', nombreCliente:'' , taller: 0 }
  const [data, setData] = useState(dataInterface)
  const [buscar, setBuscar] = useState('')
  const [taller , setTaller]  = useState([])
  //buscador 
  const [abrirBuscador, setAbrirBuscador] = useState('')
  const [abrirBuscador2, setAbrirBuscador2] = useState('')
  const [titulo , setTitulo ] = useState('')
  const [vehiculos, setVehiculos] = useState([])

  const [user , setUser ] = useState({})
  const [authAsesor ,setAuthAsesor] = useState(true)
  const [authCall ,setAuthCall] = useState(true)
  const [rangoFecha, setRangoFecha] = useState({fechai: '', fechaf: ''})

  //////////////////////////////// 
  // SETEOS INICIALES DEL CALENDARIO
  ////////////////////////////////
  useEffect( () => { 
    let userSocket= JSON.parse(Cookies.get('userRenting')) 
    socket.emit('usuario', {id: socket.id , user: userSocket , agenda: {} }) 

      //verificamos si existen otras agendas en curso y bloquear para que no se puedan cargar datos en la fecha.
      /*
      socket.on('connect', () => {
        console.log('connected' , socket.id)
        if(localStorage.hasOwnProperty('addEvent')){
          //listOtherEvents()

        } 
      })
    */
    
    //cuando estan agendando desde otro lugar 
    socket.on('addingEvent', async(event )=>{ 

     //toast(` ${event.agenda.title} esta registrando en la fecha ${event.agenda.fecha} `)
     //refresh() 
     let fechai = localStorage.getItem('fechai') 
     let fechaf =  localStorage.getItem('fechaf') 
     listaAgenda(fechai , fechaf )
     //setEvento([...res, event.agenda])

    })

/*
    //cuando estan agendando desde otro lugar 
    socket.on('changingEvent', (event)=>{ 
      //setEvento( event ) 
    }) 
*/
    //cuando cancela el evento
    socket.on('cancelingEvent', async(event)=>{

      let fechai = localStorage.getItem('fechai') 
      let fechaf =  localStorage.getItem('fechaf') 
      await listaAgenda(fechai , fechaf )
    })

    //cuando el evento fue agregado
    socket.on('addedInEvent', (event)=>{
      console.log(event)
      let list = JSON.parse(localStorage.getItem("addEvent")) // listamos todos los eventos de otros agentes 
      event = JSON.parse(event) //convertimos a array 
      list = list.filter(item => item.fecha !== event.fecha ) // filtramos el evento cancelado de la lista 
      localStorage.setItem("addEvent", JSON.stringify(list)) // asignar la lista actualizada
      localStorage.setItem("eventos", JSON.stringify(event)) // guardamos el evento grabado
      //setBaseDatos([...baseDatos, event ])
      //setEvento( [...evento, event ])
    })


    listaVehiculos()
    talleres()

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('addingEvent');
      socket.off('changingEvent');
      socket.off('cancelingEvent');
           
    };


  }, []);

  const viewConfig =  {
      dayGridMonth: {
          dayMaxEventRows: 3
      },
      timeGrid:{
        dayMaxEventRows: 3
      } 
  }

    useEffect(()=>{
        setAlto(window.innerHeight )
        window.addEventListener("resize",listen )

        /* listen next and prev button 
        setTimeout(()=>{
          let myButton = document.getElementsByClassName('fc-next-button')[0]
          //myButton.addEventListener("click", sapo )
          console.log(myButton)
          myButton.addEventListener("click", ()=>{alert(1)})

        }, 2000)
        */

    }, [])

    const listen = ()=>{
        setAlto(window.innerHeight)
    }

    const listaVehiculos = async()=>{
      await fetch('api/vehiculos' )
      .then(response => response.json()) 
      .then(json => {
        console.log(json)
        let lista = [] = json.rows.map(item=> {
          return({
            marca: item.marca, 
            modelo: item.modelo, 
            chapa: item.chapa, 
            vin: item.vin, 
            anho: item.anho, 
            taller: item.taller, 
            id: item.id, 
            id_taller: item.id_taller 
          }) 
        })
        setVehiculos(lista)
       
      })
      .catch(err => console.log(err))      
    }

    let colorEstado = [ 
      {color: 'sin color'},
      {color: '#0275d8' , estado: 'agendado'},
      {color: '#5bc0de' , estado: 'entregado'},
      {color: '#5cb85c' , estado: 'recibido'},
    ]
    let otroColorEstado = [ 
      {color: 'sin color'},
      {color: '#62a1fe' , estado: 'agendado'},
      {color: '#62ddf5' , estado: 'entregado'},
      {color: '#6ab190' , estado: 'recibido'},
    ]


    const listaAgenda= async (fechai , fechaf) =>{

      localStorage.setItem("fechai" , fechai)
      localStorage.setItem("fechaf" , fechaf)
      let myUser = JSON.parse(Cookies.get('userRenting'))
      await fetch(`api/calendar/rango?fechai=${fechai}&fechaf=${fechaf}` )
      .then(response => response.json()) 
      .then( async(json) => { 
        await fetch('api/vehiculos') 
          .then(response => response.json()) 
          .then( async( vhe ) => { 
            let lista = json.agenda.map(item => { 
              return({...item,
                date: item.fecha,
                start: item.fechai,
                end: item.fechaf,
                title: item.titulo,
                backgroundColor: (item.user_ins === myUser.user )? colorEstado[item.id_estado].color : otroColorEstado[item.id_estado].color , 
                borderColor:  (item.user_ins === myUser.user )? colorEstado[item.id_estado].color : otroColorEstado[item.id_estado].color  ,
                //allDay: true,
                classNames: 'bg-gradient-success',
                vehiculos: vhe.rows.filter(item2 => item.det.map(item3 => item3.vin ).includes(item2.vin) )
              })
            })
            setBaseDatos(lista)
              // caso qeu alquien este agendando bloquee la pagina... 
              await fetch(`http://192.168.10.80:8000/getOtherAgenda` )
              .then(response => response.json()) 
              .then((result) => { 
                           
                if( result.allClients.findIndex(item=> item.user.user !== myUser.user && Object.keys(item.agenda).length > 0 ) >= 0 ){ // si existen otras agenda traer los datos 
                  console.log(result.allClients.filter(item => item.user.user !== myUser.user ))
                  result.allClients
                  .filter(item => Object.keys(item.agenda).length > 0 ) // solo agenda activas de otros 
                  .filter(item => item.user.user !== myUser.user ) // solo de otros usuarios
                  .forEach(item=> lista.push(item.agenda) )
                  setEvento(lista)
                }else{
                  setEvento(lista)
                }
              })

          })
       
      })
      .catch(err => console.log(err))
      
    }

    const talleres = async()=>{
      await fetch('api/talleres' )
      .then(response => response.json()) 
      .then(json => {
        console.log(json)
        setTaller(json.rows)
      })
      .catch(err => console.log(err))
      
    }

    const asignadosxFecha = async(fecha)=>{

      await fetch(`api/calendar/asignacionxfecha/${fecha}` )
      .then(response => response.json()) 
      .then(json => {
        console.log(json)
        setListaAsignados(json.rows)
      })
      .catch(err => console.log(err))

    }

    const buscarCliente = async(e)=>{ 
      setAbrirBuscador('show')
      setTitulo('Buscar Cliente')
      setTimeout(() => {
        buscarRef.current.focus()
      }, 200);
    }

    const actualizarFechaRecepcion = async(e)=>{ 
      setAbrirBuscador2('show')
      setTitulo('Actualizar Fecha Recepcion')
    }

    const recuperarCliente = async (e)=>{
      e.preventDefault()

      let codigo = document.getElementsByName('buscar')[0].value
      await fetch('http://192.168.10.80:3000/api/clientes/'+ codigo)
      .then(response => response.json()) 
      .then(data => { 
        setListaCliente(data.rows) 
        setTimeout(() => { 
          buscarRef.current.value = codigo 
          buscarRef.current.focus() 
        }, 200); 
        console.log(data) 
      });
      
    }

    const asignarCliente = (item)=>{
      setData({...data , codigoCliente: item.cardcode , nombreCliente: item.cardname})
      toast.success(<div>{'cliente asignado'} <br /> {item.cardname} </div> , {autoClose:700})
    }
    
    const updateData = e => {

      //controlamos cuando sea fechafin que no se solapen las asignaciones... 
      if(e.target.name === 'fechaf'){
        let res = controlAsignacion()

        if(res > 0 ){
          return 
        }

        if( moment(fechaFRef.current.value).diff(fechaIRef.current.value , 'days') < 0 ){
          toast.warning('No puede agendar una fecha inferior al inicio !!!')
          return 
        }
        if( data?.id_estado === 2 && moment(moment().format('YYYY-MM-DD')).diff(fechaFRef.current.value , 'days') < 0 ){
          toast.warning('No puede agendar una fecha posterior al del dia para la recepcion de vehiculos !!!')
          return 

        }
      }

      setData({
          ...data,
          [e.target.name]: e.target.value
      })
    }

    ///////////////////////////////////////////////////////////////////////////
    /// NUEVO EVENTO 
    /////////////////////////////////////////////////////////////////////////// 
    const handleDateClick = (arg) => { 
      console.log(arg)
      if( evento.findIndex(item => item.fecha === arg.dateStr && item.title.includes('el usuario') ) >= 0 ){
        toast.warning('Hay un usuario registrando en esta fecha !!! ')
        return 
      }

      if(moment(arg.dateStr).weekday() === 0 ){
        toast.error('No puede agendar dias Domingo !!!')
        return 
      } // si es domingo 


      listaVehiculos() 
      talleres() 
      asignadosxFecha(arg.dateStr) 
      setAsignados([]) 

      dataInterface.fechai = moment(arg.dateStr).format('YYYY-MM-DD ') + moment().format('00:00')
      dataInterface.fechaf = moment(arg.dateStr).format('YYYY-MM-DD ') + moment().format('00:00')
      setData(dataInterface) 

      let myUser = JSON.parse(Cookies.get('userRenting'))
      let newEvent = {title: `el usuario ${myUser.user} \n esta registrando `, date: arg.dateStr , startStr: arg.dateStr, endtStr: arg.dateStr , fecha: arg.dateStr, display:'list-item' , textColor: 'black', color:'red' , editable: 'false' , det:[ {vin: ''} ] } /// overlap:false , display:'background' , color: 'yellow' }
      socket.emit('addEvent', {id: socket.id , agenda: newEvent  })

      ///////////////////////////////////////////////
      //ABRIR EL MODAL PARA REGISTRAR LOS DATOS
      setAgenda({dateStr: arg.dateStr , tipoEvento: 'ins'}) //tomar los datos de la agenda
      toggle() // abrir modal 
    }

    ////////////////////////////////////////////////////////////////////
    // PARA VER DATOS DEL EVENTO
    ////////////////////////////////////////////////////////////////////
    const handleEventClick = (info) => { 

      if( evento.findIndex(item => item.fecha === info.event.startStr && item.title.includes('el usuario') ) >= 0 ){
        toast.warning('Hay un usuario registrando en esta fecha !!! ')
        return 
      }
      console.log(info)
      //alert(info.event.title)
      //para habilitar botonoes y permisos segun roles 
      setUser( JSON.parse(Cookies.get('userRenting')) )

      //para controlar habilitaciones de botones tanto para callcenter y asesores y supervisores
      let control = JSON.parse(Cookies.get('userRenting')) 
      if( ('asesor').includes( control.tipo.toLowerCase() ) )
        setAuthAsesor(false)

      if( ('call center').includes( control.tipo.toLowerCase() ) && data.user_ins !== user.user )
        setAuthCall(false)

      setAgenda({dateStr: info.event.startStr, tipoEvento: 'upd' , title: info.event.title })
      let myEvent = {
        fecha: moment(info.event.extendedProps.fecha).utc().format('YYYY-MM-DD'), 
        fechai: moment(info.event.extendedProps.fechai).utc().format('YYYY-MM-DD HH:mm'), 
        fechaf: moment(info.event.extendedProps.fechaf).utc().format('YYYY-MM-DD HH:mm'), 
        codigoCliente: info.event.extendedProps.codigo_cliente, 
        nombreCliente: info.event.extendedProps.nombre_cliente, 
        taller: info.event.extendedProps.id_taller, 
        id: info.event.extendedProps.id_agenda,
        id_estado: info.event.extendedProps.id_estado,
        user_ins: info.event.extendedProps.user_ins,
      }
      ///info.event.extendedProps.
      setData(myEvent)
      setAsignados(info.event.extendedProps.vehiculos)
      toggle()
    }

    /////////////////////////////////////
    // CUANDO HAY ALGUN CAMBIO DE EVENTO
    const handleChanges = (event) =>{
      console.log('hubo algun cambio en el calendario ',event )
    }

    /////////////////////////////////////////////////
    // SE EJECUTA CUANDO SE AGREGA UN NUEVO EVENTO... 
    const handleNewEvent = (event) =>{
      console.log('se agrego un nuevo evento ',event)
    }

    ////////////////////////////////////////////////////////////////////
    // SE EJECUTA CUANDO HUBO ALGUN CAMBIO EN ALGUN EVENTO LOCAL
    ////////////////////////////////////////////////////////////////////
    const handleChange = (event) =>{
      let changeEvent = {
        title : event.event.title,
        date: event.event.startStr,
        start:  event.event.start,
        end: event.event.end,
        fecha: event.event.startStr,
        fechaAnterior: event.oldEvent.startStr,
        titleAnterior: event.oldEvent.title,
        vehiculos: event.oldEvent.extendedProps.vehiculos
      }

      let list = evento.filter(item => item.fecha !== changeEvent.fecha && item.title !== changeEvent.title ) // quitamos de la lista para actualizar el nuevo evento 
      list.push({title: changeEvent.title, date: changeEvent.fecha , start: moment(changeEvent.start).utc().format('YYYY-MM-DD') , end: moment(changeEvent.end).utc().format('YYYY-MM-DD'), fecha: changeEvent.fecha, vehiculos: changeEvent.vehiculos }) // luego agregamos el nuevo evento
      setEvento(list)
      socket.emit('changeEvent' , list )

    }

    const crearEvento = async()=>{

      if(asignados.length === 0 ){ //controlamos si agrego vehiculo.
        Swal.fire({ title:'Debe seleccionar un vehiculo para agendar  o falta agregar cliente !', icon: 'warning'})
        return 
      }else if(( Object.values(data).map(item => !item).find(item => item === true ) || false )) { //controlamos si asigno cliente 
        Swal.fire({ title:'Debe completar datos de cliente y taller !!' , icon: 'warning'})
        return 
      }

      let persona = JSON.parse( Cookies.get('userRenting') )
      const agenda = {
                      cab : {
                        codigo_cliente: data.codigoCliente,
                        nombre_cliente: data.nombreCliente,
                        titulo: data.nombreCliente,
                        id_estado: 1, //agendado
                        id_taller: data.taller,
                        fecha: moment(data.fechai).utc().format('YYYY-MM-DD'),
                        fechai: moment(data.fechai).utc().format('YYYY-MM-DD'),
                        fechaf: moment(data.fechaf).utc().format('YYYY-MM-DD'),
                        estado: 'Agendado',
                        user_ins: persona.user 
                      },
                      det : asignados.map(item=>{
                        return (
                          {
                            id_cab: 0, 
                            nombre: item.modelo,
                            id_vehiculo: item.id,
                            estado: 'Agendado',
                            user_ins : persona.user 
                          }
                        )
                      })
                    }  
      Swal.showLoading()
      await fetch('api/calendar', {
        method: "POST",
        body: JSON.stringify(agenda),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => {
        Swal.close()
        toast.success('Agenda guardada con Exito!!')        
        //alert(JSON.stringify(json))
        let fecha = data.fechai 
        setAsignados([]) // limpiamos lista de vehiculos 
        setData(dataInterface) //limpiamos los datos de la agenda
        setListaCliente([]) //limpiamos el buscador
        toggle() //cerramos el modal de la agendamiento.
        listaAgenda( rangoFecha.fechai , rangoFecha.fechaf )// recuperamos las agenda del mes
        //mismo evento que al grabar 
        socket.emit("cancelEvent", {id: socket.id})


      })
      .catch(err => console.log(err))

    } 

    const cancelarEvento = ()=>{

      //SE CANCELO EL EVENTO
      socket.emit("cancelEvent", {id: socket.id})
      //socket.emit("cancelEvent", JSON.stringify({title: ' el usuario '+ socket.id+' cancelo un evento ', date: agenda.dateStr , fecha: agenda.dateStr }))
      setAgenda({})
      setListaAsignados([])
      toggle()
    }

    const cancelarAgenda = async()=>{
      
        Swal.fire({
          title: 'Esta seguro que desea cancelar la Agenda?',
          //text: "Desea cancelar esta agenda?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',    
          cancelButtonText: 'No',
        }).then(async (result)=>{
          if(result.isConfirmed){

            Swal.showLoading()
            let usuario = await JSON.parse(Cookies.get('userRenting'))
    
            let datos = { tipoEvento: 'cancelar' , user_upd: usuario.user , fecha_upd: moment().format('YYYY-MM-DD HH:mm:ss') }
            await fetch('api/calendar?id=' + data.id , {
              method: "PUT",
              body: JSON.stringify(datos ),
              headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => { 
              toast.success('Agenda Cancelada !!! ') 
              Swal.close()
              setAsignados([]) // limpiamos lista de vehiculos 
              setData(dataInterface) //limpiamos los datos de la agenda
              setListaCliente([]) //limpiamos el buscador
              toggle() //cerramos el modal de la agendamiento.
              listaAgenda( rangoFecha.fechai , rangoFecha.fechaf )// recuperamos las agenda del mes
              //mismo evento que al grabar 
              socket.emit("cancelEvent", {id: socket.id})              
    
            })
            .catch(err => console.log(err))
          }
        })
        
    }

    const entregarVehiculo = async()=>{
      
      Swal.fire({
        title: 'Esta seguro de entregar el vehiculo?',
        //text: "Desea cancelar esta agenda?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',    
        cancelButtonText: 'No',
      }).then(async (result)=>{
        if(result.isConfirmed){

          Swal.showLoading()
          let usuario = await JSON.parse(Cookies.get('userRenting'))
          let datos = { tipoEvento: 'entregar' , user_upd: usuario.user , fecha_upd: moment().format('YYYY-MM-DD HH:mm:ss') }
          await fetch('api/calendar?id=' + data.id , {
            method: "PUT",
            body: JSON.stringify(datos ),
            headers: {"Content-type": "application/json; charset=UTF-8"}
          })
          .then(response => response.json()) 
          .then(json => { 
            alert(JSON.stringify(json))
            toast.success('Vehiculo Entregado !!! ') 
            Swal.close()
            setAsignados([]) // limpiamos lista de vehiculos 
            setData(dataInterface) //limpiamos los datos de la agenda
            setListaCliente([]) //limpiamos el buscador
            toggle() //cerramos el modal de la agendamiento.
            listaAgenda( rangoFecha.fechai , rangoFecha.fechaf )// recuperamos las agenda del mes
            //mismo evento que al grabar 
            socket.emit("cancelEvent", {id: socket.id}) 
  
          })
          .catch(err => console.log(err))
        }
      })
      
  }


  const recibirVehiculo = async()=>{
      
    Swal.fire({
      title: 'Esta seguro de Recibir el vehiculo  -  Verifique la fecha fin si esta correcto?',
      //text: "Desea cancelar esta agenda?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',    
      cancelButtonText: 'No',
    }).then(async (result)=>{
      if(result.isConfirmed){

        Swal.showLoading() 
        let usuario = await JSON.parse(Cookies.get('userRenting')) 
        let datos = { tipoEvento: 'recibir' , user_upd: usuario.user , fecha_upd: moment().format('YYYY-MM-DD HH:mm:ss') } 
        await fetch('api/calendar?id=' + data.id , { 
          method: "PUT", 
          body: JSON.stringify(datos ), 
          headers: {"Content-type": "application/json; charset=UTF-8"} 
        }) 
        .then(response => response.json()) 
        .then(json => { 
          toast.success('Vehiculo Recibido !!! ') 
          Swal.close() 
          setAsignados([]) // limpiamos lista de vehiculos 
          setData(dataInterface) //limpiamos los datos de la agenda
          setListaCliente([]) //limpiamos el buscador
          toggle() //cerramos el modal de la agendamiento.
          listaAgenda( rangoFecha.fechai , rangoFecha.fechaf ) // recuperamos las agenda del mes
          //mismo evento que al grabar 
          socket.emit("cancelEvent", {id: socket.id})            

        })
        .catch(err => console.log(err))
      }
    })
   
}

    const addDias = ( dias )=>{

      //controlar los dias asignados... 
      let res = controlAsignacion('', moment(agenda?.dateStr).add(dias, 'd').utc().format('YYYY-MM-DD')) 
      if(res > 0 ) 
        return 

      setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(dias, 'd').utc().format('YYYY-MM-DD 00:00')})
    }

    const checkEtapa = async (id)=> {

      await fetch('api/etapas/' + id )
      .then(response => response.json()) 
      .then(json => {
        
        const color = {
                        Agendado: 'badge bg-primary',
                        Entregado: 'bg-info',
                        Recibido: 'bg-success',
                      }
        const res =  json.rows.map((item , index) =>{
          return (
            `<tr>
              <td>${index +1 }</td>
              <td><span class="badge ${color[item.nombre]}">${item.nombre.toUpperCase()}</span></td>
              <td>${item.user}</td>
              <td>${moment(item.fecha).format('YYYY-MM-DD hh:mm')}</td>
            </tr>
            `
          )
        })
        const listado = 
            `
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Etapa</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  ${ res.join(' ') }
                </tbody>
              </table>
            `
  
        Swal.fire({
          title: 'Etapa de la Agenda',
          icon: 'info',
          html: listado,
          showCloseButton: true,
          showCancelButton: true,
        })
      })




    }


    const toggle = () => setModal2(!modal2)
    const Modal1 = ()=>{
      return (
        <div>
          <Modal isOpen={modal2} fade={false} centered={true}  size='xl' style={{minWidth:'95%'}}>
            <ModalHeader toggle={()=>cancelarEvento()} style={{paddingTop:'5px', paddingBottom:'2px'}}> {(agenda?.tipoEvento === 'ins')? 'Nuevo Evento' : 'Modificar Evento' } | { moment(agenda?.dateStr).format('YYYY-MM-DD') } |  {(agenda?.tipoEvento === 'upd'? 'Agendado' : '' )} | {data.user_ins} </ModalHeader>
            <ModalBody>
              <div className="container-fluid">
                <div className='row'>
                </div>
                <div className="row">
                  <div className="col-6">
                    <h3>Vehiculos Disponibles</h3>
                    {/* clasificacion de modelos  */}
                    <div className='d-flex justify-content-between'>
                      {
                        modelos.map(item =>{
                          return (

                            <div className="card elevation-1" style={{width: 120, height: 150 }} key={item.modelo}>
                              <img className="card-img-top" src={item.foto} alt="Card image" style={{width: '100%', height: '70%'}} />
                              <div className="card-footer p-1">
                                <p className="card-title text-center"><strong>{item.modelo}</strong></p>
                              </div>
                            </div>
                          )
                        })
                      }

                    </div>
                    <table className="table table-sm mt-3" style={{fontSize: 14}}>
                      <thead>
                        <tr >
                          <th scope="col">#</th>
                          <th scope="col">TALLER</th>
                          <th scope="col">MARCA</th>
                          <th scope="col">MODELO</th>
                          <th scope="col">NRO CHAPA</th>
                          <th scope="col">AÑO</th>
                          <th scope="col">VIN</th>
                          <th scope="col" className="text-center">#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (vehiculos.filter(item=> item.id_taller === Number(data.taller) ).length === 0 )
                          ? <tr> <td colSpan="8" className="text-center">Seleccione un Taller en la lista seleccionable !</td> </tr>
                          : vehiculos
                            .filter(item=> item.id_taller === Number(data.taller) )
                            .map((item, index )=>{
                              return (
                                <tr className={ `align-middle ${
                                  (agenda?.tipoEvento === 'upd')
                                  ?(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                    ?'bg-success text-white'
                                    : ''
                                  :(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                    ? 'bg-warning' 
                                    : (listaAsignados.findIndex(item3 => item3.vin === item.vin /* && moment(agenda?.dateStr) <= moment(item3.fechaf) */ ) >= 0 )
                                      ? 'bg-success text-white'
                                      : ''
                                  }` } key={item.vin} >
                                
                                  <th>{index + 1}   </th>
                                  <td style={{textOverflow:'ellipsis', maxWidth:'125px', whiteSpace: 'nowrap' , overflow:'hidden'}} >{item.taller}</td>
                                  <td>{item.marca}  </td>
                                  <td>{item.modelo} </td>
                                  <td>{item.chapa}  </td>
                                  <td>{item.anho}   </td>
                                  <td>{item.vin.slice(-6)}</td>
                                  <td style={{paddingRight: '0px', textAlign:'right'}}>
                                    {
                                      (agenda?.tipoEvento === 'upd')
                                      ?(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                        ?<span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                        : <span></span>
                                      :(agenda.tipoEvento === 'ins')
                                        ?(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                          ? <span></span>
                                          :(listaAsignados.findIndex(item3 => item3.vin === item.vin ) >= 0 )
                                            ?<span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                            :<i className="bi bi-arrow-right btn btn-warning font-weight-bold px-2 py-0 " style={{fontSize:'20px'}} onClick={()=> asignarVehiculo(item.vin) }></i> 
                                        : <span></span>      
                                      }
                                  </td>
                                </tr>
                              )
                            })
                        }
                      </tbody>
                    </table>

                  </div>
                  <div className="col-6">
                    <h3>Datos de la Agenda</h3>
                    <Stepper activeStep={ (agenda.tipoEvento === 'upd')? (data.id_estado -1) : -1 } style={{padding:'0px'}}>
                      <Step label="Agendado" onClick={()=> checkEtapa(data.id) }  />
                      <Step label="Entregado" onClick={()=> checkEtapa(data.id)  } />
                      <Step label="Recibido" onClick={()=> checkEtapa(data.id)  }  />
                    </Stepper> 

                    <form onSubmit={e => e.preventDefault} className="">
                      <div className='row'>

                        <div className='col-4'>
                          <div className="mb-3">
                            <label htmlFor="uname" className="form-label text-center w-100"><b>Fecha inicio:</b></label>
                            <input type="datetime-local" className="form-control text-center" id="uname" placeholder="Enter username" name="fechai" required value={(data.fechai.length > 0)?data.fechai:agenda.dateStr} ref={fechaIRef} onChange={updateData} readOnly={(agenda?.tipoEvento === 'upd' )?true:false }/>
                          </div>
                        </div>

                        <div className='col-4'>
                          <div className="mb-3">
                            <label htmlFor="pwd" className="form-label text-center w-100"><b>Fecha Fin:</b></label>
                            <input type="datetime-local" className="form-control text-center" id="pwd" placeholder="Enter password" name="fechaf" required value={(data.fechaf.length > 0)?data.fechaf:agenda.dateStr} ref={fechaFRef} onChange={updateData } readOnly={(agenda?.tipoEvento === 'upd' && data?.id_estado !== 2)?true:false } />
                          </div>
                        </div>

                        <div className="col-4 d-flex justify-content-center mb-1">
                          <div className="card w-50"  >
                              <div className="card-header p-0 m-0 text-bg-primary elevation-1">
                                <h3 className="text-center p-0 m-0"><strong>Dias</strong></h3>
                              </div>
                            <div className="card-footer p-1 ">
                              <p className="card-title text-center mb-0"><strong> <h3 className="m-0"><strong>{ moment(data.fechaf).diff(data.fechai , 'days')+1 }</strong></h3> </strong></p>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="row">
                        <div className="btn-group" style={{ marginBottom: 10,}}>
                          <button type="button" className="btn btn-primary" onClick={()=> addDias(0)  } disabled={(agenda?.tipoEvento === 'upd')?true:false } >1 Dia</button>
                          <button type="button" className="btn btn-warning" onClick={()=> addDias(1) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >2 Dias</button>
                          <button type="button" className="btn btn-info"    onClick={()=> addDias(2) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >3 Dias</button>
                          <button type="button" className="btn btn-danger"  onClick={()=> addDias(3) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >4 Dia</button>
                          <button type="button" className="btn btn-dark"    onClick={()=> addDias(4) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >5 Dias</button>
                        </div>              
                      </div>
                      <div className='row'>
                          <div className="input-group mt-3 mb-3"> 
                            <span className="input-group-text"><b>Cliente</b></span>
                            <button className="btn btn-primary " onClick={ buscarCliente } data-bs-toggle="dropdown" disabled={(agenda?.tipoEvento === 'upd')?true:false } > <b> <i className="bi bi-search"></i> </b> </button>
                            <input type="text" className="form-control" placeholder="codigo cliente..." name="codigoCliente" ref={codigoCliRef} onChange={ updateData } value={data?.codigoCliente} readOnly/>
                            <input type="text" className="form-control" id="nombreCliente" placeholder="Nombre de Cliente" name="nombreCliente" ref={nombreCliRef} style={{width:'35%'}} onChange={ updateData } value={data?.nombreCliente} readOnly/>
                          </div>

                          <div className="input-group mt-3 mb-3"> 
                          <span className="input-group-text"><b>Taller</b> &nbsp;&nbsp;&nbsp;</span>
                          <select className="form-select" aria-label="Default select example" name="taller" ref={tallerRef} onChange={ updateData }  value={data?.taller } disabled={(agenda?.tipoEvento === 'upd')?true:false }>
                            <option selected value="0">Taller ?</option>
                            { 
                              taller?.map(item =>{
                                return (
                                  <option key={item.id} value={item.id}> {item.nombre} </option>
                                )
                              })
                            }
                            
                          </select>
                          </div>

                        </div>

                    </form>
                    
                    <div className='row'>
                      <h3>Vehiculos Asignados</h3>
                      <table className="table table-sm mt-3" style={{fontSize: 14}}>
                        <thead>
                          <tr style={{textAlign:'center'}}>
                            <th scope="col">#</th>
                            <th scope="col">MARCA</th>
                            <th scope="col">MODELO</th>
                            <th scope="col">NRO CHAPA</th>
                            <th scope="col">AÑO</th>
                            <th scope="col">VIN</th>
                            <th scope="col">TALLER</th>
                            <th scope="col">#</th>
                          </tr>
                        </thead>
                        <tbody>
                            { 
                              

                              (asignados.length > 0 )
                                ? asignados.map((item, index )=>{
                                    return (
                                        <tr className='align-middle' key={item.vin}>
                                          <th>{index + 1}</th>
                                          <td>{item.marca}</td>
                                          <td>{item.modelo}</td>
                                          <td>{item.chapa}</td>
                                          <td>{item.anho}</td>
                                          <td>{item.vin.slice(-6)}</td>
                                          <td style={{textOverflow:'ellipsis', maxWidth:'125px', whiteSpace: 'nowrap' , overflow:'hidden'}} >{item.taller}</td>
                                          {
                                            (agenda?.tipoEvento === 'upd' )
                                            ? <td></td>
                                            : <td style={{paddingRight:'0px', textAlign:'right'}}>  <i className="bi bi-x-lg btn btn-danger font-weight-bold px-2 py-0 " style={{fontSize:'20px'}} onClick={()=> eliminarAsignacion(item.vin)}  ></i> </td>
                                          }
                                        </tr>
                                    )
                                  })
                                : <tr><td colSpan={6} className='text-center'>No existen vehiculos asignados</td></tr> 

                            }
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>


              

              <Buscador open={abrirBuscador} setOpen={setAbrirBuscador} titulo ={titulo}  >
                <div className="container">
                      <div className="row">
                        <form onSubmit={recuperarCliente}>
                            <div className="input-group mt-3 mb-3"> 
                              <button className="btn btn-primary "  type="btn" > <b> <i className="bi bi-search"></i> </b> </button>
                              <input type="text" className="form-control" name="buscar" ref={buscarRef} /> 
                            </div>
                        </form>
                      </div>
                      <div className="row">
                          <table className="table table-sm table-hover " style={{fontSize:'14px'}}>
                              <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>codigo</th>
                                    <th>nombre</th>
                                    <th>Asignar</th>
                                  </tr>
                              </thead> 
                              <tbody>
                                { 
                                  listaCliente.map((item, index)=>{
                                    return (
                                      <tr key={item.cardcode}>
                                        <td>{index + 1}</td>
                                        <td style={{width:'20%'}}>{item.cardcode}</td>
                                        <td>{item.cardname}</td>
                                        <td style={{width:'20%'}}><span className="badge bg-secondary elevation-1 " style={{cursor:'pointer'}} onClick={()=>{ asignarCliente(item) }}>Asignar cliente</span></td>
                                      </tr>
                                    )
                                  })
                                }

                              </tbody>
                          </table>
                      </div>
                  </div>
              </Buscador>

            </ModalBody> 
            <ModalFooter> 
               { 
                (agenda.tipoEvento === 'upd') 
                ? 
                    <> 
                    <Button color="info"  disabled={
                                                      (data.id_estado >= 2  ) // si ya entrego bloquear
                                                      ? true
                                                      : ( 'administrador supervisor'.includes(user.tipo.toLocaleLowerCase()) 
                                                          || ('asesor'.includes(user.tipo.toLocaleLowerCase()) ) 
                                                        )
                                                         ? false
                                                         : true 
                                                  } onClick={entregarVehiculo}> Entregar </Button> 
                    <Button color="success"  disabled={
                                                      (data.id_estado !== 2  ) // solo si fue entregado puede recibir 
                                                      ? true
                                                      : ( 'administrador supervisor'.includes(user.tipo.toLocaleLowerCase()) 
                                                          || ('asesor'.includes(user.tipo.toLocaleLowerCase()) ) 
                                                        )
                                                         ? false
                                                         : true 
                      
                                                      } style={{marginRight:'25px'}} onClick={recibirVehiculo}> Recibir </Button> 
                    <Button color="warning"  disabled={
                                                        
                                                        ( ('2 3').includes(data.id_estado) ) // si ya fue entregado ya no puede cancelar
                                                        ? true
                                                        :( 'administrador supervisor'.includes(user.tipo.toLocaleLowerCase()) 
                                                          || ('call center asesor'.includes(user.tipo.toLocaleLowerCase()) && data.user_ins === user.user ) 
                                                        )
                                                          ? false
                                                          : true 
                                                      } style={{marginRight:'25px'}} onClick={cancelarAgenda}> Cancelar</Button>
                    </>
                : <span></span>
               }             
  
              <Button color="primary" onClick={()=> crearEvento()} disabled={(asignados.length === 0 || agenda.tipoEvento === 'upd' ? true : false)} > Agendar</Button>
              <Button color="danger" onClick={()=>cancelarEvento()}> Salir</Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    }


    const controlAsignacion = ( chassis = '' , fechafForm = fechaFRef.current.value )=>{

      //controla la asignacion que no se solapen con las fechas ... 
      //este control es cuando se asigna un vehiculo... 
      let fechaiForm = fechaIRef.current.value 
      let existe = 0 
      let msgError= `Ya existe una asignacion en esta fecha ${fechafForm} !!! ` 
      console.log(evento)

      let res = evento?.filter(e => Object.keys(e).length > 0 )
            .map(item =>{ 
              return({ 
                  fechai:item.fechai, 
                  diff: (fechaiForm < item.fechai )? moment(fechafForm).diff(item.fechai , 'days') :  -1, //compara lista de eventos contra la fecha inicio del formulario 
                  vins: item.det.map(item => item.vin ) 
              }) 
            }) 
            .filter(item => item.diff >= 0 && item.vins.findIndex(item => item !== chassis)  ) 
      //alert(JSON.stringify(res)) 
      if(res.length > 0 ){ 
        toast.warning(msgError , {timeout: 5000} ) 
        existe = res.length
      }

      //controla que no se solapen desde rangos de fecha 
      //alert(JSON.stringify(asignados))
      let lista = [] 
      
      asignados?.forEach(item3=>{
        lista = evento?.filter(e => Object.keys(e).length > 0 )
        .map(item =>{ 
          return({ 
              fechai:item.fechai, 
              diff:(fechaiForm < item.fechai )? moment(fechafForm).diff(item.fechai , 'days') :  -1, //compara lista de eventos contra la fecha inicio del formulario 
              vins: item.det.map(item => item.vin ) 
          }) 
        })
        .filter(item => item.diff >= 0 && item.vins.findIndex(item => item !== item3.vin)  ) 

        //alert(JSON.stringify(lista))
        if(lista.length > 0 ){
          toast.warning(msgError,{ timeout: 5000})
          existe = lista.length
        }

      })


      return existe 

    }


    const asignarVehiculo = (chassis) =>{

        let res = controlAsignacion(chassis)
        if(res > 0 )
          return 

        let vehiculo = vehiculos.find(item => item.vin === chassis )
        setAsignados([...asignados, vehiculo])
  
    }

    const eliminarAsignacion = (chassis)=>{

        let lista = asignados.filter(item => item.vin !== chassis )
        console.log('eliminando item ' , chassis , lista )
        setAsignados(lista)
    }


    const refreshCalendar= ()=>{
      listaAgenda(rangoFecha.fechai, rangoFecha.fechaf)
      //toast.info('Agenda actualizada !' , { autoClose: 700} )
    }

  return (
    <Layout>
      <div className="d-flex">
      
      <div className="flex-grow-1 ml-3">
        <FullCalendar
          dayMaxEventRows={true}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          customButtons= {{
                            refreshButton: {
                              text: 'Refresh!',
                              click: function() {
                                refreshCalendar()
                              }
                            }            
                        }}
          headerToolbar={{
              center: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
              right: 'refreshButton today prev,next',
              //left:
            }}
          buttonText={{
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'            
          }}
          locale={'es'} 
          editable={false} // evita el drap and drop de los eventos registrados...  
          //selectable
          slotMinTime= {"07:30:00"}  //inicio de hora 
          slotMaxTime= {"18:00:00"} //fin de hora 
          //eventLimit={true} 
          views={viewConfig}  //configuracion de la vista 
          height={alto - 80} // alto maximo del calendario caso de un resize
          //hiddenDays={[0]}  // no incluye domingos
          dateClick={handleDateClick}    //para agregar un nuevo evento
          eventClick={handleEventClick} //se optiene los datos del evento 
          //eventsSet={handleChanges}    //cualquier cambio del calendario
          eventChange={handleChange}  //algun cambio del calendario
          eventAdd={handleNewEvent}  //se ejecuta cuando se agrega un nuevo evento
          events={evento} 
          datesSet={(args) => { 
                        setRangoFecha({...rangoFecha, fechai:moment(args.startStr).format('YYYY-MM-DD') , fechaf:moment(args.endStr).format('YYYY-MM-DD') })
                        listaAgenda(moment(args.startStr).format('YYYY-MM-DD'), moment(args.endStr).format('YYYY-MM-DD'))
                      } 
                    } // esto se ejecuta cada vez que se actualiza el calendario o con el boton next o preview 

        /> 

      </div>

      </div>
      <Modal1 />
    </Layout>
)
}

export default Calendar