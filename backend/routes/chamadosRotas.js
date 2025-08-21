import express from "express"
import chamados from "../controllers/chamadosController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();

//auth,
//auth,
router.get("/get",  chamados.readAllChamadosController)
router.get("/getFilter", chamados.readFilterChamadosController)
router.post("/post",  chamados.createChamadosContrroler)
router.put("/put/:id",  chamados.updateChamadosController)
router.put("/put",  chamados.updateChamadosControllerJson)
router.put("/respond/:id", /*auth,*/ chamados.respondChamadosController)

router.put("/atribuir/:id", /*auth,*/ chamados.atribuirChamadosController)

export default router