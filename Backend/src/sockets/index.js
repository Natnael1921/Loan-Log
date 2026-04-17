import { Server } from "socket.io";
import { initPresenceSocket } from "./presence.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  initPresenceSocket(io);

  console.log(" Socket system initialized");

  return io;
};

export const getIO = () => io;