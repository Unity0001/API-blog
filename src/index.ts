import express from "express";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/index.js";
import { specs, swaggerOptions, swaggerUi } from "./swagger/swagger.js";
import { Routes } from "react-router-dom";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT;

app.use('/api-docs',
   swaggerUi.serve,
   swaggerUi.setup(specs, swaggerOptions));

app.use('/api', Routes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`)
});
