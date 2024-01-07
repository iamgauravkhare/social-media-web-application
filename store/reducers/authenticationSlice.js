import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
  signupData: null,
  loading: false,
  name: "auth",
  initialState: {
    token: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null,
  },
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setSignUpData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setToken, setSignupData, setLoading } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
