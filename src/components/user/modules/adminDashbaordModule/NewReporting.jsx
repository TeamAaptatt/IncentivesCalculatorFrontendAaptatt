import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const NewReporting = ({ onSubmission }) => {
  const { users, filteredUsers } = useUserManagement();
  const [formData, setFormData] = useState({
    user: '',
    reportingTo: '',
    startDate: '',
  });
  // const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
  const token = useSelector((state) => state.auth.token.token);

  useEffect(() => { }, []);

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
    await createNewReporting();
    if (onSubmission && typeof onSubmission === 'function') {
      onSubmission();
    }
    // Close the modal after submission
  };

  const createNewReporting = async () => {
    try {
      const response = await axios.post(BASE_URL + '/reporting', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };


  return (
    <div>
      {/* <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 m-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Open Form
      </button> */}

      
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <form onSubmit={handleSubmit}>
              <h1 className="font-bold mb-4">Add Ownership</h1>
              <div className="mb-4">
                <label className="block mb-2">
                  <h1 className="font-bold">User:</h1>
                  <select
                    className="block border rounded p-2 w-full"
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
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  <h1 className="font-bold">Reporting To:</h1>
                  <select
                    className="block border rounded p-2 w-full"
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
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  <h1 className="font-bold">Start Date:</h1>
                  <input
                    className="block border rounded p-2 w-full"
                    type="Date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="flex justify-center">
                <button type="submit" className="bg-green-500 text-white p-2 rounded-full mr-2">
                  Submit
                </button>
                <button type="button" className="bg-red-500 text-white p-2 rounded-full" onClick={handleClose}>
                  Close
                </button>
            
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
};

export default NewReporting;
