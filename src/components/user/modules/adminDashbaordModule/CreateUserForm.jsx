import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import useUserManagement from '../../../../utils/hooks/useUserMangement';
import { setLoading } from '../../../../utils/redux/loadSlice/loadSlice';
import showToast from '../../../../utils/helpers/showToast';
import { validateFormData } from '../../../../utils/helpers/validationHelpers';
import { validateCreateUserFormData } from '../../../../utils/helpers/validateCreateUserData';

const CreateUserForm = ({ handleClose }) => {
  const [levels, setLevels] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const { users, filteredUsers } = useUserManagement();
  const [salaryId, setSalaryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] =  useState({});
 const dispatch = useDispatch()
  const handleSearch = (event) => {
    setErrors((prevError)=>({...prevError, [event.target.name]:''}))

    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm) {
      const filteredResults = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(filteredResults);
      setSearchResults(filteredResults.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };


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
      console.log("b", allAssignedRoles);
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
    //status: '',
    // reporting: '',
    skip: '',
    joiningDate:'',
    designation: '',
    // type: '',
    // ownedTeam: '',
    // incentivePeriod: '',
    // imageUrl: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateCreateUserFormData(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    try {
      dispatch(setLoading(true))
      const salaryResponse = await axios.post(BASE_URL + 'add-salary', {
        cid: formData.cid,
        amount: formData.salary,
        joiningDate:formData.joiningDate
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const salaryData = salaryResponse?.data;

      if (salaryResponse.status === 201) {
        setSalaryId(salaryData._id);
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

        showToast('User created successfully! ', {
          duration: 3000,
          position: 'top-center', 
          style: {
            border: '1px solid ',
            padding: '4px',
            color: 'white',
            background: '#00FF00',
            
          },
        });
        setFormData({
          cid: '',
          name: '',
          email: '',
          level: '',
          salary: '',
          assignedRole: '',
          status: '',
          // reporting: '',
          joiningDate:'',
          skip: '',
          designation: '',
          type: '',
          // ownedTeam: '',
          // incentivePeriod: '',
          // imageUrl: '',
          password: '',

        })
      } else {
        showToast('Error Adding Salary', {
          duration: 3000,
          position: 'top-center', 
          style: {
            border: '1px solid ',
            padding: '4px',
            color: 'white',
            background: '#23C552',
            
          },
        });
        console.error('Error creating salary:', salaryData.error);
      }
      handleClose();
    } catch (error) {
      showToast(error.response.data.message || error.response.data.error , {
        duration: 4000,
        position: 'top-center', 
        style: {
          border: '1px solid ',
          padding: '4px',
          color: 'white',
          background: '#FF0000',
          
        },
      });
      console.error('Error creating user!:', error);
    }finally {
  
      dispatch(setLoading(false))
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  const handleUserClick = (userId, userName) => {
    setSearchResults([])
    setSearchTerm(userName);
    setFormData({
      ...formData,
      skip: userId 
    });
  };

  const handleChange = (e) => {
    setErrors((prevError)=>({...prevError, [e.target.name]:''}))
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  return (
    <div className="fixed  top-0  left-0 w-full h-screen  flex items-center justify-center bg-gray-800 bg-opacity-50 " onClick={handleOutsideClick}>
      <div className="bg-white p-8 rounded shadow-md max-w-xl max-h-[90vh] w-[100vh] mt-10 overflow-y-scroll">
        <form
          onSubmit={handleSubmit}
          className=" px-8 rounded  max-w-xl w-full flex gap-4 flex-wrap h-full "
        >       
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
                {errors.cid && (
    <p className="text-red-500 text-xs italic">{errors.cid}</p>
  )}
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
                {errors.name && (
    <p className="text-red-500 text-xs italic">{errors.name}</p>
  )}
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
                {errors.email && (
    <p className="text-red-500 text-xs italic">{errors.email}</p>
  )}
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
                {errors.salary && (
    <p className="text-red-500 text-xs italic">{errors.salary}</p>
  )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
                  Date of Joining:
                </label>
                <input
                  className="border rounded w-full py-2 px-3 uppercase"
                  type="Date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
                {errors.joiningDate && (
    <p className="text-red-500 text-xs italic">{errors.joiningDate}</p>
  )}
              </div>
              
                          </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skip">
                  Reporting
                </label>
                <input
                  className="border rounded w-full py-2 px-3"
                  name="skip"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search users"

                />
                
                {searchResults && (
                  <div className='w-48 absolute bg-gray-50'>
                    {searchResults.map(user => (
                      <ul className=''>
                        <li onClick={() => handleUserClick(user._id, user.name)}
                          className='  rounded hover:bg-slate-300 border-gray-100 p-2' key={user.id}>{user.name}</li>
                      </ul>
                    ))}
                  </div>

                )
                }
                {errors.skip && (
    <p className="text-red-500 text-xs italic">{errors.skip}</p>
  )}
              </div>
              <div className="mb-4 mt-4">
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
                {errors.level && (
    <p className="text-red-500 text-xs italic">{errors.level}</p>
  )}
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
                {errors.assignedRole && (
    <p className="text-red-500 text-xs italic">{errors.assignedRole}</p>
  )}
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
                {errors.designation && (
    <p className="text-red-500 text-xs italic">{errors.designation}</p>
  )}
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
                 {errors.password && (
    <p className="text-red-500 text-xs italic">{errors.password}</p>
  )}
              </div>
                          </div>
          </div>
          <div className="flex justify-end ">
            <button type="submit" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700">
              Create User
            </button>

            <button type="button" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 ml-4" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );



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
