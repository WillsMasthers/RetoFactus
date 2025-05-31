import express from 'express';
import { getCatalogosByTipo } from '../controllers/catalog.controller.js';

const router = express.Router();

// Obtener catálogos por tipo
router.get('/:tipo', getCatalogosByTipo);

export default router;
