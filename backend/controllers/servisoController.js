import {createServicos, readFilterServicos, readAllServicos, updateServicos} from "../models/servisoModel.js"


const createServicosContrroler = async (req, res) => {
    try {
        await createServicos( req.body);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

const updateServicosController = async (req, res) => {
    try{
        await updateServicos (req.body)
        return res.status(200).json({mensagem: "Chamado atualizado com sucesso"})
    } catch (err) {
        console.error("Erro ao atualizar um chamado: ", err)
        return res.status(400).json({mensagem: "Erro ao atualizar um chamado"})
    }
}


const readFilterServicosController = async (req,res) =>{
    try {
        return res.status(200).json( await readFilterServicos(req.body))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};
const readAllServicosController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllServicos()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
};

export default{createServicosContrroler, readFilterServicosController, readAllServicosController, updateServicosController}