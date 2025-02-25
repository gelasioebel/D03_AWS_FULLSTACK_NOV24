// backend/src/routes/route.ts
import express, { Request, Response, NextFunction } from 'express';
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
router.get('/plantas', (req: Request, res: Response) => getPlantas(req, res));
router.get('/plantas/:id', (req: Request, res: Response) => getPlantaById(req, res));
router.post('/plantas', (req: Request, res: Response) => addPlanta(req, res));
router.put('/plantas/:id', (req: Request, res: Response) => updatePlanta(req, res));
router.delete('/plantas/:id', (req: Request, res: Response) => deletePlanta(req, res));

// Plant types routes
router.get('/tipos-planta', (req: Request, res: Response) => getTiposPlanta(req, res));

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

export default router;