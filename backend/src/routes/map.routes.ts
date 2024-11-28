import { Router } from "express";
import { getMapStatic } from "../services/map.services";

const router = Router();

router.post("/", async (req, res) => {
  getMapStatic(req, res);
});

export default router;
