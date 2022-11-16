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

let socket 
socket = io("http://localhost:8000");

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function Calendar() {

  const [evento , setEvento ] = useState([
    //{ title: 'EN USO...' , date : '2022-10-04' , overlap:false , display:'background' },
    { id:1, title: 'event 1', date: '2022-10-01' , start: '2022-10-17' , end: '2022-10-20' },
    { id:2, title: 'event 2', start: '2022-10-10 08:00', end: '2022-10-10 18:00' , color: 'green' },
    { id:3, title: 'event 3', date: '2022-10-10',color  : '#000', valor: 'mas datos', vinculos:[{agenda: 1 , vehiculo: 'kia rio'}, {agenda: 2 , vehiculo: 'kia picanto'}] },
  ])

  //VEHICULOS DISPONIBLES
  /*
  const vehiculos = [
    { marca: 'RENTING - KIA', modelo:'NIRO', chapa: 'AAGV085', vin:'KNACB81CGM5423978', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAGZ676', vin:'LJD0AA29BN0150565', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT600', vin:'LJD0AA29BN0152796', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT593', vin:'LJD0AA29BN0152789', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT595', vin:'LJD0AA29BN0152734', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT598', vin:'LJD0AA29BN0152731', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT597', vin:'LJD0AA29BN0152799', anho:2021},
    { marca: 'RENTING - KIA', modelo:'SOLUTO', chapa: 'AAHT599', vin:'LJD0AA29BN0152748', anho:2021},
    { marca: 'RENTING - NISSAN', modelo:'VERSA DRIVE', chapa: 'AAGV083', vin:'94DBCAN17MB101331', anho:2021},
    { marca: 'RENTING - NISSAN', modelo:'KICKS', chapa: 'AAGV091', vin:'94DFCAO15NB201839', anho:2022},
  ]
  */
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
  const [listaCliente, setListaCliente] = useState([]) // para abrir la ventana de
  const dataInterface = {fechai:'' , fechaf:'', codigoCliente:'', nombreCliente:'' , taller: 0 }
  const [data, setData] = useState(dataInterface)
  const [buscar, setBuscar] = useState('')
  const [taller , setTaller]  = useState([])
  //buscador 
  const [abrirBuscador, setAbrirBuscador] = useState('')
  const [titulo , setTitulo ] = useState('')
  const [vehiculos, setVehiculos] = useState([])


  ////////////////////////////////
  // SETEOS INICIALES DEL CALENDARIO
  ////////////////////////////////
  useEffect( () => { 

    socket.on('connect', () => {
      console.log('connected' , socket.id)
      if(localStorage.hasOwnProperty('addEvent')){
        //listOtherEvents()
      } 
    })

    socket.on("usuarios", (msg)=>{
      console.log(msg)
    })

    //cuando estan agendando desde otro lugar 
    socket.on('addingEvent', (event)=>{
      let list = JSON.parse(localStorage.getItem('addEvent'))
      event = JSON.parse(event) //convertimos a array
      toast(` ${event.title} esta registrando en la fecha ${event.fecha} `)
      list.push(event)
      localStorage.setItem("addEvent", JSON.stringify(list))
      setEvento( [...evento, event ])
    })

    //cuando estan agendando desde otro lugar 
    socket.on('changingEvent', (event)=>{
      setEvento( event )
    })

    //cuando cancela el evento
    socket.on('cancelingEvent', (event)=>{
      let list = JSON.parse(localStorage.getItem("addEvent")) // listamos todos los eventos de otros agentes
      event = JSON.parse(event) //convertimos a array
      list = list.filter(item => item.fecha !== event.fecha ) // filtramos el evento cancelado de la lista 
      localStorage.setItem("addEvent", JSON.stringify(list)) // asignar la lista actualizada
      setEvento( evento.filter(item => item.fecha !== event.fecha))
    })

    //cuando el evento fue agregado
    socket.on('addedInEvent', (event)=>{
      console.log(event)
      let list = JSON.parse(localStorage.getItem("addEvent")) // listamos todos los eventos de otros agentes 
      event = JSON.parse(event) //convertimos a array 
      list = list.filter(item => item.fecha !== event.fecha ) // filtramos el evento cancelado de la lista 
      localStorage.setItem("addEvent", JSON.stringify(list)) // asignar la lista actualizada
      localStorage.setItem("eventos", JSON.stringify(event)) // guardamos el evento grabado
      setBaseDatos([...baseDatos, event ])
      setEvento( [...evento, event ])
    })

    //inicializar el evento... 
    if(!localStorage.hasOwnProperty('addEvent')){
      localStorage.setItem("addEvent", "[]")
    }      
    localStorage.setItem("addEvent", "[]")

    //caso de reiniciar la aplicacion se actualiza desde aqui el render 
    if(baseDatos.length == 0 ){
      if(!localStorage.hasOwnProperty('eventos')){
        localStorage.setItem("eventos", "[]")
      }  
      let base = JSON.parse( localStorage.getItem('eventos' ))
      setBaseDatos( base )
      let misAgendas =[] 
      evento.forEach(item => misAgendas.push(item ))
      base.forEach(item   => misAgendas.push(item ))
      setEvento(misAgendas)
      //setEvento([...evento, item ])
    }

    listaVehiculos()
    talleres()
    //listaAgenda(  )

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
            id: item.id
          })
        })
        setVehiculos(lista)
       
      })
      .catch(err => console.log(err))      
    }

    const listaAgenda= async (fechai , fechaf) =>{
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
                //backgroundColor: '#5cb85c',
                //borderColor: '#5cb85c',
                //allDay: true,
                classNames: 'bg-gradient-success',
                vehiculos: vhe.rows.filter(item2 => item.det.map(item3 => item3.vin ).includes(item2.vin) )
              })
            })
            setEvento(lista)
            setBaseDatos(lista)
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

    const recuperarCliente = async (e)=>{
      e.preventDefault()

      let codigo = document.getElementsByName('buscar')[0].value
      await fetch('http://localhost:3000/api/clientes/'+ codigo)
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
      setData({
          ...data,
          [e.target.name]: e.target.value
      })
    }

    ///////////////////////////////////////////////////////////////////////////
    /// NUEVO EVENTO 
    ///////////////////////////////////////////////////////////////////////////
    const handleDateClick = (arg) => { 

      listaVehiculos()
      talleres()
      asignadosxFecha(arg.dateStr)
      setAsignados([])
      dataInterface.fechai = arg.dateStr
      dataInterface.fechaf = arg.dateStr
      setData(dataInterface)
      //setData({...data, fechai: arg.dateStr , fechaf: arg.dateStr})
      let eventos = []
      if(localStorage.hasOwnProperty('addEvent')){
        eventos = JSON.parse( localStorage.getItem('addEvent'))
      }

      //si existe algun evento bloquea... 
      if(eventos.findIndex(item => item.fecha === arg.dateStr) >= 0){
        let myEvento = evento.find(item => item.fecha === arg.dateStr)
        Swal.fire(` ${ String(myEvento.title) } \n en esta fecha ${myEvento.fecha } ` )
        return 
      }
      //PARA BLOQUEAR CAMO DE REGISTROS EN OTROS CALENARIOS... 
      let newEvent = {title: `el usuario ${socket.id} \n esta registrando `, date: arg.dateStr , startStr: arg.dateStr, endtStr: arg.dateStr , fecha: arg.dateStr , overlap:false , display:'background' , color: 'yellow' } 
      eventos.push(newEvent)
      socket.emit("addEvent", JSON.stringify(newEvent) )
      console.log(arg)

      ///////////////////////////////////////////////
      //ABRIR EL MODAL PARA REGISTRAR LOS DATOS
      setAgenda({dateStr: arg.dateStr , tipoEvento: 'ins'}) //tomar los datos de la agenda
        toggle() // abrir modal 

    }

    ////////////////////////////////////////////////////////////////////
    // PARA VER DATOS DEL EVENTO
    ////////////////////////////////////////////////////////////////////
    const handleEventClick = (info) => { 
      console.log(info)
      //alert(info.event.title)
      setAgenda({dateStr: info.event.startStr, tipoEvento: 'upd' , title: info.event.title })
      let myEvent = {
        fecha: moment(info.event.extendedProps.fecha).format('YYYY-MM-DD'), 
        fechai: moment(info.event.extendedProps.fechai).format('YYYY-MM-DD'), 
        fechaf:moment(info.event.extendedProps.fechaf).format('YYYY-MM-DD'), 
        codigoCliente: info.event.extendedProps.codigo_cliente, 
        nombreCliente: info.event.extendedProps.nombre_cliente, 
        taller: info.event.extendedProps.id_taller
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
      list.push({title: changeEvent.title, date: changeEvent.fecha , start: moment(changeEvent.start).format('YYYY-MM-DD') , end: moment(changeEvent.end).format('YYYY-MM-DD'), fecha: changeEvent.fecha, vehiculos: changeEvent.vehiculos }) // luego agregamos el nuevo evento
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
      const agenda = {
                      cab : {
                        codigo_cliente: data.codigoCliente,
                        nombre_cliente: data.nombreCliente,
                        titulo: data.nombreCliente,
                        id_estado: 21, //agendado
                        id_taller: data.taller,
                        fecha: moment(data.fechai).format('YYYY-MM-DD'),
                        fechai: moment(data.fechai).format('YYYY-MM-DD'),
                        fechaf: moment(data.fechaf).format('YYYY-MM-DD'),
                        estado: 'Agendado',
                        user_ins: 'admin'
                      },
                      det : asignados.map(item=>{
                        return (
                          {
                            id_cab: 0, 
                            nombre: item.modelo,
                            id_vehiculo: item.id,
                            estado: 'Agendado',
                            user_ins : 'admin'
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
        alert(JSON.stringify(json))
        let fecha = data.fechai 
        setAsignados([]) // limpiamos lista de vehiculos 
        setData(dataInterface) //limpiamos los datos de la agenda
        setListaCliente([]) //limpiamos el buscador
        toggle() //cerramos el modal de la agendamiento.
        listaAgenda( moment(fecha).format('YYYY-MM') )// recuperamos las agenda del mes

      })
      .catch(err => console.log(err))

    } 

    const cancelarEvento = ()=>{

      //SE CANCELO EL EVENTO
      socket.emit("cancelEvent", JSON.stringify({title: 'el usuario '+ socket.id+' cancelo un evento ', date: agenda.dateStr , fecha: agenda.dateStr }))
      setAgenda({})
      setListaAsignados([])
      toggle()
    }


    const toggle = () => setModal2(!modal2)
    const Modal1 = ()=>{
      return (
        <div>
          <Modal isOpen={modal2} fade={false} centered={true}  size='xl' style={{minWidth:'95%'}}>
            <ModalHeader toggle={()=>cancelarEvento()} style={{paddingTop:'5px', paddingBottom:'2px'}}> {(agenda?.tipoEvento === 'ins')? 'Nuevo Evento' : 'Modificar Evento' } | { agenda?.dateStr } |  {(agenda?.tipoEvento === 'upd'? 'Agendado' : '' )} </ModalHeader>
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
                        <tr style={{textAlign:'center'}}>
                          <th scope="col">#</th>
                          <th scope="col">MARCA</th>
                          <th scope="col">MODELO</th>
                          <th scope="col">NRO CHAPA</th>
                          <th scope="col">AÑO</th>
                          <th scope="col">VIN</th>
                          <th scope="col">#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          vehiculos.map((item, index )=>{
                            return (
                                <tr className={ `align-middle ${
                                  (agenda?.tipoEvento === 'upd')
                                  ?(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                    ?'bg-success text-white'
                                    : ''
                                  :(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                    ? 'bg-warning' 
                                    : (listaAsignados.findIndex(item3 => item3.vin === item.vin && moment(agenda?.dateStr) <= moment(item3.fechaf) ) >= 0 )
                                      ? 'bg-success text-white'
                                      : ''
                                  }` } key={item.vin} >
                                
                                  <th>{index + 1}</th>
                                  <td>{item.marca}</td>
                                  <td>{item.modelo}</td>
                                  <td>{item.chapa}</td>
                                  <td>{item.anho}</td>
                                  <td>{item.vin}</td>
                                  <td style={{paddingRight: '0px', textAlign:'right'}}>
                                      {
                                        (agenda?.tipoEvento === 'upd')
                                        ?(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                          ?<span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                          : <span></span>
                                        :(baseDatos.filter(item2 => item2.fecha === agenda?.dateStr )?.map(item => item.vehiculos )?.flat().findIndex(item3 => item3.vin === item.vin) >= 0 )
                                          ? <span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                          : (asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                            ?<span></span>
                                            :(agenda.tipoEvento === 'ins')
                                              ?(listaAsignados.findIndex(item3 => item3.vin === item.vin ) >= 0 )
                                                ?<span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                                :<i className="bi bi-arrow-right btn btn-warning font-weight-bold px-2 py-0 " style={{fontSize:'20px'}} onClick={()=> asignarVehiculo(item.vin) }></i> 
                                              :<span></span>
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
                    <Stepper activeStep={ (agenda.tipoEvento === 'upd')? 0 : -1 } style={{padding:'0px'}}>
                      <Step label="Agendado" />
                      <Step label="Entregado" />
                      <Step label="Recibido" />
                    </Stepper>                  

                    <form onSubmit={e => e.preventDefault} className="">
                      <div className='row'>

                        <div className='col-4'>
                          <div className="mb-3">
                            <label htmlFor="uname" className="form-label text-center w-100"><b>Fecha inicio:</b></label>
                            <input type="date" className="form-control" id="uname" placeholder="Enter username" name="fechai" required value={(data.fechai.length > 0)?data.fechai:agenda.dateStr} ref={fechaIRef} onChange={updateData} readOnly={(agenda?.tipoEvento === 'upd')?true:false }  />
                          </div>
                        </div>

                        <div className='col-4'>
                          <div className="mb-3">
                            <label htmlFor="pwd" className="form-label text-center w-100"><b>Fecha Fin:</b></label>
                            <input type="date" className="form-control" id="pwd" placeholder="Enter password" name="fechaf" required value={(data.fechaf.length > 0)?data.fechaf:agenda.dateStr} ref={fechaFRef} onChange={updateData } readOnly={(agenda?.tipoEvento === 'upd')?true:false } />
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
                          <button type="button" className="btn btn-primary" onClick={()=> setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(0, 'd').format('YYYY-MM-DD')})  } disabled={(agenda?.tipoEvento === 'upd')?true:false } >1 Dia</button>
                          <button type="button" className="btn btn-warning" onClick={()=> setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(1, 'd').format('YYYY-MM-DD')}) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >2 Dias</button>
                          <button type="button" className="btn btn-info"    onClick={()=> setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(2, 'd').format('YYYY-MM-DD')}) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >3 Dias</button>
                          <button type="button" className="btn btn-danger"  onClick={()=> setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(3, 'd').format('YYYY-MM-DD')}) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >4 Dia</button>
                          <button type="button" className="btn btn-dark"    onClick={()=> setData({...data, ['fechaf']:fechaFRef.current.value = moment(agenda?.dateStr).add(4, 'd').format('YYYY-MM-DD')}) } disabled={(agenda?.tipoEvento === 'upd')?true:false } >5 Dias</button>
                        </div>              
                      </div>
                      <div className='row'>
                          <div className="input-group mt-3 mb-3"> 
                            <span class="input-group-text"><b>Cliente</b></span>
                            <button className="btn btn-primary " onClick={ buscarCliente } data-bs-toggle="dropdown" disabled={(agenda?.tipoEvento === 'upd')?true:false } > <b> <i class="bi bi-search"></i> </b> </button>
                            <input type="text" className="form-control" placeholder="codigo cliente..." name="codigoCliente" ref={codigoCliRef} onChange={ updateData } value={data?.codigoCliente} readOnly/>
                            <input type="text" className="form-control" id="nombreCliente" placeholder="Nombre de Cliente" name="nombreCliente" ref={nombreCliRef} style={{width:'35%'}} onChange={ updateData } value={data?.nombreCliente} readOnly/>
                          </div>

                          <div className="input-group mt-3 mb-3"> 
                          <span class="input-group-text"><b>Taller</b> &nbsp;&nbsp;&nbsp;</span>
                          <select class="form-select" aria-label="Default select example" name="taller" onChange={ updateData }  value={data?.taller} disabled={(agenda?.tipoEvento === 'upd')?true:false }>
                            <option selected>Taller ?</option>
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
                                          <td>{item.vin}</td>
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
                              <button className="btn btn-primary "  type="btn" > <b> <i class="bi bi-search"></i> </b> </button>
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
                (agenda.tipoEvento === 'upd' )
                ?
                  <>
                    <Button color="info" > Entregado </Button>
                    <Button color="dark" style={{marginRight:'25px'}}> Recibido </Button>
                    <Button color="secondary" > Re-Agendar </Button>
                    <Button color="warning" style={{marginRight:'25px'}}> Cancelar Agenda</Button>
                  </>
                : <span></span>
               }             

              <Button color="primary" onClick={()=> crearEvento()} disabled={(asignados.length > 0 ? false : true)} > Agendar</Button>
              <Button color="danger" onClick={()=>cancelarEvento()}> Salir</Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    }

    const asignarVehiculo = (chassis) =>{
        let vehiculo = vehiculos.find(item => item.vin === chassis )
        setAsignados([...asignados, vehiculo])
  
    }

    const eliminarAsignacion = (chassis)=>{

        let lista = asignados.filter(item => item.vin !== chassis )
        console.log('eliminando item ' , chassis , lista )
        setAsignados(lista)
    }

  return (
    <Layout>
      <div className="d-flex">
      
      <div className="flex-grow-1 ml-3">
        <FullCalendar
          dayMaxEventRows={true}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
              center: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
              //right:
              //left:
            }}
          locale={'es'} 
          editable 
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
          datesSet={(args) => listaAgenda(moment(args.startStr).format('YYYY-MM-DD'), moment(args.endStr).format('YYYY-MM-DD'))}  //console.log("###datesSet:", args)}
        /> 

      </div>

      </div>
      <Modal1 />
    </Layout>
)
}

export default Calendar