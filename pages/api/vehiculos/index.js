import {conn1} from '../../../db/kenx.js'

export default async function  handler(req , res ){


    switch (req.method) {
        case 'GET':
            try {

                await conn1.select()
                .from('v_agendarenting_vehiculos')
                .then((rows)=>{
                        ///let lista = rows.map(item => Object.values(item)) 
                    return res.status(200).json({
                        rows
                    });
                }) 
                //return res.status(200).json({message:' otbtener datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'POST':
            try {
                const vehiculo = req.body
                await conn1.insert(vehiculo) 
                  .returning('id')
                  .into('agendarenting_vehiculos')
                  .then(async (id)=> {
                    return res.status(200).json({message:' datos insertados correctamente !!!', vehiculo: id })
                  })
                  .catch((err)=>{ return res.status(200).json({message:' hubo un problema !!!', error : err , vehiculo: vehiculo}) })  

                //return res.status(200).json({message:' insertar datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'PUT':
            const vehiculo = req.body
            await conn1('agendarenting_vehiculos')
                .update(vehiculo)
                .where('id', '=' , req.query.id)
                .then(async (id)=> {
                return res.status(200).json({message:' datos modificados correctamente !!!', vehiculo: id })
                })
                .catch((err)=>{ 
                    return res.status(400).json({message:' hubo un problemaaaa !!!', error : err}) 
                })

        default:
            return res.status(500).json({message:' metodo no valido !!!'})
    }

}