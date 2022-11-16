import {conn1} from '../../../db/kenx.js'
import moment from 'moment'

export default async function  handler(req , res ){


    switch (req.method) {
        case 'GET':
            try {
                const fecha = req.query.id 
                await conn1.select()
                .from('agendarenting_tipo_usuarios')
                .then(async (rows)=>{
                    let tipos = rows.map(item=>{
                        return({
                            id: item.id, 
                            nombre: item.nombre, 
                         })
                    })
                    res.status(200).json({ tipos })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err })) 

                //return res.status(200).json({message:' otbtener datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'POST':
            try {
                return res.status(200).json({message:' insertar datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        default:
            return res.status(500).json({message:' metodo no valido !!!'})
    }
/*
    //await conn('datos_profesiones_insert')
    try {
        await knex('agendarenting_talleres')
        .select()
        .then((rows)=>{
                ///let lista = rows.map(item => Object.values(item))
            res.status(200).json({
                rows
            });
        })
            
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
*/

}