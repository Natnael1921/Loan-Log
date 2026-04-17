import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/index.js";

dotenv.config();

// Connect DB
connectDB();

// CREATE HTTP SERVER
const server = http.createServer(app);

// INIT SOCKETS WITH SERVER
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});