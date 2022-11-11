import {conn2} from '../../../db/kenx.js'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {

                const codigo = req.query.id 
                await conn2
                .select('cardcode', 'cardname')
                .from('v_clientesAgendaRenting')
                .whereLike('cardcode', `%${codigo}%`)
                .limit(10)
                .then((rows)=>{
                    //let lista = rows.map(item => Object.values(item))
                    res.status(200).json({
                        rows : rows,
                        filas:  rows.length
                    });
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))                
                // res.status(200).json({message:' otbtener datos !!! valor -> ' + req.query.id })     
            } catch (error) {
                 res.status(500).json({message:' hubo un error con el metodo get !!! ' +  error})
            }
        case 'PUT':
            try {
                 res.status(200).json({message:' otbtener datos !!! valor => ' + req.query.id})     
            } catch (error) {
                 res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'DELETE':
            try {
                 res.status(200).json({message:' otbtener datos !!! valor => ' + req.query.id })     
            } catch (error) {
                 res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        default:
             res.status(500).json({message:' metodo no valido !!!'})
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