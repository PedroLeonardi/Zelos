import { Router } from 'express';
import apontamentosController from '../controllers/apontamentosController.js'; 

const router = Router();


router.post('/create', apontamentosController.createApontamentoController);
router.post('/getFilter', apontamentosController.readFilterApontamentosController);

export default router;