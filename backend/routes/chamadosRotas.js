import express from "express"
import chamados from "../controllers/chamadosController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/get",  chamados.readAllChamadosController)
router.post("/getFilter", chamados.readFilterChamadosController)
router.post("/post", /*auth,*/ chamados.createChamadosContrroler)
router.put("/put/:id", /*auth,*/ chamados.updateChamadosController)
router.put("/respond/:id", /*auth,*/ chamados.respondChamadosController)

export default router