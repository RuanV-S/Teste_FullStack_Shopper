import { Router } from "express";
import { createUser, loginService } from "../controllers/user.controller";

const router = Router();

router.post("/register", async (req, res) => {
  createUser(req, res);
});

router.post("/auth", async (req, res) => {
  loginService(req, res);
});

export default router;
