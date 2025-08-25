import { readUser, createUser, readUserEmail } from "../models/authModelTeste.js";

const readUserController = async (req, res) => {
    try {
        const id = req.id_user;
        const data = await readUser(id); 

        if (!data) {
            return res.status(401).send({ mensagem: "Aluno não encontrado" });
        }

        return res.json(data);
    } catch (err) {
        console.error("Houve um erro ao utilizar o controller user: ", err);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const createUserContr = async (req, res) =>{
    const data = req.body
    try{
        await createUser(data)
        return res.status(200).json({mensagem:"Usuario criado com sucesso"})
        
    } catch (err) {
        console.error("Erro ao criar usuario: ", err)
        throw err
    }
    
}

export default { readUserController, createUserContr };
