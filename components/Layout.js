import React, {useEffect} from 'react'
import Navbar from './Navbar'

export default function Layout({children}) {
  return (
    <>
        <Navbar />
        <div className="container-fluid">
            {children }
        </div>
    </>
  )
}
