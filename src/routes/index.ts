import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();
const routesDirectory = path.join(__dirname);

fs.readdirSync(routesDirectory).forEach((file) => {
  if (file !== "index.ts" && file.endsWith(".ts") && file !== "public.ts") {
    const route = require(path.join(routesDirectory, file));
    router.use(route.default);
  }
});

export default router;
