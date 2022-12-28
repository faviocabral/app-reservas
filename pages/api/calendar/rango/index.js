import {conn1} from '../../../../db/kenx.js'
import moment from 'moment'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {
                const fechai = req.query.fechai
                const fechaf = req.query.fechaf
                
                await conn1.select()
                .from('v_agendarenting_agendas')
                .where('fechai', '>=', moment(fechai).add(-3, 'M').utc().format('YYYY-MM-DD')) 
                //.andWhere('fechaf', '<=', fechaf)
                .then(async (rows)=>{
                    await conn1.select()
                    .from('v_agendarenting_detalles')
                    .whereIn('id_cab', rows.map(item => item.id))
                    .then(async (rows2)=>{
                        let agenda = rows.map(item=>{
                            return({...item, 
                                
                                    fecha: moment(item.fecha).utc().format('YYYY-MM-DD'),  
                                    fechai: moment(item.fechai).utc().format('YYYY-MM-DD'),
                                    fechaf: (moment(item.fechai).utc().format('YYYY-MM-DD') === moment(item.fechaf).utc().format('YYYY-MM-DD') )? moment(item.fechaf).utc().format('YYYY-MM-DD') : moment(item.fechaf).utc().format('YYYY-MM-DD 12:00') ,
                                    id_agenda: item.id,
                                    det: rows2.filter(item2 => item.id === item2.id_cab ) 
                                    })
                        })
                        res.status(200).json({ agenda })
                    })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))    
                
                
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        default:
            return res.status(405).json({message:' metodo no valido !!!'})
    }

}