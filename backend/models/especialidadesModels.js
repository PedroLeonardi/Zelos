import { readAll, deleteRecord, create } from "../config/database.js";


const readAllEspecialidades = () => {
    try {
        return readAll("especialidades");
    } catch (err) {
        console.error("Erro no model ao ler todas as especialidades: ", err);
        throw err;
    }
};


const readFilterEspecialidades = (filter) => {
    try {
        const whereClause = `${filter.key} = '${filter.value}'`;
        return readAll("especialidades", whereClause);
    } catch (err) {
        console.error("Erro no model ao filtrar especialidades: ", err);
        throw err;
    }
};


const createEspecialidade = (data) => {
    try {
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


const deleteEspecialidade = (id) => {
    try {
        return deleteRecord("especialidades", `id = '${id}'`);
    } catch (err) {
        console.error("Erro no model ao deletar especialidade: ", err);
        throw err;
    }
};

export {readAllEspecialidades,readFilterEspecialidades,createEspecialidade,deleteEspecialidade};