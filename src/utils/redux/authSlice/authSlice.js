import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../firebase/firebase";
import { getIdToken } from "firebase/auth";

// const loadUserFromStorage = () => {
//   const storedUser = localStorage.getItem("token");
//   return storedUser ? JSON.parse(storedUser) : null;
// };
  const storedUserLocal = localStorage.getItem("token");

const token = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token= await getIdToken(user,  true);
      return token;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}
const loadUserFromStorage = () => {
 if(storedUserLocal===null) return
  const storedUser = token;
  return storedUser ? token : null;
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
