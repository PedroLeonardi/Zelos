import { readAll, create, update } from "../config/database.js";


const createPatrimonio = (data) => {
    try {
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


const readAllPatrimonios = () => {
    try {
        return readAll("patrimonio");
    } catch (err) {
        console.error("Erro ao ler todos os Patrimônios: ", err);
        throw err;
    }
};


const updatePatrimonio = (data, id) => {
    try {
        const dadosParaAtualizar = {
            categoria: data.categoria,
            descricao: data.descricao,
            aquisicao: data.aquisicao,
            n_patrimonio: data.n_patrimonio
        };

        const whereClause = `id = '${id}'`;

        return update("patrimonio", dadosParaAtualizar, whereClause);
    } catch (err) {
        console.error("Erro ao atualizar Patrimônio: ", err);
        throw err;
    }
};


const readFilterPatrimonios = (filter) => {
    try {
        const whereClause = `${filter.key} = '${filter.value}'`;
        
        return readAll("patrimonio", whereClause);
    } catch (err) {
        console.error("Erro ao filtrar Patrimônios: ", err);
        throw err;
    }
};

export {createPatrimonio,readAllPatrimonios,updatePatrimonio,readFilterPatrimonios
};