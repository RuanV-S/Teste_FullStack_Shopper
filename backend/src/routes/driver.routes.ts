import { Router } from "express";
import { getDrivers } from "../controllers/driver.controller";
const router = Router();

router.get("/", async (req, res) => {
  getDrivers(req, res);
});

export default router;
