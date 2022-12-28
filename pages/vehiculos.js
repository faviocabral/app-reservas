import React, {useState , useEffect , useRef}  from 'react'
import Layout from '../components/Layout'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

function Vehiculos() {

  const [listaVehiculos, setlistaVehiculos] = useState([])
  const [vehiculo, setVehiculo] = useState({})
  const [talleres, setTalleres] = useState([])
  const [modelos, setModelos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [crud, setCrud] = useState('ins')
  const nombreRef = useRef()
  useEffect(()=>{

    listarVehiculos()
    listarTalleres()
    listarMarcas()
    listarModelos()

  },[])

  const init = ()=>{
    setVehiculo({})
    setCrud('ins')
    nombreRef.current.focus()
    document.getElementById('form1').reset();    

  }

  const listarVehiculos = async()=>{
      try {
        await fetch('api/vehiculos' )
            .then(response => response.json()) 
            .then(rows => {  
                setlistaVehiculos(rows.rows)
              })
    } catch (error) {
        console.log('hubo un error el recuperar vehiculos' , error)            
    }
  }

  const listarTalleres = async()=>{
        try {
        await fetch('api/talleres' )
            .then(response => response.json()) 
            .then(rows => {  
                setTalleres(rows.rows)
                })
        } catch (error) {
            console.log('hubo un error el recuperar talleres' , error)            
        }
    }

    const listarMarcas = async()=>{
        try {
        await fetch('api/marcas' )
            .then(response => response.json()) 
            .then(rows => {  
                setMarcas(rows.rows)
                })
        } catch (error) {
            console.log('hubo un error el recuperar marcas' , error)            
        }
    }

    const listarModelos = async()=>{
        try {
        await fetch('api/modelos' )
            .then(response => response.json()) 
            .then(rows => {  
                setModelos(rows.rows)
                })
        } catch (error) {
            console.log('hubo un error el recuperar modelos' , error)            
        }
    }

    const editar=(item)=>{
        //alert(JSON.stringify(item) )
        setVehiculo(item)
        setCrud('upd')
    }

  const handleSubmit = async (e)=>{
    e.preventDefault() 
    const formData = new FormData(e.target) 
    const datos = Object.fromEntries(formData) 
    
    if( Object.values(datos).findIndex((item, index) => item.length === 0 && index > 0 ) > 0 ){ 
        toast.warning('Debe completar todos los campos !!! ', { autoClose: 700}) 
    }else{
        const idVehiculo = datos.id 
        delete datos.id 
        Swal.showLoading()
        let url =  (crud === 'ins')? 'api/vehiculos'  : `api/vehiculos?id=${idVehiculo}`
        await fetch( url  , {
            method: (crud === 'ins')?"POST": "PUT",
            body: JSON.stringify(datos),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {
            toast.success('Datos Grabados correctamente !!! ', { autoClose: 700} )
            Swal.close()
            init()
            listarVehiculos()
        })
        .catch(err => alert(err))
    }
  }

  //para setear los campos del form y enviar al backend 
  const updateData = e => {
    setVehiculo({
        ...vehiculo,
        [e.target.name]: e.target.value
    })
  }

  return (
    <Layout>
      <div className="container-fluid">

        <div className="row">
          <div className="col">

            <form noValidate onSubmit={handleSubmit} id="form1" >
              <div className="row">

                      <h3 style={{marginLeft:'20px'}}>Vehiculos</h3>
                  <div className="col w-50">
                      <div className="form-check mb-3">
                          <label className="form-check-label"><b>Codigo</b></label>
                          <input type="text" className="form-control" placeholder="codigo" name="id" autoComplete="off" readOnly value={vehiculo?.id} onChange={ updateData } />
                      </div>    
                  </div>

                  <div className="col">
                      <div class="form-check mb-3">
                          <label className="form-check-label"><b>Vehiculo</b></label>
                          <input type="text" ref={nombreRef} className="form-control" placeholder="Nombre usuario" name="nombre" autoComplete="off" value={vehiculo?.nombre} onChange={ updateData } />
                      </div>     
                  </div>

              </div>

              <div className="row">

                  <div className="col"> 
                      <div class="form-check mb-3"> 
                          <label className="form-check-label"><b>Vin</b></label> 
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="vin" autoComplete="off" value={vehiculo?.vin} onChange={ updateData } /> 
                      </div> 
                  </div> 

                  <div className="col">
                  <div class="form-check mb-3">
                          <label className="form-check-label"><b>Chapa</b></label>
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="chapa" value={vehiculo?.chapa} autoComplete="off" onChange={ updateData } />
                      </div>     
                  </div>

              </div>

              <div className="row">

                  <div className="col"> 
                      <div class="form-check mb-3"> 
                          <label className="form-check-label"><b>Anho</b></label> 
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="anho" autoComplete="off" value={vehiculo?.anho} onChange={ updateData } /> 
                      </div> 
                  </div> 

                  <div className="col">
                    <div class="form-check mb-3">
                      <label className="form-check-label"><b>Marca</b></label>
                      <select class="form-select" aria-label="Default select example" name="id_marca" value={vehiculo?.id_marca } onChange={ updateData } >
                        {
                            marcas.map(item=>{
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

                  <div className="col">
                      <div class="form-check mb-3">
                          <label className="form-check-label"><b>Modelo</b></label>
                          <select class="form-select" aria-label="Default select example" name="id_modelo" value={vehiculo?.id_modelo} onChange={ updateData } >
                          {
                            modelos.map(item=>{
                                return (
                                    <option key={item.id} value={item.id}> {item.nombre} </option>
                                )
                            })
                        }
                          </select>
                      </div>     
                  </div>

                  <div className="col">
                  <div class="form-check mb-3">
                          <label className="form-check-label"><b>Estado</b></label>
                          <select class="form-select" aria-label="Default select example" name="estado" value={vehiculo?.estado} onChange={ updateData } >
                              <option selected value='activo'>Activo</option>
                              <option value="inactivo">Inactivo</option>
                          </select>

                      </div>     
                  </div>

              </div>

              <div className="row">

                  <div className="col">
                      <div class="form-check mb-3">
                          <label className="form-check-label"><b>Taller</b></label>
                          <select class="form-select" aria-label="Default select example" name="id_taller" value={vehiculo?.id_taller} onChange={ updateData } >
                            {
                                talleres.map(item=>{
                                    return (
                                        <option key={item.id} value={item.id}> {item.nombre} </option>
                                    )
                                })

                            }
                          </select>
                      </div>     
                      <div class="form-check mb-3 d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary" disabled={ (crud === 'ins' || crud === 'upd' )? false : true } >{ (crud === 'ins' || crud === '')?'Aceptar':'Modificar' }</button>
                            <button type="reset" class="btn btn-danger" style={{marginLeft:'10px'}} onClick={init}>Cancelar</button>
                        </div>     

                  </div>

                </div>  
            </form>


          </div>
          <div className="col">
                <div className="row">
                    <h3>Listado Vehiculos</h3>
                    <table className="table table-hover table-sm" style={{fontSize:"14px"}}>
                      <thead>
                          <tr>
                              <th>#</th>
                              <th className="text-center">Codigo</th>
                              <th>Marca</th>
                              <th>Modelo</th>
                              <th>Vin</th>
                              <th>Chapa</th>
                              <th>Año</th>
                              <th>Estado</th>
                              <th>Taller</th>
                              <th className="ml-3">Accion</th>
                              
                          </tr>
                      </thead>
                      <tbody>
                          {
                              listaVehiculos?.map((item, index)=>{
                                  return (
                                      <tr key={item.id}>
                                          <th>{index +1}</th>
                                          <td className="text-center">{item.id}</td>
                                          <td>{item.marca}</td>
                                          <td>{item.modelo}</td>
                                          <td>{item.vin}</td>
                                          <td>{item.chapa}</td>
                                          <td>{item.anho}</td>
                                          <td>{
                                              (item.estado.toLowerCase().includes('activo'))
                                                  ? <span class="badge text-bg-success">{item.estado}</span> 
                                                  : <span class="badge text-bg-danger">{item.estado}</span> 
                                              }
                                          </td>
                                          <td> {item.taller} </td>
                                          <td> 
                                              <button className="btn btn-info btn-sm" onClick={()=> editar(item)}>Editar</button>
                                          </td>
                                      </tr>
                                  )
                              })
                          }
                      </tbody>
                  </table>
              </div>
          </div>

        </div> 

      </div>
    </Layout>
  )
}

export default Vehiculos