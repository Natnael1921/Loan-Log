import api from "./api";

export const getBalance = async (friendId, token) => {
  return api.get(`/balance/${friendId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};