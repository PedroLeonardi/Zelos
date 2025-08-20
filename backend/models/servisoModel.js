import {read, readAll, deleteRecord, create, update} from "../config/database.js"

const readAllServicos = () => {
    try {
        return readAll("servicos")
    } catch (err) {
        console.error("Erro ao ler todos os pool: ", err )
        throw err
    }
}

const createServicos = ( data) => {
    try {
        return create("servicos", {
            titulo: data.titulo,
            descricao: data.descricao,
            created_by: data.created_by
        })
    } catch (err) {
        console.error("Erro ao Criar servicos", err)
        throw err
    }
};

const updateServicos = (data) =>{
    try {
        return update ("servicos", {
            titulo: data.titulo,
            descricao: data.descricao,
            updated_by: data.updated_by
        }, `id = '${data.id}'`)
    } catch (err) {
        console.error("Erro ao atualizar servicos: ", err)
        throw err
    }
}

const readFilterServicos = ( filter) => {
    try {
        const data = `${filter.key} = '${filter.value}'`
        
        return read ("servicos", data)
    } catch (err) {
        console.error("Erro ao ler meus servicos", err)
        throw err
    }
};

export {createServicos, readFilterServicos, readAllServicos, updateServicos};