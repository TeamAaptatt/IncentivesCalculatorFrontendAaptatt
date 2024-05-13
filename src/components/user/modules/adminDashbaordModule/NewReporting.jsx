import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import useUserManagement from '../../../../utils/hooks/useUserMangement';
import { setLoading } from '../../../../utils/redux/loadSlice/loadSlice';
import showToast from '../../../../utils/helpers/showToast';
import Select from 'react-select';

const NewReporting = ({ onSubmission, onClose }) => {
  const { users, filteredUsers } = useUserManagement();
  const [formData, setFormData] = useState({
    user: '',
    reportingTo: '',
    startDate: '',
  });
  const token = useSelector((state) => state.auth.token.token);

  const dispatch = useDispatch()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserToChange = (userId) => {
    setFormData({
      ...formData,
      user: userId,
    });
  };

  const handleReportingToChange = (userId) => {
    setFormData({
      ...formData,
      reportingTo: userId,
    });
  };

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const aprilFirst = new Date(currentYear, 3, 1); // Note: Months are zero-based index, so 3 represents April
  const startDate = new Date(formData.startDate);

  if (startDate < aprilFirst) {
    showToast('Start date should be greater than or equal to April 1st of the current year.', {
      duration: 3000,
      position: 'top-center',
      style: {
        border: '1px solid',
        padding: '4px',
        color: 'white',
        background: '#FF0000',
      },
    });
    return; // Prevent further execution
  }
    await createNewReporting();
    if (onSubmission && typeof onSubmission === 'function') {
      onSubmission();
    }
  };

  const createNewReporting = async () => {
    try {
       dispatch(setLoading(true))
      const response = await axios.post(BASE_URL + '/reporting', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      showToast('Reporting created successfully ', {
        duration: 3000,
        position: 'top-center', 
        style: {
          border: '1px solid ',
          padding: '4px',
          color: 'white',
          background: '#00FF00',
          
        },
      });
    } catch (err) {
      showToast(err.response.data.message, {
        duration: 3000,
        position: 'top-center', 
        style: {
          border: '1px solid ',
          padding: '4px',
          color: 'white',
          background: '#FF0000',
          
        },
      });
      console.log(err);
    }
  };

  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div  className=' z-20'>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" >
        <div className="bg-white p-6 rounded-lg w-1/2">
          <form onSubmit={handleSubmit}>
            <h1 className="font-bold mb-4">Add Ownership</h1>
            {/* <div className="mb-4">
              <label className="block mb-2">
                <h1 className="font-bold">User:</h1>
                <select
                  className="block border rounded p-2  min-w-1000 w-full"
                  name="user"
                  value={formData.user}
                  onChange={(e) => handleUserToChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select User
                  </option>
                  {users?.map((user) => (
                    <option key={user._id} value={user._id}>{`${user.name} (${user.cid})`}</option>
                  ))}
                </select>
              </label>
            </div> */}
            {/* <div className="mb-4">
              <label className="block mb-2">
                <h1 className="font-bold">Reporting To:</h1>
                <select
                  className="block border rounded p-2  min-w-400 w-full"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={(e) => handleReportingToChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select Reporting To
                  </option>
                  {filteredUsers.map((user) => (
                    <option key={user._id} value={user._id}>{`${user.name} (${user.cid})`}</option>
                  ))}
                </select>
              </label>
            </div> */}
<div className="mb-4">
  <label className="block mb-2">
    <h1 className="font-bold">User:</h1>
    <Select
  className="block border rounded p-2 w-full"
  options={users.map(user => ({ value: user._id, label: `${user.name} (${user.cid})` }))}
  value={{ value: formData.user, label: users.find(user => user._id === formData.user)?.name }}
  onChange={selectedOption => handleUserToChange(selectedOption.value)}
/>

  </label>
</div>
<div className="mb-4">
  <label className="block mb-2">
    <h1 className="font-bold">Reporting To:</h1>
    <Select
  className="block border rounded p-2 w-full"
  options={filteredUsers.map(user => ({ value: user._id, label: `${user.name} (${user.cid})` }))}
  value={{ value: formData.reportingTo, label: filteredUsers.find(user => user._id === formData.reportingTo)?.name }}
  onChange={selectedOption => handleReportingToChange(selectedOption.value)}
/>

  </label>
</div>

            <div className="mb-4">
              <label className="block mb-2">
                <h1 className="font-bold">Start Date:</h1>
                <input
                  className="block border rounded p-2  w-1/4 uppercase"
                  type="Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-[#0A3A2A] text-white py-2 px-4 rounded hover:bg-pink-700 ml-4">
                Submit
              </button>
              <button type="button" className="bg-[#0A3A2A] text-white py-2 px-4 rounded hover:bg-pink-700 ml-4" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default NewReporting;
