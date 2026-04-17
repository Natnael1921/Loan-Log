const avatarColors = [
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export const getAvatarColor = (name) => {
  if (!name) return "#3b82f6";

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};