import { Router } from "express";
import healthRouter from "./health.js";
import pyqRouter from "./pyq/index.js";

const router = Router();

router.use(healthRouter);
router.use(pyqRouter);

export default router;
