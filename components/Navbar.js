import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (

  <div className=" text-bg-dark cab mb-2">
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
  
          <li>
            <Link href="/Calendar">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
                <i className="bi bi-calendar-date d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Calendario</span>
              </a>
            </Link>
          </li>

          <li>
            <Link href="/Vehiculos">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
                <i className="bi bi-car-front d-block mx-auto text-center text-white" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Vehiculos</span>
              </a>
            </Link>
          </li>
  
          <li>
            <Link href="/Informes">
              <a href="#" className="nav-link text-secondary pt-0 pb-1">
                <i className="bi bi-easel3 d-block mx-auto text-center text-white elevation-1" style={{ fontSize: 30, height: "40px" }} ></i>
                <span className="text-white">Informes</span>
              </a>
            </Link>
          </li>
  
        </ul>
      </div>
    </div>
  </div>


  )
}

export default Navbar