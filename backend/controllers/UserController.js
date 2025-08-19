import {readAllUser, readUser, readUserEmail,   createUser, updateUser, changeFuncao} from "../models/UserModels.js"


// const createUserContrroler = async (req, res) => {
//     try {
//         await createUser( req.body);
//         return res.status(201).json({mensagem:"Usuario criado com sucesso"});
//     } catch (err) {
//         console.error("Erro ao criar Usuario: ", err);
//         return res.status(400).json({mensagem: "Erro ao criar Usuario"});
//     };
// };

const updateUserController = async (req, res) => {
    
    try { 
        const data = await readUser(req.params.id)

        if (data.length != 0 ){
            try{
                await updateUser (req.body)
                return res.status(200).json({mensagem: "Usuario atualizado com sucesso"})
            } catch (err) {
                console.error("Erro ao atualizar um Usuario: ", err)
                return res.status(400).json({mensagem: "Erro ao atualizar um Usuario"})
            }
        } else {
            return res.status(400).json({mensagem: "Erro ao atualizar um Usuario, usuario não encontrado"})
        }
    } catch (err) {
        console.error("Erro ao atualizar um Usuario: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar um Usuario 2"})
    }
    
    
    
    

}

const changeFuncaoUserController = async (req, res) => {
    try { 
        const data = await readUser(req.params.id)

        if (data.length != 0 ){
            try{
                // console.log(req.body, req.params.id )
                await changeFuncao (req.body, req.params.id )
                return res.status(200).json({mensagem: "funcao Usuario atualizado com sucesso ---"})
            } catch (err) {
                console.error("Erro ao atualizar um Usuario: ", err)
                return res.status(400).json({mensagem: "Erro ao atualizar funcao um Usuario"})
            }
        } else {
            return res.status(400).json({mensagem: "Erro ao atualizar um Usuario, funcao usuario não encontrado"})
        }
    } catch (err) {
        console.error("Erro ao atualizar um Usuario: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar um Usuario funcao 2"})
    }
}


const readFilterUserController = async (req,res) =>{
    try {
        return res.status(200).json( await readUser(req.params.id))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus Usuarios"})
    }
};

const readAllUserController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllUser()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus Usuarios"})
    }
};

export default{changeFuncaoUserController, readFilterUserController, readAllUserController, updateUserController}