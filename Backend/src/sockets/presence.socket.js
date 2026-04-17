const users = new Map();

const HEARTBEAT_TIMEOUT = 30000; // 30 sec

export const initPresenceSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    let currentUserId = null;

    // USER REGISTER ONLINE
    socket.on("user:online", (userId) => {
      if (!userId) return;

      currentUserId = userId;

      users.set(userId, {
        socketId: socket.id,
        lastSeen: new Date(),
        isOnline: true,
      });

      io.emit("presence:update", {
        userId,
        status: "online",
      });
    });

    // HEARTBEAT
    socket.on("user:heartbeat", (userId) => {
      if (!userId) return;

      const user = users.get(userId);

      if (user) {
        user.lastSeen = new Date();
        user.isOnline = true;
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      if (!currentUserId) return;

      const user = users.get(currentUserId);

      if (user) {
        user.lastSeen = new Date();
        user.isOnline = false;

        io.emit("presence:update", {
          userId: currentUserId,
          status: "offline",
          lastSeen: user.lastSeen,
        });

        users.delete(currentUserId);
      }

      console.log(" Disconnected:", socket.id);
    });
  });

  // BACKGROUND  (HEARTBEAT CHECKER)
  setInterval(() => {
    const now = Date.now();

    for (const [userId, user] of users.entries()) {
      if (now - user.lastSeen > HEARTBEAT_TIMEOUT) {
        user.isOnline = false;

        io.emit("presence:update", {
          userId,
          status: "offline",
          lastSeen: user.lastSeen,
        });

        users.delete(userId);
      }
    }
  }, 10000); // check every 10 sec
};