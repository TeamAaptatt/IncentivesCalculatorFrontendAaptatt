import { createSlice } from "@reduxjs/toolkit";

export const notifcationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: 0,
    },

    reducers:{
        setNotificationCount:(state, action)=>{
            state.notifications=action.payload
        }
    }
})



export const { setNotificationCount } = notifcationSlice.actions;


export default notifcationSlice.reducer;