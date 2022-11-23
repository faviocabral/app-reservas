import React, {useState , useEffect , useRef}  from 'react'
import Layout from '../components/Layout'

function Vehiculos() {

  const [listaVehiculos, setlistaVehiculos] = useState([])
  const [vehiculo, setVehiculo] = useState({})
  const [crud, setCrud] = useState('')
  const nombreRef = useRef()
  useEffect(()=>{

    listarVehiculos()

  })
  const cancelar = ()=>{
    
  }
  const listarVehiculos = async()=>{
      try {
        await fetch('api/vehiculos' )
            .then(response => response.json()) 
            .then(rows => {  
                setlistaVehiculos(rows.rows)
              })
    } catch (error) {
        console.log('hubo un error el recuperar usuarios' , error)            
    }
  }

  const handleSubmit = ()=>{
    alert('submit')
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

            <form noValidate onSubmit={handleSubmit} >
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
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="user" autoComplete="off" value={vehiculo?.vin} onChange={ updateData } /> 
                      </div> 
                  </div> 

                  <div className="col">
                  <div class="form-check mb-3">
                          <label className="form-check-label"><b>Chapa</b></label>
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="password" value={vehiculo?.chapa} autoComplete="off" onChange={ updateData } />
                      </div>     
                  </div>

              </div>

              <div className="row">

                  <div className="col"> 
                      <div class="form-check mb-3"> 
                          <label className="form-check-label"><b>Anho</b></label> 
                          <input type="text" className="form-control" placeholder="Nombre usuario" name="user" autoComplete="off" value={vehiculo?.anho} onChange={ updateData } /> 
                      </div> 
                  </div> 

                  <div className="col">
                    <div class="form-check mb-3">
                      <label className="form-check-label"><b>Marca</b></label>
                      <select class="form-select" aria-label="Default select example" name="id_tipo_usuario" value={vehiculo?.id_marca } onChange={ updateData } >
                          <option selected value="">Kia</option>
                          <option value="">Nissan</option>
                      </select>
                    </div>     
                  </div>

              </div>

              <div className="row">

                  <div className="col">
                      <div class="form-check mb-3">
                          <label className="form-check-label"><b>Modelo</b></label>
                          <select class="form-select" aria-label="Default select example" name="id_tipo_usuario" value={vehiculo?.id_modelo} onChange={ updateData } >
                            <option selected value="">Soluto</option>
                            <option selected value="">Kicks</option>
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
                      <div class="form-check mb-3 d-flex justify-content-end">
                          <button type="submit" class="btn btn-primary" disabled={ (crud === 'ins' || crud === 'upd' )? false : true } >{ (crud === 'ins' || crud === '')?'Aceptar':'Modificar' }</button>
                          <button type="reset" class="btn btn-danger" style={{marginLeft:'10px'}} onClick={cancelar}>Cancelar</button>
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
                                          <td> 
                                              <button className="btn btn-info btn-sm" onClick={()=> alert('Editar Vehiculo ' + item.id )}>Editar</button>
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