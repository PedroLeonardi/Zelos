import express from "express"
import user from "../controllers/servisoController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();




router.get("/get",  user.readAllServicosController)
router.post("/getFilter", user.readFilterServicosController)
router.post("/post",  user.createServicosContrroler)
router.put("/put",  user.updateServicosController)

export default router




