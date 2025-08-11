import express from "express"
import chamados from "../controllers/chamadosController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/get",  chamados.readAllChamadosController)
router.get("/getFilter", chamados.readFilterChamadosController)
router.post("/post", auth, chamados.createChamadosContrroler)
router.put("/put", auth, chamados.updateChamadosController)
router.put("/respond", auth, chamados.respondChamadosController)

export default router