import express from "express"
import user from "../controllers/relatorioController.js"

const router = express.Router();


router.get("/get",  user.readAllRelatorioController)
router.get("/getFilter", user.readFilterRelatorioController)
router.get("/getFilterBetween", user.readFilterBetweenRelatorioController)



export default router