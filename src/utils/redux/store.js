import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice/authSlice";
import userSlice from "./userSlice";
import loadSlice from "./loadSlice/loadSlice";
import notificationSlice from "./notificationSlice/notificationSlice";


const store = configureStore({
     reducer:{
           auth:authSlice,
           user: userSlice,
           loader:loadSlice,
           notification:notificationSlice,
     }
})


export default store;