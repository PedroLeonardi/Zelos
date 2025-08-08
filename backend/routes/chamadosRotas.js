import express from "express"
import user from "../controllers/chamadosController.js"

const router = express.Router();

router.get("/get", user.readAllChamadoController)
router.get("/post", user.createChamadoContrroler)
router.get("/getFilter", user.readFilterChamadoController)

export default router