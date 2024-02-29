import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    userData: {},
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = {};
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
