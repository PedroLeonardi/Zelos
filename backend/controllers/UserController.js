import {createChamado, readMyChamado} from "../models/UserModel.js"

const createChamadoContrroler = async (req, res) => {
    try {
        await createChamado(req.table, req.data);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

const readMyChamadoController = async (req,res) =>{
    try {
        await readMyChamado(req.table, req.filter)
        return res.status(200).json({mensagem:"Meus Chamdos lidos com sucesso"})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
}

export {createChamadoContrroler, readMyChamadoController}