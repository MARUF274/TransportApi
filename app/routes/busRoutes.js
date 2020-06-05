import express from 'express';

import { addBusDetails, getAllBuses} from '../controllers/busControllers';
import verifyAuth from '../middlewares/verifyAuth'

const router = express.Router();

//Buses routes
router.post('/buses', verifyAuth, addBusDetails);
router.get('/buses', verifyAuth, getAllBuses);

export default router;