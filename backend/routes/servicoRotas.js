import express from "express"
import user from "../controllers/servisoController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();

//auth,
//auth,


router.get("/get",  user.readAllServicosController)//fucionando 
router.post("/getFilter", user.readFilterServicosController)//fucionando 
router.post("/post",  user.createServicosContrroler)//fucionando 
router.put("/put",  user.updateServicosController)//fucionando 

export default router




//testa rotas

/*

/getFilter
{
  "key": "data_criacao",
  "firstValue": "2025-01-01",
  "secondValue": "2025-12-31"
}

-----------------------------------

/post
{
  "titulo": "apoio_tecnico",
  "descricao": "Suporte para configuração de impressoras",
  "created_by": 2
}

-----------------------------------

/put
{
  "id": 3,                      
  "titulo": "limpeza",
  "descricao": "Limpeza do corredor limpo",
  "updated_by": 1
}
-----------------------------------
*/