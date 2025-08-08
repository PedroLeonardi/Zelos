import {createChamado, readFilterChamado, readAllChamados} from "../models/chamadosModel.js"

const createChamadoContrroler = async (req, res) => {
    try {
        await createChamado( req.body);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

const readFilterChamadoController = async (req,res) =>{
    try {
        return res.status(200).json( await readFilterChamado(req.body))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};
const readAllChamadoController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllChamados()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
};

export default{createChamadoContrroler, readFilterChamadoController, readAllChamadoController}