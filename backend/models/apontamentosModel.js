import {read, readAll, deleteRecord, create, update} from "../config/database.js"


const createApontamento = (data) => {
    try {
        return create("apontamentos", {
            chamado_id: data.chamado_id,
            tecnico_id: data.tecnico_id,
            descricao: data.descricao,
            comeco: data.comeco,
            fim: data.fim
        });
    } catch (err) {
        console.error("Erro ao Criar Apontamento", err);
        throw err;
    }
};


const readFilterApontamentos = (filter) => {
    try {
        const whereClause = `${filter.key} = '${filter.value}'`;
        return readAll("apontamentos", whereClause);
    } catch (err) {
        console.error("Erro ao ler apontamentos com filtro", err);
        throw err;
    }
};


export {createApontamento, readFilterApontamentos };