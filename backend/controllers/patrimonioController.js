import {
    createPatrimonio,
    readAllPatrimonios,
    updatePatrimonio,
    readFilterPatrimonios
} from "../models/patrimonioModel.js";

const createPatrimonioController = async (req, res) => {
    try {
        const novoPatrimonio = req.body;

        if (!novoPatrimonio.n_patrimonio) {
            return res.status(400).json({ mensagem: "O número do patrimônio é obrigatório." });
        }

        const existente = await readFilterPatrimonios({ key: "n_patrimonio", value: novoPatrimonio.n_patrimonio });
        if (existente.length > 0) {
            return res.status(409).json({ mensagem: "Já existe um patrimônio cadastrado com este número." }); 
        }

        await createPatrimonio(novoPatrimonio);
        return res.status(201).json({ mensagem: "Patrimônio criado com sucesso" });

    } catch (err) {
        console.error("Erro no controller ao criar patrimônio: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao criar o patrimônio." });
    }
};


const readAllPatrimoniosController = async (req, res) => {
    try {
        const patrimonios = await readAllPatrimonios();
        return res.status(200).json(patrimonios);
    } catch (err) {
        console.error("Erro no controller ao ler todos os patrimônios: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao buscar os patrimônios." });
    }
};


const updatePatrimonioController = async (req, res) => {
    try {
        const patrimonioId = req.params.id;
        const dadosParaAtualizar = req.body;

        const existente = await readFilterPatrimonios({ key: "id", value: patrimonioId });
        if (existente.length === 0) {
            return res.status(404).json({ mensagem: "Patrimônio não encontrado." }); 
        }

        await updatePatrimonio(dadosParaAtualizar, patrimonioId);
        return res.status(200).json({ mensagem: "Patrimônio atualizado com sucesso." });

    } catch (err) {
        console.error("Erro no controller ao atualizar patrimônio: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao atualizar o patrimônio." });
    }
};


const readFilterPatrimoniosController = async (req, res) => {
    try {
        const filtro = req.body;
        
        if (!filtro || !filtro.key || !filtro.value) {
            return res.status(400).json({ mensagem: "Filtro inválido. Forneça 'key' e 'value'." });
        }

        const patrimonios = await readFilterPatrimonios(filtro);
        return res.status(200).json(patrimonios);
        
    } catch (err) {
        console.error("Erro no controller ao filtrar patrimônios: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao filtrar os patrimônios." });
    }
};

export default {createPatrimonioController,readAllPatrimoniosController,updatePatrimonioController,readFilterPatrimoniosController};