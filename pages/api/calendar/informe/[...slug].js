import {conn1} from '../../../../db/kenx.js'
import moment from 'moment'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {
                const { slug } = req.query

                
                const fechai = slug[0]
                const fechaf = slug[1]
                const taller = slug[2] || 0
                await conn1.select()
                .from('v_agendarenting_listado')
                .where('fechai', '>=', fechai)
                .andWhere('fechaf', '<=', fechaf)
                .andWhere('id_taller', (taller == 0 )? '>=' : '=' , taller )
                .then(async (rows)=>{
                    res.status(200).json({ rows })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))                

                
                
                //return res.status(200).json({slug })
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }

        default:
            return res.status(405).json({message:' metodo no valido !!!'})
    }

}