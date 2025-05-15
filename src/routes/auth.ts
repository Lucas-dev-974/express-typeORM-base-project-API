import { authController } from "../controllers/auth";
import express, { Router } from "express";

const AuthRouter: Router = express.Router();

AuthRouter.patch("/auth/", authController.register);
AuthRouter.post("/auth/", authController.login);
AuthRouter.get("/auth/me", authController.me);

export default AuthRouter;
