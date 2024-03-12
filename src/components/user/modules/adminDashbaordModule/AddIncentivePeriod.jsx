import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';

const AddIncentivePeriod = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    cid: '',
    incentivePeriod: {
      startDate: '',
      endDate: '',
    },
  });
  const token = useSelector((state) => state.auth.token.token);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: name === 'cid' ? value : prevFormData[name],
        incentivePeriod: {
          ...prevFormData.incentivePeriod,
          [name]: name === 'startDate' || name === 'endDate' ? value : prevFormData.incentivePeriod[name],
        },
      };
      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(BASE_URL + 'add-incentive-period', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Handle success, e.g., show a success message to the user
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error(error.response.data.error);
      // Handle error, e.g., show an error message to the user
    }
  };

  // Function to handle click outside the modal to close it
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75" onClick={handleOutsideClick}>
      <div className="bg-gray-200 p-4 rounded-lg shadow-md w-1/3">
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
           <h1 className="font-bold text-gray-700"> User:</h1>
            <input
              type="text"
              name="cid"
              value={formData.cid}
              onChange={handleChange}
              className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="block mb-4">
          <h1 className="font-bold text-gray-700"> Start Date:</h1>
            
            <input
              type="date"
              name="startDate"
              value={formData.incentivePeriod.startDate}
              onChange={handleChange}
              className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="block mb-4">
          <h1 className="font-bold text-gray-700"> End Date:</h1>
            <input
              type="date"
              name="endDate"
              value={formData.incentivePeriod.endDate}
              onChange={handleChange}
              className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </label>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/2"
            >
              Add Incentive Period
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-red-400 w-1/2 ml-2"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncentivePeriod;
