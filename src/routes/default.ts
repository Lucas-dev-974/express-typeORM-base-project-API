import { Router } from "express";
import { defaultController } from "../controllers/default";

const router = Router();

router.get("/", (req, res) => defaultController.getDefault(req, res));
router.post("/example", (req, res) => defaultController.postExample(req, res));

export default router;
