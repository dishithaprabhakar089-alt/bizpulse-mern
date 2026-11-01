import express from 'express';
import { getDashboardSummary, seedDemoData, resetStoreData } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.post('/seed', seedDemoData);
router.post('/reset', resetStoreData);

export default router;
