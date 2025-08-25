import { Router } from "express";
import patrimonioController from "../controllers/patrimonioController.js";

const router = Router();


router.post("/post", patrimonioController.createPatrimonioController);

router.get("/get", patrimonioController.readAllPatrimoniosController);

router.put("/put/:id", patrimonioController.updatePatrimonioController);

router.post("/getFilter", patrimonioController.readFilterPatrimoniosController);

export default router;