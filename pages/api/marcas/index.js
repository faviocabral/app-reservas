
import {conn1} from '../../../db/kenx.js'

export default async function  handler(req , res ){


    switch (req.method) {
        case 'GET':
            try {

                await conn1.select()
                .from('agendarenting_marcas')
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
                return res.status(200).json({message:' insertar datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        default:
            return res.status(500).json({message:' metodo no valido !!!'})
    }

}