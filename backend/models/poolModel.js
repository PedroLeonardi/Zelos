import {read, readAll, deleteRecord, create, update} from "../config/database.js"

const readAllPool = () => {
    try {
        return readAll("pool")
    } catch (err) {
        console.error("Erro ao ler todos os pool: ", err )
        throw err
    }
}

const createPool = ( data) => {
    try {
        return create("pool", {
            titulo: data.titulo,
            descricao: data.descricao,
            created_by: data.created_by
        })
    } catch (err) {
        console.error("Erro ao Criar pool", err)
        throw err
    }
};

const updatePool = (data) =>{
    try {
        return update ("pool", {
            titulo: data.titulo,
            descricao: data.descricao,
            update_by: data.created_by
        })
    } catch (err) {
        console.error("Erro ao atualizar pool: ", err)
        throw err
    }
}

const readFilterPool = ( filter) => {
    try {
        const data = `${filter.key} = '${filter.value}'`
        
        return read ("pool", data)
    } catch (err) {
        console.error("Erro ao ler meus pool", err)
        throw err
    }
};

export {createPool, readFilterPool, readAllPool, updatePool};