import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const CreateUserForm = () => {
  const [levels, setLevels] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const { users, filteredUsers } = useUserManagement();
  const [salaryId, setSalaryId] = useState(null);


  useEffect(() => {
    getAllLevels();
    getAllDesignations();
    getAllAssignedRoles();
  }, []);

  const token = useSelector((state) => state.auth.token.token);

  const getAllLevels = async () => {
    try {
      const response = await axios.get(BASE_URL + '/get-levels', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allLevels = await response.data;
      setLevels(allLevels);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllDesignations = async () => {
    try {
      const response = await axios.get(BASE_URL + '/get-designations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allDesignations = await response.data;
      setDesignations(allDesignations);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllAssignedRoles = async () => {
    try {
      const response = await axios.get(BASE_URL + 'get-assigned-role', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allAssignedRoles = await response.data;
      console.log( "b", allAssignedRoles);
      setAssignedRoles(allAssignedRoles);
    } catch (err) {
      console.log(err);
    }
  };

  const [formData, setFormData] = useState({
    cid: '',
    name: '',
    email: '',
    level: '',
    salary: '',
    assignedRole: '',
    status: '',
    // reporting: '',
    skip: '',
    designation: '',
    // type: '',
    // ownedTeam: '',
    // incentivePeriod: '',
    // imageUrl: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create salary first
      const salaryResponse = await axios.post(BASE_URL + 'add-salary', {
        cid: formData.cid,
        amount: formData.salary,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const salaryData = salaryResponse.data;

      if (salaryResponse.status === 201) {
        // Save the salary ID
        setSalaryId(salaryData._id);

        // Create user with associated salary
        const userResponse = await axios.post(BASE_URL + '/create-user', {
          ...formData,
          salary: salaryData._id,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = userResponse.data;

        console.log('User created successfully:', userData.user);
        console.log('Salary created successfully:', salaryData);

        alert('User and Salary created successfully!');
        // You can perform further actions, such as redirecting the user or showing a success message
      } else {
        console.error('Error creating salary:', salaryData.error);
        // Handle error, show error message to the user, etc.
      }
    } catch (error) {
      console.error('Error creating user and salary:', error);
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
          <select
            className="border rounded w-full py-2 px-3"
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Level
            </option>
            {levels.map((level) => (
              <option key={level.id} value={level._id}>
                {level.level}
              </option>
            ))}
          </select>
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
          <select
            className="border rounded w-full py-2 px-3"
            name="assignedRole"
            value={formData.assignedRole}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Assigned Role
            </option>
            {assignedRoles?.map((role) => (
              <option key={role.id} value={role._id}>
                {role?.name}
              </option>
            ))}
          </select>
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

        {/* <div className="mb-4">
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
        </div> */}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skip">
            Skip:
          </label>
          <select
            className="border rounded w-full py-2 px-3"
            name="skip"
            value={formData.skip}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Skip
            </option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="designation">
            Designation:
          </label>
          <select
            className="border rounded w-full py-2 px-3"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Designation
            </option>
            {designations.map((designation) => (
              <option key={designation.id} value={designation._id}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="mb-4">
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
        </div> */}

        {/* <div className="mb-4">
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
        </div> */}

        {/* <div className="mb-4">
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
        </div> */}

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
