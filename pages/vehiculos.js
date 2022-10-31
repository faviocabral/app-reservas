import React, {useState}  from 'react'
import Layout from '../components/Layout'

function vehiculos() {

  const [cars, setCars] = useState(
    [
      {marca: 'kia',
      modelos: [
        {name: 'picanto', img: 'https://www.motorpy.com/images/Automoviles/kia/Picanto/kia1.jpg'},
        {name: 'rio', img: 'https://automotive-api.s3.us-east-2.amazonaws.com/news/8dc8aec9-e319-4ddc-8650-9a1c7eb353ed/BLANCO-SNOW.png'},
        {name: 'sorento', img: 'https://cdn.wheel-size.com/automobile/body/kia-sorento-2020-2023-1643366212.8917227.jpg'},
      ]},
      {marca: 'nissan', 
      modelos: [
        {name: 'kicks', img: 'https://1.bp.blogspot.com/-pGxziPoqNqQ/YDuwSoKh1yI/AAAAAAADdTk/-HvcXTVCEfs7ns4mwRp1snoG1DQXu8IRQCNcBGAsYHQ/w1200-h630-p-k-no-nu/Lanzamiento-Nissan-Kicks-2021-Precios-0km-202100005.jpg'},
        {name:'versa', img: 'https://www.nissan-cdn.net/content/dam/Nissan/ar/vehicles/Versa_MY20/versiones/sense_gris%20plata.png.ximg.l_12_m.smart.png'},
      ]}, 

      {marca: 'chevrolet',
      modelos:[{name: 'tracker' , img: 'https://chevrolet.delasobera.com.py/images/products/tracker/trackerwhite.jpg'},]},

      {marca: 'jeep',
      modelos:[{name: 'compass' , img: 'https://www.jeep.com.py/wp-content/uploads/sites/5/2021/08/modelos_compass.jpg'},]},
    ]
  )


  console.log(cars)

  return (
    <Layout>
      <div>vehiculos</div>
      <div className="d-flex justify-content-around align-content-stretch flex-wrap">
        {
          /*recorremos las marcas */
          cars.map(item=>{
            /* recorremos los modelos */
            return item.modelos.map(item2 => {
              return (
                      <a href="" key={item.modelos.name} >
                        <div className="card elevation-1 mb-3" style={{width: '18rem'}} >
                          <img src={item2.img} className="card-img-top" height={150} width={70} />
                          <div className="card-body">
                            <h5 className="card-title">{item.marca} | {item2.name}</h5>
                            <p className="card-text">Vehiculo para la renta</p>
                          </div>
                        </div>
                      </a>
                  )
            })
          })
        }
      </div>
    </Layout>
  )
}

export default vehiculos