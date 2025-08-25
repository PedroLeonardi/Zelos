import express from "express"
import user from "../controllers/UserController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();


router.get("/get",  user.readAllUserController)
router.get("/getFilter/:id", user.readFilterUserController)
router.put("/putFuncao/:id",  user.changeFuncaoUserController)
router.put("/put",  user.updateUserController)
router.put("/putStatus/:id",  user.changeStatusUserController)
router.put("/put/:id",  user.updateUserController)

export default router