import {createPool, readFilterPool, readAllPool, updatePool} from "../models/poolModel.js"

const createPoolContrroler = async (req, res) => {
    try {
        await createPool( req.body);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

const updatePoolController = async (req, res) => {
    try{
        await updatePool (req.body)
        return res.status(200).json({mensagem: "Chamado atualizado com sucesso"})
    } catch (err) {
        console.error("Erro ao atualizar um chamado: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar um chamado"})
    }
}


const readFilterPoolController = async (req,res) =>{
    try {
        return res.status(200).json( await readFilterPool(req.body))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};
const readAllPoolController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllPool()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
};

export default{createPoolContrroler, readFilterPoolController, readAllPoolController, updatePoolController}