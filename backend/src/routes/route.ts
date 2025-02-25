// backend/src/routes/route.ts
import express from 'express';
import {
    getPlantas,
    getPlantaById,
    addPlanta,
    updatePlanta,
    deletePlanta,
    getTiposPlanta
} from '../controller/plantaController';

const router = express.Router();

// Plant routes
router.get('/plantas', getPlantas);
router.get('/plantas/:id', getPlantaById);
router.post('/plantas', addPlanta);
router.put('/plantas/:id', updatePlanta);
router.delete('/plantas/:id', deletePlanta);

// Plant types routes
router.get('/tipos-planta', getTiposPlanta);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

export default router;