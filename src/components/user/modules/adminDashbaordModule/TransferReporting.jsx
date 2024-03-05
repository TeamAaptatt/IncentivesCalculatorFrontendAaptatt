import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const TransferReporting = ({ user, onSubmission }) => {
    // const [isFormOpen, setIsFormOpen] = useState(false);
    // const [users, setUsers] = useState(null);
    const [formData, setFormData] = useState({
      user: user, // Set the user ID from props
      reportingTo: '', // Initialize reportingTo as an empty string
      startDate: '',
    });
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const {users, filteredUsers} =useUserManagement();
    const token = useSelector((state) => state.auth.token.token);
  
    // useEffect(() => {
    //   // Fetch all users when component mounts
    //   getAllUsers();
    // }, []);
  
    // const getAllUsers = async () => {
    //   try {
    //     const response = await axios.get(BASE_URL + "/get-users", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     const data = response.data;
    //     setUsers(data);
    //     setFilteredUsers(data.filter(user => user.level?.level !== 'Level 1' && user.level?.level !== 'Level 2'));
    //     console.log("Users:", data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleReportingToChange = (userId) => {
      setFormData({
        ...formData,
        reportingTo: userId,
      });
    };
  
    const handleSubmit =async (e) => {
      e.preventDefault();
     await createNewReporting();
      if (onSubmission && typeof onSubmission === 'function') {
        onSubmission();
      }
  
      
    };
   const createNewReporting = async()=>{
    try {
        const response = await axios.post(BASE_URL + '/reporting', formData, {
            headers:{
                Authorization: `Bearer ${token}` 
            }
        })
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
   } 
    return (
      <div className="flex items-center">
        <form className="mt-4" onSubmit={handleSubmit}>
          <label>
            Reporting To:
            <select
              name="reportingTo"
              value={formData.reportingTo}
              onChange={(e) => handleReportingToChange(e.target.value)}
            >
              <option value="" disabled>Select Reporting To</option>
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>{`${user.name} (${user.cid})`}</option>
              ))}
            </select>
          </label>
          <label>
            Start Date:
            <input
              type="Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </label>
                  <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-full ml-2"
          >
            Submit
          </button>
        </form>
  
        {/* {formData.reportingTo && (
          <div className="m-4 flex flex-col border-2 border-black p-2 rounded-lg">
            <h2 className=' text-red-600 font-bold '>Search Results</h2>
            <ul>
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleReportingToChange(user._id)}
                >
                  <li className='border-2 border-black m-2 rounded p-1 text-xs hover:bg-slate-500'>{user.name}</li>
                </button>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    );
  };
  
  export default TransferReporting;
  