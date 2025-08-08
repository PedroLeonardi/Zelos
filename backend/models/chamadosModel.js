import {read, readAll, deleteRecord, create, update} from "../config/database.js"

const readAllChamados = () => {
    try {
        return readAll("pool")
    } catch (err) {
        console.error("Erro ao ler todos os chamados: ", err )
        throw err
    }
}

const createChamado = ( data) => {
    try {
        return create("pool", {
            titulo: data.titulo,
            descricao: data.descricao,
            created_by: data.created_by
        })
    } catch (err) {
        console.error("Erro ao Criar Chamado", err)
        throw err
    }
};

const readFilterChamado = ( filter) => {
    try {
        const data = `${filter.key} = '${filter.value}'`
        
        return read ("pool", data)
    } catch (err) {
        console.error("Erro ao ler meus chamados", err)
        throw err
    }
};

export {createChamado, readFilterChamado, readAllChamados};