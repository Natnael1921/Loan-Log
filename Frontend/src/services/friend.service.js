import api from "./api";

// Get friends
export const getFriends = async (token) => {
  return api.get("/friends", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// SEARCH USERS
export const searchUsers = async (query, token) => {
  return api.get(`/friends/search?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  SEND REQUEST
export const sendFriendRequest = async (userId, token) => {
  return api.post(`/friends/request/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};