import React, {useEffect, useRef, createRef, useState} from 'react'
import FullCalendar from '../node_modules/@fullcalendar/react' // must go before plugins
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '../node_modules/@fullcalendar/daygrid' // a plugin!
import dayGridMonth from '../node_modules/@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import Layout from '../components/Layout'
import {io } from "socket.io-client"
import * as moment from 'moment'
import { toast } from 'react-toastify'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Stepper, Step } from 'react-form-stepper'


let socket 
socket = io("http://localhost:8000");


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function calendar() {

  const [evento , setEvento ] = useState([
    //{ title: 'EN USO...' , date : '2022-10-04' , overlap:false , display:'background' },
    { id:1, title: 'event 1', date: '2022-10-01' , start: '2022-10-17' , end: '2022-10-20' },
    { id:2, title: 'event 2', start: '2022-10-10 08:00', end: '2022-10-10 18:00' , color: 'green' },
    { id:3, title: 'event 3', date: '2022-10-10',color  : '#000', valor: 'mas datos', vinculos:[{agenda: 1 , vehiculo: 'kia rio'}, {agenda: 2 , vehiculo: 'kia picanto'}] },
  ])

  //VEHICULOS DISPONIBLES
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
   
   //MODELOS HABILITADOS 
  const modelos = [
    {modelo: 'Kia Niro', foto: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/niro-sg2/discover/kia-niro-ev-my23-actionpanel-get-yours.jpg'},
    {modelo: 'Kia Soluto', foto: 'https://kia.com.py/images/grilla/14_soluto_thumb2.png'},
    {modelo: 'Nissan Kicks', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv6dQRAzhjwtMvYHPYACwHdSyTGiFN8LF2fw&usqp=CAU'},
    {modelo: 'Nissan Versa', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxodJdQYmKh5LEgfK4OxRaSybmdSp3BfcjHg&usqp=CAU'},
  ]

  //VEHICULOS ASIGNADOS 
  const [asignados, setAsignados] = useState([])
  const [updEvent, setUpdEvent] = useState([])
  const calendarRef = createRef()
  const [modal, setModal] = useState('')
  const [alto, setAlto] = useState(100);
  const [modal2, setModal2] = useState(false)
  const [agenda, setAgenda] = useState({}) 
  const [baseDatos, setBaseDatos] = useState([])
  const fechaIRef = useRef()
  const fechaFRef = useRef()
  const clienteRef = useRef()
  
  ////////////////////////////////
  // SETEOS INICIALES DEL CALENDARIO
  ////////////////////////////////
  useEffect(() => { 

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
      let base = JSON.parse( localStorage.getItem('eventos'))
      setBaseDatos( base )  
      let misAgendas =[] 
      evento.forEach(item => misAgendas.push(item))
      base.forEach(item => misAgendas.push(item) )
      setEvento(misAgendas)
      //setEvento([...evento, item ])
    }

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
    }, [])

    const listen = ()=>{
        setAlto(window.innerHeight)
        //console.log(window.innerHeight)
    }

    ///////////////////////////////////////////////////////////////////////////
    /// NUEVO EVENTO 
    ///////////////////////////////////////////////////////////////////////////
    const handleDateClick = (arg) => { 
      //console.log(' events ', calendarRef.current.props.events )

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

    //////////////////////////////////
    // PARA VER DATOS DEL EVENTO
    const handleEventClick = (info) => { 
      console.log(info)
      //alert(info.event.title)
      setAgenda({dateStr: info.event.startStr, tipoEvento: 'upd' , title: info.event.title })
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

    ////////////////////////////////////////////////////////////
    // SE EJECUTA CUANDO HUBO ALGUN CAMBIO EN ALGUN EVENTO LOCAL
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
      //console.log('evento corto modificado' , changeEvent)

      let list = evento.filter(item => item.fecha !== changeEvent.fecha && item.title !== changeEvent.title ) // quitamos de la lista para actualizar el nuevo evento 
      list.push({title: changeEvent.title, date: changeEvent.fecha , start: moment(changeEvent.start).format('YYYY-MM-DD') , end: moment(changeEvent.end).format('YYYY-MM-DD'), fecha: changeEvent.fecha, vehiculos: changeEvent.vehiculos }) // luego agregamos el nuevo evento
      setEvento(list)
      socket.emit('changeEvent' , list )

    }


    const crearEvento = ()=>{
      if(asignados.length === 0 ){ 
        Swal.fire({ title:'Debe seleccionar un vehiculo para agendar ', icon: 'warning'})
        return 
      }

      //AGREGANDO NUEVO EVENTO - AVISAR A LOS DEMAS DEL NUEVO REGISTRO 
      let newEvent = {title: clienteRef.current.value , date: agenda.dateStr , fecha: agenda.dateStr , start: agenda.dateStr , end: agenda.dateStr , vehiculos : asignados } 
      let dato= baseDatos 
      dato.push(newEvent)
      setBaseDatos(dato) 
      setEvento( [...evento, newEvent ]) 
      setAsignados([]) 
      console.log(baseDatos)
      localStorage.setItem('eventos', JSON.stringify(baseDatos) ) 
      socket.emit("addedEvent", JSON.stringify( newEvent )) 
      toggle() 

    } 

    const cancelarEvento = ()=>{

      //SE CANCELO EL EVENTO
      socket.emit("cancelEvent", JSON.stringify({title: 'el usuario '+ socket.id+' cancelo un evento ', date: agenda.dateStr , fecha: agenda.dateStr }))
      setAgenda({})
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
                                  ?(baseDatos?.find(item2 => item2.fecha  === agenda?.dateStr &&  item2.title === agenda.title )?.vehiculos?.findIndex(item3 => item3.vin === item.vin) >= 0 )
                                    ?'bg-success text-white'
                                    : ''
                                  :(baseDatos?.filter(item2 => item2.fecha === agenda?.dateStr )?.map(item => item.vehiculos )?.flat().findIndex(item3 => item3.vin === item.vin) >= 0 )
                                    ? 'bg-success text-white'
                                    :(asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                      ? 'bg-warning' 
                                      :'' 
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
                                        ?(baseDatos?.find(item2 => item2.fecha  === agenda?.dateStr &&  item2.title === agenda.title )?.vehiculos?.findIndex(item3 => item3.vin === item.vin) >= 0 )
                                          ?<span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                          : <span></span>
                                        :(baseDatos.filter(item2 => item2.fecha === agenda?.dateStr )?.map(item => item.vehiculos )?.flat().findIndex(item3 => item3.vin === item.vin) >= 0 )
                                          ? <span><i className="bi bi-check-lg" style={{fontSize:'24px', position:'relative', left:'-10px'}} ></i></span>
                                          : (asignados.findIndex(item2 => item2.vin === item.vin ) >= 0 )
                                            ?<span></span>
                                            :(agenda.tipoEvento === 'ins')
                                              ?<i className="bi bi-arrow-right btn btn-warning font-weight-bold px-2 py-0 " style={{fontSize:'20px'}} onClick={()=> asignarVehiculo(item.vin) }></i> 
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

                    <form  className="">
                      <div className='row'>
                        <div className='col-6'>
                          <div className="mb-3">
                            <label htmlFor="uname" className="form-label">Fecha inicio:</label>
                            <input type="date" className="form-control" id="uname" placeholder="Enter username" name="uname" required value={agenda?.dateStr} ref={fechaIRef}  />
                          </div>
                        </div>
                        <div className='col-6'>
                          <div className="mb-3">
                            <label htmlFor="pwd" className="form-label">Fecha Fin:</label>
                            <input type="date" className="form-control" id="pwd" placeholder="Enter password" name="pswd" required value={agenda?.dateStr} ref={fechaFRef}/>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="btn-group" style={{ marginBottom: 10,}}>
                          <button type="button" className="btn btn-primary" onClick={()=> fechaFRef.current.value = moment(agenda?.dateStr).add(1, 'd').format('YYYY-MM-DD')  } >1 Dia</button>
                          <button type="button" className="btn btn-warning" onClick={()=> fechaFRef.current.value = moment(agenda?.dateStr).add(2, 'd').format('YYYY-MM-DD') } >2 Dias</button>
                          <button type="button" className="btn btn-info"    onClick={()=> fechaFRef.current.value = moment(agenda?.dateStr).add(3, 'd').format('YYYY-MM-DD') } >3 Dias</button>
                          <button type="button" className="btn btn-danger"  onClick={()=> fechaFRef.current.value = moment(agenda?.dateStr).add(4, 'd').format('YYYY-MM-DD') } >4 Dia</button>
                          <button type="button" className="btn btn-dark"    onClick={()=> fechaFRef.current.value = moment(agenda?.dateStr).add(5, 'd').format('YYYY-MM-DD') } >5 Dias</button>
                        </div>              
                      </div>
                      <div className='row'>
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder="Ingrese codigo cliente..." required />
                          <button className="btn btn-primary" type="btn">Buscar</button>
                        </div>
                        
                        <div className="mb-3">
                          <input type="text" className="form-control" id="nombreCliente" placeholder="Nombre de Cliente" name="nombreCliente" defaultValue={''} ref={clienteRef} value={agenda?.title} />
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
                              (baseDatos.findIndex(item2 => item2.fecha === agenda?.dateStr && agenda?.tipoEvento === 'upd' ) >= 0 )
                              ? baseDatos.find(item2 => item2.fecha === agenda?.dateStr && item2.title === agenda?.title )?.vehiculos.map((item, index)=>{
                                  return (
                                    <tr className='align-middle' key={item.vin}>
                                    <th>{index + 1}</th>
                                    <td>{item.marca}</td>
                                    <td>{item.modelo}</td>
                                    <td>{item.chapa}</td>
                                    <td>{item.anho}</td>
                                    <td>{item.vin}</td>
                                    <td style={{paddingRight:'0px', textAlign:'right'}}>  </td>
                                  </tr>
                                  )
                                })
                              :(asignados.length > 0 )
                                ? asignados.map((item, index )=>{
                                    return (
                                        <tr className='align-middle' key={item.vin}>
                                          <th>{index + 1}</th>
                                          <td>{item.marca}</td>
                                          <td>{item.modelo}</td>
                                          <td>{item.chapa}</td>
                                          <td>{item.anho}</td>
                                          <td>{item.vin}</td>
                                          <td style={{paddingRight:'0px', textAlign:'right'}}>  <i className="bi bi-x-lg btn btn-danger font-weight-bold px-2 py-0 " style={{fontSize:'20px'}} onClick={()=> eliminarAsignacion(item.vin)}  ></i> </td>
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
          selectable
          slotMinTime= {"07:30:00"}  //inicio de hora 
          slotMaxTime= {"18:00:00"} //fin de hora 
          //eventLimit={true} 
          views={viewConfig}  //configuracion de la vista 
          height={alto - 80} // alto maximo del calendario caso de un resize
          hiddenDays={[0]}  // no incluye domingos
          dateClick={handleDateClick}    //para agregar un nuevo evento
          eventClick={handleEventClick} //se optiene los datos del evento 
          //eventsSet={handleChanges}    //cualquier cambio del calendario
          eventChange={handleChange}  //algun cambio del calendario
          eventAdd={handleNewEvent}  //se ejecuta cuando se agrega un nuevo evento
          events={evento} 
        /> 

      </div>

      </div>
      <Modal1 />
    </Layout>
)
}

export default calendar