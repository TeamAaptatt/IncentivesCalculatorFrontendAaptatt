import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../../constants/api";
import { formatDate } from "../../../../utils/helpers/formatDate";
import { setNotificationCount } from "../../../../utils/redux/notificationSlice/notificationSlice";

const NotificationBox = () => {
    const token = useSelector((store)=>store.auth?.token?.token) || '';
    const[notifications, setNotifications] = useState(null);
    const dispatch = useDispatch();
    useEffect(()=>{
        getNotification();
    }, [])

    const getNotification= async ()=>{
        try {
          const response = await axios.get(`${BASE_URL}/get-notification`,{
            headers: {
              'Authorization': `Bearer ${token}`,
            }})  

            setNotifications(response.data);
            console.log(notifications, "nn");
            dispatch(setNotificationCount(response?.data?.length));
        } catch (err) {
            console.log(err);
        }
    }
  return (
    <div className="fixed top-14 right-8 p-4 m-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <div>
        {notifications?.map((notification) => (
          <div cla key={notification.id} className="mb-2 border rounded-sm p-2">
            <h5 className=" uppercase  font-semibold">{notification.title}</h5>
            <p className="text-gray-800">{notification.message}</p>
            <span className="text-xs text-gray-500">
              {formatDate(notification.dateTime)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBox;
