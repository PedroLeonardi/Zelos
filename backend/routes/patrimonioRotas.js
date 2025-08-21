import { Router } from "express";
import patrimonioController from "../controllers/patrimonioController.js";

const router = Router();

// --- Rotas para a entidade Patrimônio ---

// Rota para CRIAR um novo patrimônio
// Ex: POST http://localhost:8080/patrimonio/post
router.post("/post", patrimonioController.createPatrimonioController);

// Rota para LER TODOS os patrimônios
// Ex: GET http://localhost:8080/patrimonio/get
router.get("/get", patrimonioController.readAllPatrimoniosController);

// Rota para ATUALIZAR um patrimônio pelo ID
// Ex: PUT http://localhost:8080/patrimonio/put/123
router.put("/put/:id", patrimonioController.updatePatrimonioController);

// Rota para FILTRAR patrimônios
// Ex: POST http://localhost:8080/patrimonio/getFilter
router.post("/getFilter", patrimonioController.readFilterPatrimoniosController);


export default router;