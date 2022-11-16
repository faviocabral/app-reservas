import { useState , useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContext from '../context/appContex';
import Cookies from 'js-cookie'

function MyApp({ Component, pageProps }) {

  const [usuario, setUsuario] = useState({})
  const [login, setLogin] = useState(false)
  const [auth, setAuth] = useState(false)

  return (
    <AppContext.Provider value={{usuario , setUsuario , login , setLogin , auth , setAuth }}>
      <Component {...pageProps} />
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </AppContext.Provider>
  )
}

export default MyApp
