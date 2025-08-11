import express from "express"
import user from "../controllers/poolController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();


router.get("/get",  user.readAllPoolController)
router.get("/getFilter", user.readFilterPoolController)
router.post("/post", auth, user.createPoolContrroler)
router.put("/put", auth, user.updatePoolController)

export default router