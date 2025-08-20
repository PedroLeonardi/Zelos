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

         create("usuarios", dataUsuario)
         return
    } catch (err){
        console.error("Houve um erro ao criar o usuario: ", err)
        throw err
    }
}

const updateUser = async (data) => {
    try {
        // O identificador agora vem do próprio objeto 'data'
        const id_login = data.id_login;

        // Objeto com os dados que podem ser atualizados
        const conteudo = {
            nome: data.nome,
            email: data.email,
            funcao: data.funcao,
            status: data.status // Incluí o status, pois ele também pode ser editado no modal
        };


        await update("usuarios", conteudo, `id_login = '${id_login}'`);
        
        return "Usuário atualizado com sucesso";

    } catch (err) {
        console.log("Erro na camada de serviço ao atualizar o usuário: ", err);
        // Lança o erro para que o controller possa capturá-lo e enviar uma resposta adequada

        throw err;
    }
};

// const updateUser = async (data, id) => {
//     try {

//         const conteudo  = {
//         nome: data.nome,
//         id_login: data.id_login,
//         email: data.email,
//         funcao: data.funcao
//         }

//         update("usuarios", conteudo, `id_login = ${id}`)
//         return ("Usuario atualizado com sucesso")
//     } catch (err){
//         console.log("Erro ao atualizar usuarios")
//         throw err;
//     }
// }

const changeStatus = async (data, id) => {
    try {

        update("usuarios", {status: data.status} , `id = '${id}'`)
        return ("Usuario atualizado com sucesso")
    } catch (err){
        console.log("Erro ao atualizar usuarios")
        throw err;
    }
}




export {readAllUser, readUser, readUserEmail,   createUser, updateUser, changeStatus}