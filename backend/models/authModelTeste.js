import { read, create } from "../config/database.js"

const readUser = async (id) => {
    try {
        const usuario = await read("usuarios", `id_login = '${id}'`)
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
            id_login: data.RA,
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

export {readUser, createUser, readUserEmail}