import { AppDataSource } from "./app-source";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const corsOptions = {
  origin: "*", // Autorise toutes les origines
  methods: "DELETE,PUT,PATCH,GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    const PORT = process.env.PORT || 3001;

    // Dynamically load routes from the routes directory
    const routesPath = path.join(__dirname, "routes");
    fs.readdirSync(routesPath).forEach((file) => {
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const route = require(path.join(routesPath, file));
        app.use(route.default);
      }
    });
    // End of dynamically loading routes

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}, http://localhost:${PORT}`
      );
    });
  })
  .catch((error) =>
    console.error("Error during Data Source initialization:", error)
  );
