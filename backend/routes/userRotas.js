import express from "express"
import user from "../controllers/UserController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();


router.get("/get",  user.readAllUserController)//fucionando 
router.get("/getFilter/:id", user.readFilterUserController)//fucionando 
router.put("/putFuncao/:id",  user.changeFuncaoUserController)//fucionando 
router.put("/put/:id",  user.updateUserController)//fucionando 

export default router