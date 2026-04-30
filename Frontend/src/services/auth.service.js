import api from "./api";

// LOGIN
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

//  Send verification code
export const sendCode = (data) => {
  return api.post("/auth/send-code", data);
};

//  Verify code
export const verifyCode = (data) => {
  return api.post("/auth/verify-code", data);
};

// Complete registration
export const completeRegister = (data) => {
  return api.post("/auth/complete-register", data);
};