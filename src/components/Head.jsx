import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../utils/redux/authSlice/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase/firebase';
import { clearUserData } from '../utils/redux/userSlice';

const Head = () => {
    const dispatch  = useDispatch()
    const handleLogout = async () => {
        try {
          await signOut(auth);
          dispatch(clearUserData())
          dispatch(logout())
        } catch (error) {
            console.log(error);
        }
      };
    
  return (
    <div className='flex justify-between h- p-4 bg-slate-50 shadow w-full mb-2'>
        <div className='text-2xl  font-bold text-indigo-600'>
           Incentive Calculator
        </div>
        <div>
        <button className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded-md w-full" onClick={handleLogout}>Log Out</button>

        </div>
    </div>
  )
}

export default Head