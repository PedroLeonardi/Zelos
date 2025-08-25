// routes/especialidadesRoutes.js

import express from "express";
import especialidades from "../controllers/especialidadesController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para ler todas as especialidades
router.get("/get", /*auth,*/ especialidades.readAllEspecialidadesController);

// Rota para filtrar especialidades (ex: por id_tecnico ou id_servicos)
router.post("/getFilter", /*auth,*/ especialidades.readFilterEspecialidadesController);

// Rota para criar uma nova especialidade
router.post("/post", /*auth,*/ especialidades.createEspecialidadeController);

// Rota para deletar uma especialidade pelo ID
router.delete("/delete/:id", /*auth,*/ especialidades.deleteEspecialidadeController);

export default router;