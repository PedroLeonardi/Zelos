import {read, readAll, deleteRecord, create, update} from "../config/database.js"

const readAllChamados = () => {
    try {
        return readAll("chamados")
    } catch (err) {
        console.error("Erro ao ler todos os chamados: ", err )
        throw err
    }
}

const createChamados = ( data) => {
    try {
        return create("chamados", {
            titulo: data.titulo,
            descricao: data.descricao,
            tipo_id: data.tipo_id,
            tecnico_id: data.tecnico_id,
            usuario_id: data.usuario_id
        })
    } catch (err) {
        console.error("Erro ao Criar Chamado", err)
        throw err
    }
};

const updateChamados = (data) =>{
    try {
        return update ("chamados", {
            titulo: data.titulo,
            descricao: data.descricao,
            tipo_id: data.tipo_id,
            tecnico_id: data.tecnico_id,
            usuario_id: data.usuario_id
        })
    } catch (err) {
        console.error("Erro ao atualizar Chamado: ", err)
        throw err
    }
}

const respondChamados = (data) => {
    try {
        return update ("chamados", {
            status: data.status
        })
    } catch (err) {
        console.error("Erro ao alterar o status Chamados: ", err)
        throw err;
    }
}

const readFilterChamados = ( filter) => {
    try {
        const data = `${filter.key} = '${filter.value}'`
        
        return read ("chamados", data)
    } catch (err) {
        console.error("Erro ao ler meus chamados", err)
        throw err
    }
};

export default {createChamados, readFilterChamados, readAllChamados, updateChamados, respondChamados};