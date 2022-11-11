import {conn1} from '../../../../db/kenx.js'

export default async function  handler(req , res ){

    switch (req.method) {
        case 'GET':
            try {
                const fecha = req.query.fecha 
                await conn1.select()
                .from('v_asignadosxfecha')
                .where('fechaf','>', fecha)
                .andWhere('fechai','<=', fecha)
                .orWhere({
                    fechai : fecha , 
                    fechaf: fecha 
                })
                .then(async (rows)=>{
                    res.status(200).json({ rows })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))                

            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
        default:
            return res.status(405).json({message:' metodo no valido !!!'})
    }

}