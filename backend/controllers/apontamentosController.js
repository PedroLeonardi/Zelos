
import { createApontamento, readFilterApontamentos } from "../models/apontamentosModel.js";

const createApontamentoController = async (req, res) => {
    try {
        const { chamado_id, tecnico_id, comeco, fim } = req.body;
        console.log(req.body)
        if (!chamado_id || !tecnico_id || !comeco || !fim) {
            return res.status(400).json({ mensagem: "Campos obrigatórios (chamado_id, tecnico_id, comeco, fim) não foram fornecidos." });
        }

        await createApontamento(req.body);

        return res.status(201).json({ mensagem: "Apontamento criado com sucesso" });

    } catch (err) {
        console.error("Erro no controller ao criar apontamento: ", err);
        return res.status(400).json({ mensagem: "Erro ao criar o apontamento" });
    }
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------

const readFilterApontamentosController = async (req, res) => {
    try {
        if (!req.body || !req.body.key || !req.body.value) {
            return res.status(400).json({ mensagem: "Filtro inválido. Forneça 'key' e 'value'." });
        }

        const apontamentos = await readFilterApontamentos(req.body);
        
        return res.status(200).json(apontamentos);

    } catch (err) {
        console.error("Erro no controller ao filtrar apontamentos: ", err);
        return res.status(400).json({ mensagem: "Erro ao buscar os apontamentos" });
    }
};

export default { createApontamentoController, readFilterApontamentosController };