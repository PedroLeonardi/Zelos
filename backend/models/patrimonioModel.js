import { readAll, create, update } from "../config/database.js";

/**
 * Cria um novo registro na tabela de patrimônio.
 * @param {object} data - Contém os dados do patrimônio a ser criado.
 * @returns {Promise<any>} O resultado da operação de criação no banco de dados.
 */
const createPatrimonio = (data) => {
    try {
        // A coluna `id` é gerada automaticamente pelo banco de dados.
        return create("patrimonio", {
            categoria: data.categoria,
            descricao: data.descricao,
            aquisicao: data.aquisicao,
            n_patrimonio: data.n_patrimonio
        });
    } catch (err) {
        console.error("Erro ao criar Patrimônio: ", err);
        throw err;
    }
};

/**
 * Lê todos os registros da tabela de patrimônio.
 * @returns {Promise<any>} Uma lista com todos os patrimônios.
 */
const readAllPatrimonios = () => {
    try {
        return readAll("patrimonio");
    } catch (err) {
        console.error("Erro ao ler todos os Patrimônios: ", err);
        throw err;
    }
};

/**
 * Atualiza um registro de patrimônio existente com base no ID.
 * @param {object} data - Os novos dados para o patrimônio.
 * @param {string|number} id - O ID do patrimônio a ser atualizado.
 * @returns {Promise<any>} O resultado da operação de atualização.
 */
const updatePatrimonio = (data, id) => {
    try {
        // Define quais campos podem ser atualizados.
        const dadosParaAtualizar = {
            categoria: data.categoria,
            descricao: data.descricao,
            aquisicao: data.aquisicao,
            n_patrimonio: data.n_patrimonio
        };

        // Constrói a cláusula WHERE para garantir que apenas o registro correto seja atualizado.
        const whereClause = `id = '${id}'`;

        return update("patrimonio", dadosParaAtualizar, whereClause);
    } catch (err) {
        console.error("Erro ao atualizar Patrimônio: ", err);
        throw err;
    }
};

/**
 * Lê todos os patrimônios que correspondem a um filtro específico.
 * @param {object} filter - Um objeto com `key` e `value` para a cláusula WHERE.
 * Ex: { key: "n_patrimonio", value: "12345" }
 * @returns {Promise<any>} Uma lista com os patrimônios filtrados.
 */
const readFilterPatrimonios = (filter) => {
    try {
        const whereClause = `${filter.key} = '${filter.value}'`;
        
        return readAll("patrimonio", whereClause);
    } catch (err) {
        console.error("Erro ao filtrar Patrimônios: ", err);
        throw err;
    }
};

// Exporta todas as funções para serem usadas nos controllers.
export {
    createPatrimonio,
    readAllPatrimonios,
    updatePatrimonio,
    readFilterPatrimonios
};