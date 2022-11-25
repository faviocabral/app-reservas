import {conn1} from '../../../db/kenx.js'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {
                const fecha = req.query.id 
                await conn1.select()
                .from('v_agendarenting_agendas')
                .where('fecha', `2022-11-09`)
                .then(async (rows)=>{
                    await conn1.select()
                    .from('v_agendarenting_detalles')
                    .whereIn('id_cab', rows.map(item => item.id))
                    .then(async (rows2)=>{
                        let agenda = rows.map(item=>{
                            return({...item , det: rows2.filter(item2 => item.id === item2.id_cab ) })
                        })
                        res.status(200).json({ agenda })
                    })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))                


                //return res.status(200).json({message:' otbtener datos !!!'})
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        case 'POST': 
            try { 
                const agenda = req.body 
                await conn1.insert(agenda.cab) 
                  .returning('id') 
                  .into('agendarenting_agenda')  
                  .then(async (idAgenda)=> { 
                    
                    //insertar detalle vehiculos 
                    let detalles = await agenda.det.map(item => { return( {...item, id_cab: idAgenda[0].id } ) } )
                    await conn1.insert(detalles) 
                      .into('agendarenting_detalles') 
                      .then((id2)=> { 
                        // use id here 
                        return res.status(200).json({message:' datos insertados correctamente !!!', detalle: id2}) 
                      })
                      .catch((err)=>{ return res.status(200).json({message:' hubo un problema en el det !!!', error : err}) })

                  }) 
                  .catch((err)=>{ return res.status(400).json({message:' hubo un problema en el cab !!!', error : err}) }) 
                  
                  
                  //return res.status(200).json({message:' insertar datos !!!' , agenda: agenda.cab , vehiculos : agenda.det })
                
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo post !!!' , error: error })
            }
        case 'PUT': 

            try {

                const agenda = req.body 
                if(agenda.tipoEvento === 'cancelar'){
                    agenda.id_estado = 4 //estado cancelado ya no aparece en la agenda.
                }else if(agenda.tipoEvento === 'entregar'){
                    agenda.id_estado = 2 //estado entregado el vehiculo 
                }else if(agenda.tipoEvento === 'recibir'){
                    agenda.id_estado = 3 //estado recibido el vehiculo 
                }

                delete agenda.tipoEvento // no es parte de la tabla 
                
                await conn1('agendarenting_agenda')
                    .update(agenda)
                    .where('id', '=' , req.query.id)
                    .then(async (id)=> {
                    return res.status(200).json({message:' datos modificados correctamente !!!', nro: req.query.id , agenda: agenda })
                    })
                    .catch((err)=>{ return res.status(400).json({message:' hubo un problemaaaa !!!', error : err}) })      
                
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo post !!!' , error: error })                
            }

        default:
            return res.status(405).json({message:' metodo no valido !!!'})
    }

}