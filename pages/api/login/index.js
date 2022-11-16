import bcrypt from "bcrypt";
import{conn1} from '../../../db/kenx.js'

export default async function  handler(req , res ){
    switch (req.method) {
        case 'POST':
            try {
                const {usuario , password} = req.body
                let datos = {}
                await conn1('v_login')
                    .select()
                    .where('user', usuario)
                    .then( async(rows)=>{
                        const match = await bcrypt.compare(password, rows[0].password)
                        if(match)
                            datos = { nombre : rows[0].nombre, user: rows[0].user , tipo: rows[0].tipo } 

                        res.status(200).json({message:' logging !!!', login : match , usuario: datos })
                    })
                //res.status(200).json({message:' logging !!!', login : req.body })
            break;
            } catch (error) {
                res.status(500).json({message:' hubo un error con el metodo post !!!'})
            }
        default:
            res.status(500).json({message:' metodo no valido !!!'})
    }
}