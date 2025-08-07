import express from "express"
import user from "../controllers/UserController.js"

const router = express.Router();

router.get("/get", user.createChamadoContrroler)

export default router