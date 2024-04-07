import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice/authSlice";
import userSlice from "./userSlice";
import loadSlice from "./loadSlice/loadSlice";


const store = configureStore({
     reducer:{
           auth:authSlice,
           user: userSlice,
           loader:loadSlice
     }
})


export default store;