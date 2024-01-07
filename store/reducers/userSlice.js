import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;

export default userSlice.reducer;
