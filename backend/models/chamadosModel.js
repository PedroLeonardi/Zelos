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
        let tecnico_id1
        if (!data.tecnico_id){
            tecnico_id1 = null
        } else {
            tecnico_id1 = data.tecnico_id
        }

        return create("chamados", {
            titulo: data.titulo,
            descricao: data.descricao,
            patrimonio_id: data.patrimonio_id,
            servicos_id: data.servicos_id,
            tecnico_id: tecnico_id1,
            usuario_id: data.usuario_id
        })

    } catch (err) {
        console.error("Erro ao Criar Chamado", err)
        throw err
    }
};

const updateChamados = (data) => {
    try {
        const id = data.id;

        // CORREÇÃO: Aplicado o operador '?? null' a todos os campos que podem ser nulos ou undefined
        const dadosParaAtualizar = {
            titulo: data.titulo,
            descricao: data.descricao ?? null,
            patrimonio_id: data.patrimonio_id ?? null,
            servicos_id: data.servicos_id, // Este é NOT NULL, deve sempre existir
            tecnico_id: data.tecnico_id ?? null,
            status: data.status
        };

        return update("chamados", dadosParaAtualizar, `id = '${id}'`);
    } catch (err) {
        console.error("Erro ao atualizar Chamado: ", err);
        throw err;
    }
};

const updateChamados2 = (data) => {
    try {
        const id = data.id;

        // CORREÇÃO: Aplicado o operador '?? null' a todos os campos que podem ser nulos ou undefined
        const dadosParaAtualizar = {
            status: data.status
        };

        return update("chamados", dadosParaAtualizar, `id = '${id}'`);
    } catch (err) {
        console.error("Erro ao atualizar Chamado: ", err);
        throw err;
    }
};

const updateChamadosJson = (data, id) => {
    try {
        // Objeto com os dados a serem atualizados.
        // O operador '??' (nullish coalescing) garante que se o valor for undefined ou null,
        // ele enviará 'null' para o banco de dados, evitando o erro.
        const dadosParaAtualizar = {
            titulo: data.titulo,
            descricao: data.descricao,
            patrimonio_id: data.patrimonio_id ?? null,
            servicos_id: data.servicos_id,
            tecnico_id: data.tecnico_id ?? null,
            status: data.status
        };

        return update("chamados", dadosParaAtualizar, `id = '${id}'`);
    } catch (err) {
        console.error("Erro ao atualizar Chamado: ", err);
        throw err;
    }
};




const respondChamados = (data, id) => {
    try {
    
        return update("chamados", {
            status: data.status
        }, `id = '${data.chamado_id}'`); 
    } catch (err) {
        console.error("Erro ao alterar o status do Chamado: ", err); 
        throw err;
    }
}

// 📍 CORREÇÃO APLICADA
// A lógica estava certa, mas a mensagem de erro foi melhorada para clareza.
const atribuirChamados = (data, id) => {
    try {
        // A lógica aqui estava correta:
        // - `id` (do técnico) é o valor a ser inserido.
        // - `data.chamado_id` é usado para encontrar o chamado a ser atualizado.
        return update("chamados", {
            tecnico_id: id
        }, `id = '${data.chamado_id}'`);
    } catch (err) {
        console.error("Erro ao atribuir o Chamado: ", err); // 👈 MENSAGEM CORRIGIDA
        throw err;
    }
}

const readFilterChamados = ( filter) => {
    try {
        const data = `${filter.key} = '${filter.value}'`
        
        return readAll ("chamados", data)
    } catch (err) {
        console.error("Erro ao ler meus chamados", err)
        throw err
    }
};

export {atribuirChamados, createChamados, readFilterChamados, readAllChamados, updateChamados,updateChamados2, respondChamados,updateChamadosJson};