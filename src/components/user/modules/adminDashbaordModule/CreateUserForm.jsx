import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const CreateUserForm = ({ handleClose }) => {
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
        setFormData({
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

        })
      } else {
        console.error('Error creating salary:', salaryData.error);
        // Handle error, show error message to the user, etc.
      }
      handleClose();
    } catch (error) {
      console.error('Error creating user and salary:', error);
      // Handle unexpected errors
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50" onClick={handleOutsideClick}>
      <div className="bg-white p-8 rounded shadow-md max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-center">Create User</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
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
                placeholder="CID"
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
                placeholder="Name"
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
                placeholder="Email"
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
                placeholder="Salary"
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
                placeholder="Status"
              />
            </div>
          </div>
          <div>
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
                placeholder="Password"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Create User
          </button>
          <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 ml-4" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );


  // return (
  //   <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 overflow-y-auto" onClick={handleOutsideClick}>
  //     <div className="bg-white p-8 rounded shadow-md max-w-md w-full flex flex-col">
  //       <h2 className="text-2xl font-bold mb-4 text-center">Create User</h2>
  //       <div className="flex flex-wrap gap-4">
  //         <div className="w-full md:w-1/2">
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cid">
  //               CID:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="text"
  //               name="cid"
  //               value={formData.cid}
  //               onChange={handleChange}
  //               placeholder="CID"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
  //               Name:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="text"
  //               name="name"
  //               value={formData.name}
  //               onChange={handleChange}
  //               placeholder="Name"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
  //               Email:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="email"
  //               name="email"
  //               value={formData.email}
  //               onChange={handleChange}
  //               placeholder="Email"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
  //               Salary:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="text"
  //               name="salary"
  //               value={formData.salary}
  //               onChange={handleChange}
  //               placeholder="Salary"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
  //               Status:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="text"
  //               name="status"
  //               value={formData.status}
  //               onChange={handleChange}
  //               placeholder="Status"
  //             />
  //           </div>
  //         </div>

  //         <div className="w-full md:w-1/2">
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skip">
  //               Skip:
  //             </label>
  //             <select
  //               className="border rounded w-full py-2 px-3"
  //               name="skip"
  //               value={formData.skip}
  //               onChange={handleChange}
  //             >
  //               <option value="" disabled>
  //                 Select Skip
  //               </option>
  //               {filteredUsers.map((user) => (
  //                 <option key={user.id} value={user._id}>
  //                   {user.name}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
  //               Level:
  //             </label>
  //             <select
  //               className="border rounded w-full py-2 px-3"
  //               name="level"
  //               value={formData.level}
  //               onChange={handleChange}
  //             >
  //               <option value="" disabled>
  //                 Select Level
  //               </option>
  //               {levels.map((level) => (
  //                 <option key={level.id} value={level._id}>
  //                   {level.level}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedRole">
  //               Assigned Role:
  //             </label>
  //             <select
  //               className="border rounded w-full py-2 px-3"
  //               name="assignedRole"
  //               value={formData.assignedRole}
  //               onChange={handleChange}
  //             >
  //               <option value="" disabled>
  //                 Select Assigned Role
  //               </option>
  //               {assignedRoles?.map((role) => (
  //                 <option key={role.id} value={role._id}>
  //                   {role?.name}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="designation">
  //               Designation:
  //             </label>
  //             <select
  //               className="border rounded w-full py-2 px-3"
  //               name="designation"
  //               value={formData.designation}
  //               onChange={handleChange}
  //             >
  //               <option value="" disabled>
  //                 Select Designation
  //               </option>
  //               {designations.map((designation) => (
  //                 <option key={designation.id} value={designation._id}>
  //                   {designation.name}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
  //               Password:
  //             </label>
  //             <input
  //               className="border rounded w-full py-2 px-3"
  //               type="password"
  //               name="password"
  //               value={formData.password}
  //               onChange={handleChange}
  //               placeholder="Password"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex justify-between">
  //         <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
  //           Create User
  //         </button>
  //         <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700" onClick={handleClose}>
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default CreateUserForm;
