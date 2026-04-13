import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import friendRoutes from "./routes/friend.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
//routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);

export default app;
