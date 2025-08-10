import {createChamados, readFilterChamados, readAllChamados, updateChamados, respondChamados} from "../models/chamadosModel.js"

const createChamadosContrroler = async (req, res) => {
    try {
        await createChamados( req.body);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

const updateChamadosController = async (req, res) => {
    try{
        await updateChamados (req.body)
        return res.status(200).json({mensagem: "Chamado atualizado com sucesso"})
    } catch (err) {
        console.error("Erro ao atualizar um chamado: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar um chamado"})
    }
}

const respondChamadosController = async (req, res) => {
    try {
        await respondChamados(req.body);
        return res.status(201).json({mensagem:"Status do Chamados alterado"})
    } catch  (err) {
        console.error ("Erro ao atualizar o status de um chamado: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar o status de um chamado"})
    }
}

const readFilterChamadosController = async (req,res) =>{
    try {
        return res.status(200).json( await readFilterChamados(req.body))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};
const readAllChamadosController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllChamados()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
};

export default{createChamadosContrroler, readFilterChamadosController, readAllChamadosController, updateChamadosController}