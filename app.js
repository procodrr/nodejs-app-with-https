// app.js
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(join(__dirname, "public")));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

export default app;
