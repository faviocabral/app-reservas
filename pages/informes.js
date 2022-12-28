import React,{useState , useRef , useEffect} from 'react'
import Layout from '../components/Layout'
import moment from 'moment'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";


import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';


export default function Informes() {

  const report = [
    {id:1 , nav: 'active' , tab:'active' },
    {id:2 , nav: ''       , tab:'fade'   },
    {id:3 , nav: ''       , tab:'fade'   },
  ]
  const [informe , setInforme] = useState(report);

  const subReport = [
    {id:1 , nav: 'active' , tab:'active' },
    {id:2 , nav: ''       , tab:'fade'   },
  ]
  const [subInforme , setSubInforme] = useState(subReport);

  const columns = [
    { name: '#', selector: '#', width:'60px', cell: (row,index) => index +1 , cellExport: (row, index)=> index +1 },
    { name: 'Codigo', selector: 'codigo' , sortable: true, },
    { name: 'Cliente', selector: 'cliente', sortable: true, minWidth:'280px', },
    { name: 'Vehiculo', selector: 'vehiculo', sortable: true, },
    { name: 'Chapa', selector: 'chapa', sortable: true, },
    { name: 'Taller', selector: 'taller', sortable: true, minWidth:'140px', },
    { name: 'Fecha Inicio', selector: 'fechai', sortable: true, cell: row => moment(row.fechai).utc().format('YYYY-MM-DD HH:mm'),minWidth:'140px', },
    { name: 'Fecha Fin', selector: 'fechaf', sortable: true, cell: row => moment(row.fechaf).utc().format('YYYY-MM-DD HH:mm'),minWidth:'140px',},
    { name: 'Dias', selector: 'dias' , sortable: true, width:'80px', },
    //{ name: 'Dias', selector: 'dias' , sortable: true, width:'80px',  cell: row => (moment(row.fechaf).diff(row.fechai , 'days')+1 ) },
    { name: 'Estado', selector: 'estado', cell: row => <span className={`badge ${color[row.estado]}`}>{row.estado.toUpperCase() }</span> , sortable: true, },
    { name: 'Agendado', selector: 'Agendado', sortable: true, },
    { name: 'Entregado', selector: 'Entregado', sortable: true, },
    { name: 'Recibido', selector: 'Recibido', sortable: true, },
    { name: 'Cancelado', selector: 'Cancelado', sortable: true,  },

];

  const [data , setData] = useState([])
  const [agendado, setAgendado] = useState(0)
  const [entregado, setEntregado] = useState(0)
  const [recibido, setRecibido] = useState(0)
  const [cancelado, setCancelado] = useState(0)
  const [taller , setTaller] = useState([])
  const [state , setState] = useState() 

  const fechaiRef = useRef()
  const fechafRef = useRef()
  const tallerRef = useRef()

  const color = {
    Agendado: 'badge bg-primary',
    Entregado: 'bg-info',
    Recibido: 'bg-success',
    Cancelado: 'bg-danger',
  }
  const verInforme =(id) =>{
    report.forEach(item=>{ 
      if(item.id === id){
        item.nav= 'active'
        item.tab= 'active'
      }else{
        item.nav= ''
        item.tab= 'fade'
      }
    }) 
    setInforme( report ) 
  }

  const verSubInforme =(id) =>{ 
    subReport.forEach(item=>{ 
      if(item.id === id){ 
        item.nav= 'active' 
        item.tab= 'active' 
      }else{ 
        item.nav= ''
        item.tab= 'fade'
      }
    }) 
    setSubInforme( subReport ) 
  } 

  useEffect(()=>{
    setTimeout(() => {
      cancelar()
      talleres()
    }, 200);
  }, [])

  const handleSubmit = async(e) =>{
    e.preventDefault() 
    const formData = new FormData(e.target) 
    const datos = Object.fromEntries(formData) 
    try {
      Swal.showLoading()      
      await fetch(`api/calendar/informe/${datos.fechai}/${datos.fechaf}/${datos.taller}` )
        .then(response => response.json()) 
        .then(rows => { 
          Swal.close()
          if(rows.rows.length === 0 ){
            toast.error('No existen Registros !!!')
            setData([])
            return 
          } 
          
          toast.success('Consulta Exitosa !!!')
          const lista = rows.rows.map(item =>{ 
                                              return({...item, 
                                                        fechai: moment(item.fechai).utc().format('YYYY-MM-DD HH:mm') 
                                                        ,fechaf: moment(item.fechaf).utc().format('YYYY-MM-DD HH:mm') 
                                                        ,dias : moment(item.fechaf).utc().diff(item.fechai , 'days')+1 
                                                        ,mes: Number(moment(item.fechai).utc().format('MM'))
                                                        ,dia: Number( moment(item.fechai).utc().format('DD'))
                                                        ,anho: moment(item.fechai).utc().format('YYYY')
                                                      })
                                             })
          console.log(lista)
          setData(lista)
          let res = rows.rows
          //asignar cantidades de los estados 
          setAgendado(res.filter(item => item.id_estado === 1).length)
          setEntregado(res.filter(item => item.id_estado === 2).length)
          setRecibido(res.filter(item => item.id_estado === 3).length)
          setCancelado(res.filter(item => item.id_estado === 4).length)
          
        })

      } catch (error) {
        alert(error)
          console.log('hubo un error el recuperar marcas' , error)            
      }    
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

  const cancelar = () => {
    fechaiRef.current.value = moment().startOf('month').format('YYYY-MM-DD');
    fechafRef.current.value = moment().endOf('month').format('YYYY-MM-DD');
    setData([])
  }

  return (
    <Layout>

        <div className="container-fluid">

          <div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className={`nav-link ${ informe[0].nav }`} data-bs-toggle="tab" onClick={()=> verInforme(1)} ><b>Informe Agendamientos</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${ informe[1].nav }`} data-bs-toggle="tab" onClick={()=> verInforme(2)} ><b>Informe Comisiones</b></a>
              </li>

            </ul>
            <div className="tab-content">
              <div className={`tab-pane container ${ informe[0].tab }`} >

                <div className="row mt-3">

                    <form noValidate onSubmit={handleSubmit} >

                        <div className="row">
                          <h4>Filtros</h4>
                            <div className="col">
                                <div className="form-check mb-3">
                                    <label className="form-check-label"><b>Fecha inicio</b></label>
                                    <input type="date" ref={fechaiRef} className="form-control" placeholder="codigo" name="fechai" autoComplete="off"  />
                                </div>    
                            </div>

                            <div className="col">
                                <div class="form-check mb-3">
                                    <label className="form-check-label"><b>Fecha fin</b></label>
                                    <input type="date" ref={fechafRef} className="form-control" placeholder="Nombre usuario" name="fechaf" autoComplete="off" />
                                </div>     
                            </div>

                            <div className="col">
                                <div class="form-check mb-3">
                                    <label className="form-check-label"><b>Taller</b></label>
                                    <select className="form-select" aria-label="Default select example" name="taller" ref={tallerRef}  >
                                      <option selected value="0">Todos ?</option>
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

                        </div>
                        <div className="row">
                          <div className="form-check mb-3 d-flex justify-content-end">
                              <button type="submit" class="btn btn-primary" >Aceptar</button>
                              <button type="button" class="btn btn-danger" style={{marginLeft:'10px'}} onClick={cancelar} >Cancelar</button>
                          </div>     
                        </div>
                    </form>

                </div>
                
                <div className="row">

                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a className={`nav-link ${ subInforme[0].nav }`} data-bs-toggle="tab" onClick={()=> verSubInforme(1) } ><b>Listado</b></a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${ subInforme[1].nav }`} data-bs-toggle="tab" onClick={()=> verSubInforme(2) } ><b>Dinamico</b></a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className={`tab-pane container-fluid ${ subInforme[0].tab }`} >
                    <div className="row mt-3">
                      <DataTableExtensions columns={columns} data={data} exportHeaders={true} print={true}>
                        <DataTable
                            columns={columns}
                            data={data}
                            //noHeader
                            dense
                            //pagination
                            striped={true}
                            highlightOnHover={true}
                            fixedHeader
                            fixedHeaderScrollHeight="400px" 
                        />
                      </DataTableExtensions>  
                    </div>
                  </div>
                  <div className={`tab-pane container ${ subInforme[1].tab }`} >
                    <div className="row mt-3">
                    <PivotTableUI
                      data={data}
                      rows={['anho','mes','taller' , 'vehiculo' , 'chapa']}
                      cols={['estado']}
                      onChange={s => setState(s)}
                      {...state}
                    />

                    </div>
                  </div>

                </div>

              </div>
              <div className={`tab-pane container ${ informe[1].tab}`} >
                <div className="row mt-3">
                </div>
              </div>
             
            </div>
          </div>
       
        </div>
      </div>
    </Layout>
  )
}
