import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';


const CreateUserForm = () => {

  const authToken = useSelector(state => state.auth.token.token);

  const [formData, setFormData] = useState({
    cid: '',
    name: '',
    email: '',
    // level: '',
    salary: '',
    assignedRole: '',
    status: '',
    // reporting: '',
    // skip: '',
    designation: '',
    type: '',
    // ownedTeam: '',
    // incentivePeriod: {},
    // imageUrl: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(BASE_URL+'/create-user', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      const data = response.data;
  
      if (response.status === 201) {
        console.log('User created successfully:', data.user);
        alert('User created successfully:', data.user);
        // You can perform further actions, such as redirecting the user or showing a success message
      } else {
        console.error('Error creating user:', data.error);
        // Handle error, show error message to the user, etc.
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle unexpected errors
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">Create User</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cid">
            CID:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="cid"
            value={formData.cid}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
            Level:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
            Salary:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedRole">
            Assigned Role:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="assignedRole"
            value={formData.assignedRole}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reporting">
            Reporting:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="reporting"
            value={formData.reporting}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skip">
            Skip:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="skip"
            value={formData.skip}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="designation">
            Designation:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownedTeam">
            Owned Team:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="ownedTeam"
            value={formData.ownedTeam}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="incentivePeriod">
            Incentive Period:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="incentivePeriod"
            value={formData.incentivePeriod}
            onChange={handleChange}
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
            Image URL:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
