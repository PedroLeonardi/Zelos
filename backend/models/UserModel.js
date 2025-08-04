import {read, readAll, deleteRecord, create, update} from "../config/database.js"

const readAllChamados = (table) => {
    try {
        return readAll(table)
    } catch (err) {
        console.error("Erro ao ler todos os chamados: ", err )
        throw err
    }
}

const createChamado = (table, data) => {
    try {
        return create(table, data)
    } catch (err) {
        console.error("Erro ao Criar Chamado", err)
        throw err
    }
};

const readMyChamado = (table, filter) => {
    try {
        return read = (table, filter)
    } catch (err) {
        console.error("Erro ao ler meus chamados", err)
        throw err
    }
};

export {createChamado, readMyChamado, readAllChamados};