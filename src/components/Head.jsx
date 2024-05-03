import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/redux/authSlice/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase/firebase';
import { clearUserData } from '../utils/redux/userSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const Head = () => {
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUserData());
            dispatch(logout());
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setToggle(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='flex justify-between  p-4 bg-slate-50 shadow w-full h-16 sticky top-0 mb-8  z-50 '>
            <div className='text-2xl  font-bold text-indigo-600  ml-12'>
                <Link to={"/"}>
                    <img src='https://successpact.com/wp-content/uploads/2022/06/imgpsh_fullsize_anim-2-e1655022773479.png' className=' h-12  w-32 p-2' alt="Logo" />
                </Link>
            </div>
            <div ref={dropdownRef}>
                <button
                    onClick={() => setToggle((prev) => !prev)}
                    className="h-8 w-8 m-2 focus:outline-none"
                >
                    <img
                        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                        alt="User Avatar"
                        className="h-full w-full"
                    />
                </button>
                {toggle && (
                    <div className="absolute z-40 right-6 top-[4.1rem] rounded w-44 flex flex-col bg-white border border-gray-300 p-4 shadow-md transition-all duration-300">
                        <Link to="/profile">
                            <button className="w-full rounded-lg my-2 py-2 px-4 text-xl text-gray-800 hover:bg-black hover:text-white focus:outline-none transition-all duration-300 transform hover:scale-105">
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                Profile
                            </button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg py-2 px-4 text-xl text-white bg-blue-500 hover:bg-blue-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Head;
