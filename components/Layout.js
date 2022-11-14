import React, {useEffect , useContext} from 'react'
import Navbar from './Navbar'
import AppContext from '../context/appContex'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'

export default function Layout({children}) {

  const router = useRouter()
  const contextLogin = useContext(AppContext)

  useEffect(()=>{
    if(contextLogin.login === false) {

      if(Cookies.get('logginRenting') == 'false' || Cookies.get('logginRenting') === undefined ){
        router.push("/login")
      }else{
        contextLogin.setLogin(true)
      }
    }    
  },[])

  return (
    <>
      {
        contextLogin.login
        ?(
          <>
            <Navbar />
            <div className="container-fluid">
                {children }
            </div>          
          </>
          )
        :(<span></span>)
      }
    </>
  )
}
