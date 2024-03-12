import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';

const AddIncentivePeriod = () => {
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
    } catch (error) {
      console.error(error.response.data.error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <label className="block mb-4">
          User:
          <input
            type="text"
            name="cid"
            value={formData.cid}
            onChange={handleChange}
            className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          Start Date:
          <input
            type="date"
            name="startDate"
            value={formData.incentivePeriod.startDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          End Date:
          <input
            type="date"
            name="endDate"
            value={formData.incentivePeriod.endDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4 w-full"
        >
          Add Incentive Period
        </button>
      </form>
    </div>
  );
};

export default AddIncentivePeriod;
