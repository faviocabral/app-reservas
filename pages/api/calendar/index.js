import {conn1} from '../../../db/kenx.js'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {
                const fecha = req.query.id 
                await conn1.select()
                .from('v_agendas')
                .where('fecha', `2022-11-09`)
                .then(async (rows)=>{
                    await conn1.select()
                    .from('v_detalles')
                    .whereIn('id_cab', rows.map(item => item.id))
                    .then(async (rows2)=>{
                        let agenda = rows.map(item=>{
                            return({...item , det: rows2.filter(item2 => item.id === item2.id_cab ) })
                        })
                        res.status(200).json({ agenda })
                    })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))                


                return res.status(200).json({message:' otbtener datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'POST':
            try {
                const agenda = req.body
                
                await conn1.insert(agenda.cab)
                  .returning('id')
                  .into('agendarenting_agenda')
                  .then(async (id)=> {
                    
                    //insertar detalle vehiculos 
                    // agenda.det.id_cab = id 
                    agenda.det.forEach(item => item.id_cab = id )
                    await conn1.insert(agenda.det)
                      .into('agendarenting_detalles')
                      .then((id2)=> {
                        // use id here
                        return res.status(200).json({message:' datos insertados correctamente !!!'})
                      });

                  })
                  .catch((err)=>{ return res.status(200).json({message:' hubo un problema !!!', error : err}) })
                  
                  //return res.status(200).json({message:' insertar datos !!!' , agenda: agenda.cab , vehiculos : agenda.det })
                
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo post !!!' , error: error })
            }
        default:
            return res.status(405).json({message:' metodo no valido !!!'})
    }

}