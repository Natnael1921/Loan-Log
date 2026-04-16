import api from "./api";

// get chat (loan history)
export const getLoans = async (friendId, token) => {
  return api.get(`/loans/${friendId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// accept loan
export const acceptLoan = async (loanId, token) => {
  return api.put(
    `/loans/accept/${loanId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// reject loan
export const rejectLoan = async (loanId, token) => {
  return api.put(
    `/loans/reject/${loanId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const createLoan = async (data, token) => {
  return api.post("/loans", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
