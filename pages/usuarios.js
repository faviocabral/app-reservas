import React, {useState , useEffect , useRef} from 'react'
import Layout from '../components/Layout'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useFormik  } from 'formik';
import Cookies from 'js-cookie'
import {useRouter} from 'next/router'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

export default function Usuarios() {
    
    const router = useRouter()
    const [listaUsuarios , setListaUsuarios ] = useState([])
    const [usuario , setUsuario ] = useState({})        //({id: null , nombre: null , user: null , password: null , id_tipo_usuario: null , estado: null })
    const [crud , setCrud ]       = useState('')
    const nombreRef = useRef()
    const tipoRef   = useRef()
    const estadoRef = useRef()

    useEffect(()=>{

        listarUsuarios()
        setTimeout(() => {
            init()
        }, 300);

    }, [])

    //seteamos campos por defecto 
    const init = () => {
        const oForm = document.forms[0];
        setUsuario({
            id:'',
            nombre:'',
            user: '',
            password:'',
            id_tipo_usuario: oForm.elements["id_tipo_usuario"].value,
            estado: oForm.elements["estado"].value,
        })
        setCrud('ins')
        nombreRef.current.focus()
    }

    //recuperamos la lista de usuarios
    const listarUsuarios = async() =>{
        try {
            await fetch('api/usuarios' )
                .then(response => response.json()) 
                .then(rows => {  
                    setListaUsuarios(rows.users)
                  })
        } catch (error) {
            console.log('hubo un error el recuperar usuarios' , error)            
        }
    }

    // enviar datos al backend 
    const handleSubmit = async(e) => {
        e.preventDefault()
        nombreRef.current.focus()
        let idUser = 0;
        let index = Object.values(usuario).findIndex((item , index ) => item?.length ===0 && index !== 0 )
        if(index > 0 ){
            toast.error('Debe completar todos los campos !!! ')
            return 
        }

        //estos campos no necesitamos actualizar ... 
        if(crud === 'upd'){
            let userSession = JSON.parse(Cookies.get('userRenting'))
            if(usuario.user === userSession.user )
                //setear de vuelta el usuario en la cookies
                Cookies.set('userRenting' , JSON.stringify( {nombre: usuario.nombre , user: usuario.user , tipo: usuario.tipo} ) , { expires: 1 })

            idUser = usuario.id 
            
            delete usuario.id // en mysql no tiene problema pero si en mssql 
            delete usuario.tipo
            delete usuario.fecha_ins 
            delete usuario.user_ins

        }else{
            delete usuario.id // lo mismo el id identity no tiene problemas al enviar a mysql pero si en mssql 
        }

        Swal.showLoading()
        let url =  (crud === 'ins')? 'api/usuarios'  : `api/usuarios?id=${idUser}`
        await fetch( url  , {
            method: (crud === 'ins')?"POST": "PUT",
            body: JSON.stringify(usuario),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {
            toast.success('Datos Grabados correctamente !!! ' )
            Swal.close()
            init()
            listarUsuarios()

        })
        .catch(err => alert(err))

    }
    
    //cuando queremos modificar el usuario
    const editar= (user) =>{
        setCrud('upd')
        setUsuario(user)
        nombreRef.current.focus()
    }

    //cuando cancelamos la operacion.
    const cancelar = () =>{
        //alert( JSON.stringify( Object.values(usuario)?.map(item => item?.length > 0 ).filter(item => item).length ) )
        init()
    }

    //para setear los campos del form y enviar al backend 
    const updateData = e => {
        setUsuario({
            ...usuario,
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

                                <h3 style={{marginLeft:'20px'}}>Usuarios</h3>
                            <div className="col w-50">
                                <div className="form-check mb-3">
                                    <label className="form-check-label"><b>Codigo</b></label>
                                    <input type="text" className="form-control" placeholder="codigo" name="id" autoComplete="off" readOnly value={usuario?.id} onChange={ updateData } />
                                </div>    
                            </div>

                            <div className="col">
                                <div class="form-check mb-3">
                                    <label className="form-check-label"><b>Nombre</b></label>
                                    <input type="text" ref={nombreRef} className="form-control" placeholder="Nombre usuario" name="nombre" autoComplete="off" value={usuario?.nombre} onChange={ updateData } />
                                </div>     
                            </div>

                        </div>

                        <div className="row">

                            <div className="col"> 
                                <div class="form-check mb-3"> 
                                    <label className="form-check-label"><b>Usuario</b></label> 
                                    <input type="text" className="form-control" placeholder="Nombre usuario" name="user" autoComplete="off" value={usuario?.user} onChange={ updateData } /> 
                                </div> 
                            </div> 

                            <div className="col">
                            <div class="form-check mb-3">
                                    <label className="form-check-label"><b>Password</b></label>
                                    <input type="password" className="form-control" placeholder="Nombre usuario" name="password" value={usuario?.password} autoComplete="off" onChange={ updateData } />
                                </div>     
                            </div>

                        </div>

                        <div className="row">

                            <div className="col">
                                <div class="form-check mb-3">
                                    <label className="form-check-label"><b>tipo Usuario</b></label>
                                    <select class="form-select" aria-label="Default select example" onBlur={(e)=>setUsuario({...usuario, id_tipo_usuario: e.target.value })} name="id_tipo_usuario" value={usuario?.id_tipo_usuario} onChange={ updateData } ref={tipoRef}>
                                        <option selected value="1">Administrador</option>
                                        <option value="2">Gte Taller</option>
                                        <option value="5">Call Center</option>
                                        <option value="4">Asesor</option>
                                        <option value="3">Supervisor</option>
                                    </select>
                                </div>     
                            </div>

                            <div className="col">
                            <div class="form-check mb-3">
                                    <label className="form-check-label"><b>Estado</b></label>
                                    <select class="form-select" aria-label="Default select example" name="estado"  value={usuario?.estado} onChange={ updateData } ref={estadoRef} >
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
                        <h3>Listado Usuarios</h3>
                        <table className="table table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th className="text-center">Codigo</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Tipo Usuario</th>
                                    <th>Estado</th>
                                    <th className="ml-3">Accion</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listaUsuarios?.map((item, index)=>{
                                        return (
                                            <tr key={item.id}>
                                                <th>{index +1}</th>
                                                <td className="text-center">{item.id}</td>
                                                <td>{item.nombre}</td>
                                                <td>{item.user}</td>
                                                <td>{item.tipo}</td>
                                                <td>{
                                                    (item.estado === 'activo')
                                                        ? <span class="badge text-bg-success">{item.estado}</span> 
                                                        : <span class="badge text-bg-danger">{item.estado}</span> 
                                                    }
                                                </td>
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
