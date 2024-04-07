import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { auth} from '../../../utils/firebase/firebase';
import Loader from '../../Loader';
import { logout } from '../../../utils/redux/authSlice/authSlice';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUser, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData?.userData);
  console.log(user);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false); // State to control visibility of password change section

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const handleChangeDisplayName = async () => {
    try {
      setLoading(true);

      await updateProfile(auth.currentUser, { displayName });

      setConfirmation('Display name changed successfully!');
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);

      if (newPassword !== confirmNewPassword) {
        setError('New passwords do not match');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, newPassword);

      setConfirmation('Password changed successfully!');
      setError(null);
    } catch (error) {
      setError('Enter Correct Password' || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <motion.div
      className="flex flex-row h-screen overflow-hidden bg-gradient-to-b from-purple-800 via-purple-600 to-purple-500 text-white"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >

      <div className="bg-gray-800  w-96 flex flex-col justify-between">
        <div className="py-4">
        
          <button className="w-full text-left px-6 py-2 text-gray-200 hover:bg-gray-700"
          onClick={() => setShowPasswordChange(false)}>
            Profile
          </button>
          <button
            className="w-full text-left px-6 py-2 text-gray-200 hover:bg-gray-700"
            onClick={() => setShowPasswordChange(true)}
          >
            Profile Setting
          </button>
        </div>
        <div className="py-4">
          {/* <button
            className="w-full text-left px-6 py-2 text-gray-200 hover:bg-gray-700"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button> */}
        </div>
      </div>

      <div className="flex-grow p-8 translate-x-44">
        {loading && <Loader />}
        <motion.div
          className="bg-white p-8 shadow-md rounded-md w-1/2 mt-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl text-black font-semibold mb-4">
            {showPasswordChange ? 'Change Password' : 'Profile'}
          </h2>
          {showPasswordChange && (
            <>
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none text-black focus:border-indigo-400  transition-all duration-300"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none text-black focus:border-indigo-400 transition-all duration-300"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none  text-black focus:border-indigo-400  transition-all duration-300"
                  placeholder="Confirm your new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <motion.button
                  className="bg-indigo-600 text-black px-4 py-2 rounded-md mt-2 transition-all duration-300 hover:bg-blue-600 focus:outline-none"
                  onClick={handleChangePassword}
                  disabled={loading}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.2 } }}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </motion.button>
              </div>
            </>
          )}

{!showPasswordChange && (
            <>
              <table className="mt-4 text-gray-600 text-center flex ">
              <thead>
                <tr className='flex flex-col items-start'>
                  
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Name</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Target</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Achieved Target</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Start of Incentive Period</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>End of Incentive Period</th>

                  
                </tr>
              </thead>
              <tbody>
                <tr className='   translate-x-12  flex flex-col items-start  '>
                  <td className=' text-nowrap mx-14 my-[0.26rem]'> {user.name}</td>
                  <td className=' text-nowrap mx-14 my-[0.26rem]'> {user.incentivePeriod[0]?.target}</td>
                  <td className='  text-nowrap mx-14 my-[0.26rem'>{user?.incentivePeriod[0]?.achievedTarget}</td>
                  <td className=' my-1  text-nowrap mx-14 my-[0.26rem'>{new Date(user?.incentivePeriod[0]?.incentivePeriod.startDate).toLocaleDateString()}</td>
                  <td className='my-4  text-nowrap mx-14 my-[0.26rem'>{new Date(user?.incentivePeriod[0]?.incentivePeriod.endDate).toLocaleDateString()}</td>

                </tr>
              </tbody>
            </table>            </>
          )}
          
          {confirmation && <p className="text-green-500 mt-4">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            {confirmation}
          </p>}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
