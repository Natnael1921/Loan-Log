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
// GET PENDING REQUESTS
export const getFriendRequests = async (token) => {
  return api.get("/friends/requests", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ACCEPT REQUEST
export const acceptFriendRequest = async (requestId, token) => {
  return api.put(`/friends/accept/${requestId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// REJECT REQUEST
export const rejectFriendRequest = async (requestId, token) => {
  return api.put(`/friends/reject/${requestId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};