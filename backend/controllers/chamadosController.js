import { createChamados, readFilterChamados, readAllChamados, updateChamados, updateChamados2, respondChamados, atribuirChamados } from "../models/chamadosModel.js"

const createChamadosContrroler = async (req, res) => {
    try {

        try {
            const data = await readFilterChamados({ key: "patrimonio_id", value: req.body.patrimonio_id })
            const encontrados = data.filter(item => item.patrimonio_id == req.body.patrimonio_id)
            console.log("ENCONTRADO ----------------------", encontrados)
            if (encontrados.length === 0 || !encontrados.some(item => item.status === "pendente")) {
                console.log("DEU BOM -------------------------------------------------")
                await createChamados(req.body);
                return res.status(201).json({ mensagem: "Chamado criado com sucesso" });
            } else {
                console.log("DEU RUIM -------------------------------------------------")
                return res.status(400).json({ mensagem: "Erro ao criar Chamado, chamado com numero de patrimonio já aberto" });
            }

        } catch (err) {
            console.log("2-Erro ao criar chamado: ", err)
            return res.status(400).json({ mensagem: "Erro ao criar Chamado" });
        }

    } catch (err) {
        console.error("Erro ao criar chamado: ", err);
        return res.status(400).json({ mensagem: "Erro ao criar Chamado" });
    };
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------
const updateChamadosController = async (req, res) => {
    try {

        const data = await readFilterChamados({ key: "id", value: req.params.id })
        console.log("req.body.patrimonio_id:", req.body.patrimonio_id);
        console.log("data retornada:", data);

        const encontrado = data.find(item => Number(item.id) === Number(req.params.id));
        console.log("encontrado:", encontrado);
        if (data.length === 0 || encontrado.status != "concluído") {


            try {
                await updateChamados(req.body, req.params.id)
                return res.status(200).json({ mensagem: "Chamado atualizado com sucesso" })
            } catch (err) {
                console.error("Erro ao atualizar um chamado: ", err)
                return res.status(400).json({ mensagem: "Erro ao atualizar um chamado" })
            }
        } else {
            return res.status(400).json({ mensagem: "Erro ao atualizar um chamado" })
        }
    } catch (err) {

        throw err

    }
}


const updateChamadosControllerJson = async (req, res) => {
    try {
        const chamadoData = req.body;
        console.log(chamadoData)
        // Validação: Garante que o ID foi enviado no corpo da requisição.
        if (!chamadoData || !chamadoData.id) {
            return res.status(400).json({ mensagem: "O 'id' do chamado é obrigatório no corpo da requisição." });
        }

        const chamadoExistente = await readFilterChamados({ key: "id", value: chamadoData.id });

        if (chamadoExistente.length === 0) {
            return res.status(404).json({ mensagem: "Chamado não encontrado." });
        }
        
        await updateChamados2(chamadoData);
        
        return res.status(200).json({ mensagem: "Chamado atualizado com sucesso" });

    } catch (err) {
        console.error("Erro no controller ao atualizar chamado: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao atualizar o chamado." });
    }
};






const readFilterChamadosController = async (req, res) => {
    try {
        return res.status(200).json(await readFilterChamados(req.body))
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({ mensagem: "Erro ao ler meus chamados" })
    }
    
};
const readAllChamadosController = async (req, res) => {
    try {
        
        return res.status(200).json(await readAllChamados())
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({ mensagem: "Erro ao ler meus chamados" })
    }
};


const atribuirChamadosController = async (req, res) => {
    
    try {
        const data = await readFilterChamados({ key: "id", value: req.body.chamado_id })
        if (data.length === 0 || data.status != "concluído") {

            try {
                await atribuirChamados(req.body, req.params.id);
                return res.status(201).json({ mensagem: "Status do Chamados alterado" })
            } catch (err) {
                console.error("Erro ao atualizar o status de um chamado: ", err)
                return res.status(400).json({ mensagem: "Erro ao atualizar o status de um chamado" })
            }
        } else {
            return res.status(400).json({ mensagem: "Erro ao atualizar o status de um chamado" })
        }
    } catch (err) {
        throw err
    }
}

const respondChamadosController = async (req, res) => {

    try {
        const data = await readFilterChamados({ key: "id", value: req.params.id })
        if (data.length === 0 || data.status != "concluído") {

            try {
                await respondChamados(req.body, req.params.id);
                return res.status(201).json({ mensagem: "Status do Chamados alterado" })
            } catch (err) {
                console.error("Erro ao atualizar o status de um chamado: ", err)
                return res.status(400).json({ mensagem: "Erro ao atualizar o status de um chamado" })
            }
        } else {
            return res.status(400).json({ mensagem: "Erro ao atualizar o status de um chamado" })
        }
    } catch (err) {
        throw err
    }
}

// const readFilterChamadosController = async (req, res) => {
//     try {
//         return res.status(200).json(await readFilterChamados(req.body))
//     } catch (err) {
//         console.error("Erro ao Ler meus Chamdos: ", err)
//         return res.status(400).json({ mensagem: "Erro ao ler meus chamados" })
//     }

// };
// const readAllChamadosController = async (req, res) => {
//     try {

//         return res.status(200).json(await readAllChamados())
//     } catch (err) {
//         console.error("Erro ao Ler meus Chamdos: ", err)
//         return res.status(400).json({ mensagem: "Erro ao ler meus chamados" })
//     }
// };

export default{createChamadosContrroler, atribuirChamadosController, readFilterChamadosController, readAllChamadosController, updateChamadosController, respondChamadosController,updateChamadosControllerJson}

