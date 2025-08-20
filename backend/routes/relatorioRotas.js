import express from "express"
import user from "../controllers/relatorioController.js"
import auth from "../middlewares/authMiddleware.js"

const router = express.Router();
// auth,

router.get("/get",  user.readAllRelatorioController)
router.post("/getFilter",auth ,user.readFilterRelatorioController)
router.post("/getFilterBetween",auth, user.readFilterBetweenRelatorioController)



export default router