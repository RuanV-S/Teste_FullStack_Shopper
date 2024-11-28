import { Router } from "express";
import {
  calculateRideEstimate,
  getRides,
  confirmationRide,
} from "../controllers/ride.controller";

const router = Router();

router.get("/:customer_id", (req, res) => {
  getRides(req, res);
});

router.post("/estimate", (req, res) => {
  calculateRideEstimate(req, res);
});

router.patch("/confirm", (req, res) => {
  confirmationRide(req, res);
});

export default router;
