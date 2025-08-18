import {createChamados, readFilterChamados, readAllChamados, updateChamados, respondChamados} from "../models/chamadosModel.js"

const createChamadosContrroler = async (req, res) => {
    try {

        try {
            const data = await readFilterChamados({key:"n_patrimonio", value: req.body.n_patrimonio})

            const encontrado = data.find(item => item.n_patrimonio === req.body.n_patrimonio)
            if (data.length === 0 || encontrado.status != "pendente"){
                console.log("DEU BOM -------------------------------------------------")
                        await createChamados( req.body);
        return res.status(201).json({mensagem:"Chamado criado com sucesso"});
            } else {
                console.log("DEU RUIM -------------------------------------------------")
                return res.status(400).json({mensagem: "Erro ao criar Chamado, chamado com numero de patrimonio já aberto"});
            }
            
        } catch (err) {
            console.log("2-Erro ao criar chamado: ", err )
            return res.status(400).json({mensagem: "Erro ao criar Chamado"});
        }

    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({mensagem: "Erro ao criar Chamado"});
    };
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------
const updateChamadosController = async (req, res) => {
    try{

        const data = await readFilterChamados({key:"id", value: req.params.id})

        const encontrado = data.find(item => item.n_patrimonio === req.body.n_patrimonio)
        if (data.length === 0 || encontrado.status != "concluído"){

        
            try{
                await updateChamados (req.body , req.params.id)
                return res.status(200).json({mensagem: "Chamado atualizado com sucesso"})
            } catch (err) {
                console.error("Erro ao atualizar um chamado: ", err)
                return res.status(400).json({mensagem: "Erro ao atualizar um chamado"})
            }
        } else {
            return res.status(400).json({mensagem: "Erro ao atualizar um chamado"})
        }
} catch (err) {
    
    throw err

}
}

const respondChamadosController = async (req, res) => {

    try {
        const data = await readFilterChamados({key:"id", value: req.params.id})

        const encontrado = data.find(item => item.id === req.params.id)
        if (data.length === 0 || encontrado.status != "concluído"){

            try {
                await respondChamados(req.body);
                return res.status(201).json({mensagem:"Status do Chamados alterado"})
            } catch  (err) {
                console.error ("Erro ao atualizar o status de um chamado: ", err)
                return res.status(400).json({mensagem: "Erro ao atualizar o status de um chamado"})
            }
        } else {
            return res.status(400).json({mensagem: "Erro ao atualizar o status de um chamado"})
        }
} catch (err) {
    throw err
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

export default{createChamadosContrroler, readFilterChamadosController, readAllChamadosController, updateChamadosController, respondChamadosController}