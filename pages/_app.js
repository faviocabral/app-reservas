import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContext from '../context/appContex';

function MyApp({ Component, pageProps }) {

  const [usuario, setUsuario] = useState()

  return (
    <AppContext.Provider value={{usuario , setUsuario }}>
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
