import { readUser, createUser } from "../models/authModelTeste.js";

const readUserController = async (req, res) => {
    try {
        const email = req.body.email;

        const data = await readUser(email); 

        if (!data) {
            return res.status(401).send({ mensagem: "Aluno não encontrado" });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error("Houve um erro ao utilizar o controller user: ", err);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const createUserContr = async (teste) =>{
    const data = teste
    try{
        await createUser(data)
        // return res.status(200).json({mensagem:"Usuario criado com sucesso"})
        return 
    } catch (err) {
        console.error("Erro ao criar usuario: ", err)
        throw err
    }
    
}

export default { readUserController, createUserContr };
