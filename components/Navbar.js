import React , {useContext , useEffect, useState} from 'react'
import Link from 'next/link'
import AppContext from '../context/appContex'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Buscador from '../components/Buscador.js' //modal.

function Navbar() {
  
  const router = useRouter()
  const contextLogin = useContext(AppContext)
  const [usuario , setUsuario] = useState({})
  const [auth , setAuth] = useState(false)
  const [dropdown , setDropdown] = useState('')


  useEffect(()=>{
    isAuth()
  },[])

  const authMesg = () =>{
    if(!auth){
      toast.error('No esta autorizado a utilizar este modulo') 
    } 
  }

  const logout = () => {
    contextLogin.setLogin(false)
    Cookies.remove('logginRenting') 
    Cookies.remove('userRenting' )
    router.push("/login")
  }

  const isAuth = () => {

    let control = JSON.parse(Cookies.get('userRenting')) 
    if( ('administrador supervisor').includes( control.tipo.toLowerCase() ))
      setAuth(true)

  }


  return (

  <div className=" text-bg-dark cab mb-2">
    <div className="container-fluid">
      <div className="d-flex  justify-content-between">
        <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
  
          <li>
            <Link href="/calendar">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
                <i className="bi bi-calendar-date d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Calendario</span>
              </a>
            </Link>
          </li>

          <li>
            <Link href={(auth)?"/vehiculos":""} >
              <a href="#" className="nav-link text-secondary pt-0 pb-1" onClick={authMesg}>
                <i className="bi bi-car-front d-block mx-auto text-center text-white" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Vehiculos</span>
              </a>
            </Link>
          </li>
  
          <li>
            <Link href="/informes">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
                <i className="bi bi-easel3 d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Informes</span>
              </a>
            </Link>
          </li>

          <li>
            <Link href={(auth)?"/usuarios":""} >
              <a href="#" className="nav-link text-secondary pt-0 pb-1" onClick={authMesg}>
                <i className="bi bi-person-fill d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Usuarios</span>
              </a>
            </Link>
          </li>
          
        </ul>

        <ul className="nav col-12 col-lg-auto my-2 justify-content-end my-md-0 text-small">

          <li>
          <div className="dropdown">
              <a href="#" className="nav-link text-secondary pt-0 pb-1 dropdown-toggle" data-bs-toggle="dropdown" onClick={()=> setDropdown( (dropdown === '')? 'show':'' ) } >
                <i className="bi bi-person-fill d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">{contextLogin.usuario.nombre}</span>
              </a>
              <ul className={`dropdown-menu ${dropdown}`} >
                <h5 className="text-center">DATOS</h5>
                <li><a className="dropdown-item" href="#"><b>Usuario: </b> {contextLogin.usuario.user}</a></li>
                <li><a className="dropdown-item" href="#"><b>Role: </b> {contextLogin.usuario.tipo}</a></li>
              </ul>              
            </div>  
          </li>

          <li>
              <a href="#" className="nav-link text-secondary pt-0 pb-1" onClick={logout}>
                <b><i className="bi bi-power d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i></b>
                <span className="text-white">Logout</span>
              </a>
          </li>
          
        </ul>

      </div>
    </div>
  </div>


  )
}

export default Navbar