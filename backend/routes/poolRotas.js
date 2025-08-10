import express from "express"
import user from "../controllers/poolController.js"

const router = express.Router();

router.get("/get", user.readAllPoolController)
router.get("/post", user.createPoolContrroler)
router.get("/getFilter", user.readFilterPoolController)
router.put("/put", user.updatePoolController)

export default router