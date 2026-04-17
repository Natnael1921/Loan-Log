import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export const usePresence = (user) => {
  const [onlineUsers, setOnlineUsers] = useState({}); 
  // { userId: { status, lastSeen } }

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.emit("user:online", user._id);

    const heartbeat = setInterval(() => {
      socket.emit("user:heartbeat", user._id);
    }, 15000);

    socket.on("presence:update", (data) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [data.userId]: {
          status: data.status,
          lastSeen: data.lastSeen,
        },
      }));
    });

    return () => {
      clearInterval(heartbeat);
      socket.disconnect();
    };
  }, [user]);

  return onlineUsers;
};