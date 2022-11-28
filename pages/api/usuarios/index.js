import {conn1} from '../../../db/kenx.js'
import moment from 'moment'
import bcrypt from "bcrypt";

export default async function  handler(req , res ){


    switch (req.method) {
        case 'GET':
            try {

                const fecha = req.query.id 
                await conn1.select()
                .from('v_agendarenting_usuarios')
                .then(async (rows)=>{
                    let users = rows.map(item=>{
                        return({
                            id: item.id, 
                            nombre: item.nombre, 
                            user: item.user, 
                            estado: item.estado, 
                            tipo: item.tipo,
                            id_tipo_usuario: item.id_tipo_usuario, 
                            fecha_ins: moment(item.fecha_ins).format('YYYY-MM-DD hh:mm') , 
                            fecha_upd: moment(item.fecha_upd).format('YYYY-MM-DD hh:mm') , 
                            user_ins: item.user_ins , 
                            user_upd: item.user_upd , 
                         })
                    })
                    res.status(200).json({ users })
                })
                .catch(err => res.status(500).json({message: 'hubo un error en la consulta ' + err }))  

                //return res.status(200).json({message:' otbtener datos !!!'})     
            } catch (error) {
                return res.status(500).json({message:' hubo un error con el metodo get !!!'})
            }
            case 'POST':
                try {
    
                    const usuario = req.body
                    const saltRounds = 10
                    usuario.password = bcrypt.hashSync( usuario.password , saltRounds )
    
                    
                    await conn1.insert(usuario) 
                      .returning('id')
                      .into('agendarenting_usuarios')
                      .then(async (id)=> {
                        return res.status(200).json({message:' datos insertados correctamente !!!', usuario: id })
                      })
                      .catch((err)=>{ return res.status(200).json({message:' hubo un problema !!!', error : err , usuario: usuario}) })                  
    
                    //return res.status(200).json({message:' insertar datos !!!' , datos : usuario })
                } catch (error) {
                    return res.status(500).json({message:' hubo un error con el metodo get !!!', error: error})
                }
            case 'PUT':
                try {
    
                    const usuario = req.body
                    //const saltRounds = 10
                    //usuario.password = bcrypt.hashSync( usuario.password , saltRounds )
    
                    if(usuario.password)
                    {
                        const saltRounds = 10
                        usuario.password = bcrypt.hashSync( usuario.password , saltRounds )
                    }
                    await conn1('agendarenting_usuarios')
                        .update(usuario)
                        .where('id', '=' , req.query.id)
                        .then(async (id)=> {
                        return res.status(200).json({message:' datos modificados correctamente !!!', usuario: id })
                        })
                        .catch((err)=>{ return res.status(200).json({message:' hubo un problemaaaa !!!', error : err}) })                  
    
                    //return res.status(200).json({message:' insertar datos !!!' , datos : usuario })
                } catch (error) {
                    return res.status(500).json({message:' hubo un error con el metodo get !!!', error: error})
                }
            default:
            return res.status(500).json({message:' metodo no valido !!!'})
    }

}