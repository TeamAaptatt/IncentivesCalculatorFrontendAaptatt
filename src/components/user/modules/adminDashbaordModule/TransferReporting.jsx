import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import useUserManagement from '../../../../utils/hooks/useUserMangement';
import showToast from '../../../../utils/helpers/showToast';
import Select from 'react-select';

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
  
    const handleReportingToChange = (selectedOption) => {
      setFormData({
        ...formData,
        reportingTo: selectedOption.value, 
      });
    };
    
  
    const handleSubmit =async (e) => {
      e.preventDefault();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const aprilFirst = new Date(currentYear, 3, 1); 
      const nextYearMarch31 = new Date(currentYear + 1, 2, 31); 
    
     
      const startDate = new Date(formData.startDate);
    
      if (startDate < aprilFirst) {
        showToast('Start date cannot be earlier than April 1st of the current year.', {
          duration: 3000,
          position: 'top-center',
          style: {
            border: '1px solid',
            padding: '4px',
            color: 'white',
            background: '#FF0000',
          },
        });
        return;
      }
    
      if (startDate > nextYearMarch31) {
        showToast('Start date cannot be later than March 31st of the next year.', {
          duration: 3000,
          position: 'top-center',
          style: {
            border: '1px solid',
            padding: '4px',
            color: 'white',
            background: '#FF0000',
          },
        });
        return;
      }
    
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
        showToast(response.data?.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            border: '1px solid',
            padding: '4px',
            color: 'white',
            background: '#FF0000',
          },
        }); 
    } catch (err) {
      showToast(err.response.data?.message, {
        duration: 3000,
        position: 'top-center',
        style: {
          border: '1px solid',
          padding: '4px',
          color: 'white',
          background: '#FF0000',
        },
      });        console.log(err);
    }
   } 
    return (
      <div className="flex items-center my-4  absolute z-50 bg-white border-2 p-2 shadow-lg">
        <form className="mt-4" onSubmit={handleSubmit}>
          <label className='font-medium '>
           <h1 className='ml-2'>Reporting:</h1> 
          <Select
  options={filteredUsers.map(user => ({ value: user._id, label: `${user.name} (${user.cid})` }))}
  value={{ value: formData.reportingTo, label: filteredUsers.find(user => user._id === formData.reportingTo)?.name }}
  onChange={handleReportingToChange}
  className='w-full font-medium mx-2 border p-2'
/>

          </label>
          <label className=' font-medium mx-4'>
            Start Date
            <input
              type="Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className=' uppercase  mx-2 border p-1 rounded'
            />
          </label>
                  <button
            type="submit"
            className="bg-[#0A3A2A] text-white py-2 px-4 rounded hover:bg-[#4D9981] ml-4"          >
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
  