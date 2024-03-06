import { createSlice } from "@reduxjs/toolkit";

const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("token");
  return storedUser ? JSON.parse(storedUser) : null;
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: loadUserFromStorage()||'',
    isAuthenticated: !!loadUserFromStorage(),
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = '';
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
