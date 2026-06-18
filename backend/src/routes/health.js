import { Router } from "express";

const router = Router();

/**
 * Purpose: API Endpoint handler for GET /api/healthz
 * Input: None
 * Output: { status: "ok" }
 * Example: GET /api/healthz -> Responds with 200 OK and JSON { status: "ok" }
 */
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
