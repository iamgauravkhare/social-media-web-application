const BASE_URL_2 = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "http://localhost:4500/api/v1";

console.log(BASE_URL_2);

// AUTH ENDPOINTS
export const endpoints = {
  SERVER_CONNECTION_CHECK: BASE_URL_2 + "/authentication/server-connection",
  SENDOTP_API: BASE_URL + "/authentication/send-one-time-password",
  SIGNUP_API: BASE_URL + "/authentication/sign-up",
  LOGIN_API: BASE_URL + "/authentication/sign-in",
  RESETPASSTOKEN_API: BASE_URL + "/authentication/reset-password-link",
  RESETPASSWORD_API: BASE_URL + "/authentication/reset-password",
};
