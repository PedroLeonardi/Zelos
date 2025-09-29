import {read, readAll, deleteRecord, create, update} from "../config/database.js"


const readAllUser = async (id) => {
    try {
        const usuario = await readAll("usuarios")
        if (!usuario) {
            return 'ERRO ao consultar'
        }
        return usuario

    } catch (err) {
        console.error("Erro ao consultar o usuario ao sistema, erro: ", err)
        throw err
    }
}

const readUser = async (id) => {
    try {
        const usuario = await read("usuarios", `id = '${id}'`)
        if (!usuario) {
            return 'ERRO ao consultar'
        }
        return usuario

    } catch (err) {
        console.error("Erro ao consultar o usuario ao sistema, erro: ", err)
        throw err
    }
}

const readUserEmail = async (email) => {
    try {
        const usuario = await read("usuarios", `emai = '${email}'`)
        if (!usuario) {
            return 'ERRO ao consultar'
        }
        return usuario

    } catch (err) {
        console.error("Erro ao consultar o usuario ao sistema, erro: ", err)
        throw err
    }
}


const createUser = async (data) =>{
    try {
        const dataUsuario = {
            nome: data.nome,
            id_login: data.id_login,
            email: data.email,
            funcao: data.funcao
        }

        await create("usuarios", dataUsuario) 
        return
    } catch (err){
        if (err && err.code === 'ER_DUP_ENTRY') {
            console.log(`[AVISO] Tentativa de inserir o ID ${data.id_login}, que já existe. Prosseguindo.`);
            return; 
        }

        console.error("Houve um erro ao criar o usuario: ", err)
        throw err
    }
}

const updateUser = async (data) => {
    try {
        const id_login = data.id_login;

        const conteudo = {
            nome: data.nome,
            email: data.email,
            funcao: data.funcao,
            status: data.status 
        };


        await update("usuarios", conteudo, `id_login = '${id_login}'`);
        
        return "Usuário atualizado com sucesso";

    } catch (err) {
        console.log("Erro na camada de serviço ao atualizar o usuário: ", err);

        throw err;
    }
};



const changeStatus = async (data, id) => {
    try {

        update("usuarios", {status: data.status} , `id = '${id}'`)
        return ("Usuario atualizado com sucesso")
    } catch (err){
        console.log("Erro ao atualizar usuarios")
        throw err;
    }
}

const changeFuncao = async (data, id) => {
    try {

        update("usuarios", {funcao: data.funcao} , `id = '${id}'`)
        return ("Usuario atualizado com sucesso")
    } catch (err){
        console.log("Erro ao atualizar usuarios")
        throw err;
    }
}



export {readAllUser, readUser, readUserEmail,   createUser, updateUser, changeStatus, changeFuncao}