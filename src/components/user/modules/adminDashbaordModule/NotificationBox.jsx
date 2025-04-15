import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../../constants/api";
import { formatDate } from "../../../../utils/helpers/formatDate";
import { setNotificationCount } from "../../../../utils/redux/notificationSlice/notificationSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const NotificationBox = () => {
    const token = JSON.parse(localStorage.getItem('token')).token;
    const [notifications, setNotifications] = useState(null);
    const [notificationToggle, setNotificationToggle] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        getNotification();
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setNotificationToggle(false);
        }
    };

    const getNotification = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-notification`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setNotifications(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div ref={dropdownRef} className="relative">
                <div className="absolute right-[-8px] top-[-8px] bg-red-500 rounded-full h-8 w-8 text-white text-center font-bold">
                    {notifications?.length || 0}
                </div>
                <button onClick={() => { setNotificationToggle((prev) => !prev) }} className="relative">
                    <FontAwesomeIcon icon={faBell} className="h-8 w-8 m-2 focus:outline-none" />
                </button>

                <div className={`fixed top-[3.2rem] right-8 p-4 m-4 bg-slate-50 hover:bg-slate-100 shadow-lg rounded-lg max-h-[30rem] overflow-y-scroll transition-all duration-300 ${notificationToggle ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <h2 className="text-lg font-bold mb-2">Notifications</h2>
                    <div>
                        {notifications?.length>0 ? notifications?.map((notification) => (
                            <div key={notification.id} className="mb-2 border rounded p-2 text-sm ">
                                <h5 className="uppercase font-semibold">{notification.title}</h5>
                                <p className="text-gray-800">{notification.message}</p>
                                <span className="text-xs text-gray-500">
                                    {formatDate(notification.dateTime)}
                                </span>
                            </div>
                        )):<h1>No Notifications for You</h1>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationBox;
