import express from "express"
import user from "../controllers/chamadosController.js"

const router = express.Router();

router.get("/get", user.readAllPoolController)
router.get("/post", user.createPoolContrroler)
router.get("/getFilter", user.readFilterPoolController)

export default router