import {
    createEspecialidade,
    readAllEspecialidades,
    readFilterEspecialidades,
    deleteEspecialidade
} from "../models/especialidadesModels.js";

const createEspecialidadeController = async (req, res) => {
    const { id_servicos, id_tecnico } = req.body;

    try {
        const especialidadesTecnico = await readFilterEspecialidades({ key: "id_tecnico", value: id_tecnico });
        const jaExiste = especialidadesTecnico.some(esp => esp.id_servicos == id_servicos);

        if (jaExiste) {
            return res.status(409).json({ mensagem: "Este técnico já possui essa especialidade." }); 
        }

        await createEspecialidade({ id_servicos, id_tecnico });
        return res.status(201).json({ mensagem: "Especialidade cadastrada com sucesso." });

    } catch (err) {
        console.error("Erro no controller ao criar especialidade: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao cadastrar especialidade." });
    }
};

const readAllEspecialidadesController = async (req, res) => {
    try {
        const especialidades = await readAllEspecialidades();
        return res.status(200).json(especialidades);
    } catch (err) {
        console.error("Erro no controller ao ler todas as especialidades: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao buscar especialidades." });
    }
};

const readFilterEspecialidadesController = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key || !value) {
            return res.status(400).json({ mensagem: "'key' e 'value' são obrigatórios para filtrar." });
        }
        const especialidades = await readFilterEspecialidades({ key, value });
        return res.status(200).json(especialidades);
    } catch (err) {
        console.error("Erro no controller ao filtrar especialidades: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao filtrar especialidades." });
    }
};

const deleteEspecialidadeController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultado = await readFilterEspecialidades({ key: "id", value: id });
        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Especialidade não encontrada." }); 
        }

        await deleteEspecialidade(id);
        return res.status(200).json({ mensagem: "Especialidade removida com sucesso." });

    } catch (err) {
        console.error("Erro no controller ao deletar especialidade: ", err);
        return res.status(500).json({ mensagem: "Erro interno ao remover especialidade." });
    }
};

export default {
    createEspecialidadeController,
    readAllEspecialidadesController,
    readFilterEspecialidadesController,
    deleteEspecialidadeController
};