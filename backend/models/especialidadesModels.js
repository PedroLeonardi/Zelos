// models/especialidadesModel.js

import { readAll, deleteRecord, create } from "../config/database.js";

/**
 * Lê todas as especialidades da tabela.
 */
const readAllEspecialidades = () => {
    try {
        return readAll("especialidades");
    } catch (err) {
        console.error("Erro no model ao ler todas as especialidades: ", err);
        throw err;
    }
};

/**
 * Filtra especialidades com base em uma chave e valor (ex: por id_tecnico).
 * @param {{key: string, value: string|number}} filter - O objeto de filtro.
 */
const readFilterEspecialidades = (filter) => {
    try {
        const whereClause = `${filter.key} = '${filter.value}'`;
        return readAll("especialidades", whereClause);
    } catch (err) {
        console.error("Erro no model ao filtrar especialidades: ", err);
        throw err;
    }
};

/**
 * Cria uma nova associação entre um técnico e um serviço.
 * @param {{id_servicos: number, id_tecnico: number}} data - Os dados para a nova especialidade.
 */
const createEspecialidade = (data) => {
    try {
        // Validação para garantir que os campos necessários foram fornecidos
        if (!data.id_servicos || !data.id_tecnico) {
            throw new Error("id_servicos e id_tecnico são obrigatórios.");
        }
        return create("especialidades", {
            id_servicos: data.id_servicos,
            id_tecnico: data.id_tecnico
        });
    } catch (err) {
        console.error("Erro no model ao criar especialidade: ", err);
        throw err;
    }
};

/**
 * Deleta uma especialidade pelo seu ID.
 * @param {number} id - O ID da especialidade a ser deletada.
 */
const deleteEspecialidade = (id) => {
    try {
        return deleteRecord("especialidades", `id = '${id}'`);
    } catch (err) {
        console.error("Erro no model ao deletar especialidade: ", err);
        throw err;
    }
};

export {
    readAllEspecialidades,
    readFilterEspecialidades,
    createEspecialidade,
    deleteEspecialidade
};