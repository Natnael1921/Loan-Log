export const getPresenceText = (friend, presence) => {
  const data = presence?.[friend._id];

  if (!data || data.status === "offline") {
    if (!data?.lastSeen) return "Offline";

    const last = new Date(data.lastSeen);
    const diff = Date.now() - last.getTime();

    const mins = Math.floor(diff / 60000);

    if (mins < 1) return "last seen just now";
    if (mins < 60) return `last seen ${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `last seen ${hours}h ago`;

    return `last seen ${last.toLocaleDateString()}`;
  }

  return "Online";
};