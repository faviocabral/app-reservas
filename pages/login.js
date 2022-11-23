import React ,{useState, useContext, useEffect , useRef} from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import AppContext from '../context/appContex.js'

export default function Login() {
  const userInput = useRef()
  const router = useRouter()
  const contextLogin = useContext(AppContext)
  const [data, setData] = useState({})
  const [error, setError] = useState(false)

  const updateData = e => {
    setData({
        ...data,
        [e.target.name]: e.target.value
    })
  }

  const login = async (e)=>{
    e.preventDefault()
    Swal.showLoading()
    fetch('api/login', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => {
      Swal.close()
      console.log(json)
      if(!json.login){
        setError(true)
        toast.error('Datos incorrectos !!!',{ autoClose:1000 })
      }else{
        //si la cuenta esta inactiva 
        if(json.usuario.estado.toLowerCase() !== 'activo'){
          toast.error('La cuenta esta inactiva !')
          return 

        }
        setError(false)
        Cookies.set('logginRenting', true, { expires: 1 })
        //toast.success('Datos correctos !!!',{ autoClose:2000 })
        contextLogin.setLogin(true)
        contextLogin.setUsuario(json.usuario)
        Cookies.set('userRenting' , JSON.stringify(json.usuario) , { expires: 1 })
        router.push("/calendar")    
      }
    
    })
    .catch(err => console.log(err))

  }

  useEffect(()=>{
    userInput.current.focus()
  },[])


  return (
    <div className="container" style={{marginTop:'100px', maxWidth:'40%'}}>

      <div className="login-box mx-auto my-auto elevation-1">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <a href="" className="h2"><b>AGENDA RENTING</b></a>
          </div>
          <div className="card-body">
            <p className="login-box-msg"><b>INICIO SESION</b> </p>
            <form onSubmit={login} >
              <div className="input-group mb-3">
                <input type="text" ref={userInput} className={`form-control`} autoComplete="off" placeholder="Usuario" name="usuario" onChange={updateData} required/>
                  <div className="input-group-text">
                  <i class="bi bi-person-fill"></i>
                  </div>
              </div>
              <div className="input-group mb-3">
                <input type="password" className={(!error)?`form-control`:'form-control is-invalid'} autoComplete="off" name="password" placeholder="Contraseña" onChange={updateData} required/>
                  <div className="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                  </div>
              </div>
              <div className="row">
                <div className="col d-flex justify-content-end ">
                  <button type="submit" className="btn btn-primary btn-block"><b>Login</b></button>
                </div>
              </div>
            </form>
            <div className="row mt-3 mb-3">
              
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

