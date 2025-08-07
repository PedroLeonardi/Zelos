import express from "express"
import teste from "../controllers/authControllerTeste.js"

const router = express.Router()

router.get("/get", teste.readUserController)
// router.post("/post", teste.createUser)

export default router; 