import { readFilterRelatorio, readAllRelatorio, readFilterBetweenRelatorio} from "../models/relatorioModel.js"



const readFilterRelatorioController = async (req,res) =>{
    try {
        return res.status(200).json( {mensagem: await readFilterRelatorio(req.body)})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};

const readFilterBetweenRelatorioController = async (req,res) =>{
    try {

        return res.status(200).json({mensagem: await readFilterRelatorio(req.body)})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
        
};

const readAllRelatorioController = async (req,res) =>{
    try {
        
        return res.status(200).json({mensagem:await readAllRelatorio()})
    } catch (err) {
        console.error("Erro ao Ler meus Chamdos: ", err)
        return res.status(400).json({mensagem:"Erro ao ler meus chamados"})
    }
};



export default{readFilterRelatorioController, readAllRelatorioController, readFilterBetweenRelatorioController}