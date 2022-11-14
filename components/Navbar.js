import React , {useContext} from 'react'
import Link from 'next/link'
import AppContext from '../context/appContex'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'

function Navbar() {


  const router = useRouter()
  const contextLogin = useContext(AppContext)

  const logout = () => {
    contextLogin.setLogin(false)
    Cookies.set('logginRenting', false)
    router.push("/login")
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
            <Link href="/vehiculos">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
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
        </ul>

        <ul className="nav col-12 col-lg-auto my-2 justify-content-end my-md-0 text-small">
          
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