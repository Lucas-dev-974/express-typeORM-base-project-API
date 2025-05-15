import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const routesDirectory = path.join(__dirname);

fs.readdirSync(routesDirectory).forEach((file) => {
  if (file !== "index.ts" && file.endsWith(".ts")) {
    const route = require(path.join(routesDirectory, file));
    router.use(route.default);
  }
});

export default router;
