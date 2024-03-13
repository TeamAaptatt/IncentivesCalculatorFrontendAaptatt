import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const AddIncentivePeriod = ({ handleClose }) => {
  const {users, filteredUsers} = useUserManagement();
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
            alert("Incentive Period Created");
      setFormData({
        cid: '',
        incentivePeriod: {
          startDate: '',
          endDate: '',
        },
      })
      handleClose();  
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const handleQuarterButtonClick = (quarter) => {
        const fiscalYearStart = new Date(new Date().getFullYear(), 3, 1);
        const currentDate = new Date();

        if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
          fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
        }
      
    const quarterStartMonth = (quarter - 1) * 3;
    const startDate = new Date(fiscalYearStart.getFullYear(), fiscalYearStart.getMonth() + quarterStartMonth, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
console.log(startDate, endDate);
    setFormData((prevFormData) => ({
      ...prevFormData,
      incentivePeriod: {
        ...prevFormData.incentivePeriod,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    }));
  };

  useEffect(()=>{
    customUIforIncentiveCycle()
  }, [formData.cid])

const customUIforIncentiveCycle = ()=>{
   const user = users?.find(user=>{
    return user.cid === formData?.cid})
   console.log(user);
   if(user){
    console.log(user.cid);
    switch(user.level.level){
      case 'Level 1':
        return (<div className=' flex flex-col items-center gap-2 m-2'>
                      <button
                type="button"
                onClick={() => handleQuarterButtonClick(1)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/4"
              >
                Quarter 1
              </button>
              <button
                type="button"
                onClick={() => handleQuarterButtonClick(2)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/4"
              >
                Quarter 2
              </button>
              <button
                type="button"
                onClick={() => handleQuarterButtonClick(3)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/4"
              >
                Quarter 3
              </button>
              <button
                type="button"
                onClick={() => handleQuarterButtonClick(4)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/4"
              >
                Quarter 4
              </button>

        </div>);
       case 'Level 2':
        return (<div className='flex flex-col items-center gap-2 m-2'>
        <button
                type="button"
                onClick={() => handleHalfYearButtonClick(1)}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 w-1/2"
              >
                Half Year 1
              </button>
              <button
                type="button"
                onClick={() => handleHalfYearButtonClick(2)}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 w-1/2"
              >
                Half Year 2
              </button>

        </div>)
                case 'Level 3':
                  case 'Level 4':
                  case 'Level 5':
                  case 'Level 6':
                    return (
                      <div className='flex flex-col items-center gap-2 m-2'>
                        <button
                          type="button"
                          onClick={() => handleYearButtonClick()}
                          className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 w-full"
                        >
                          Yearly
                        </button>
                      </div>
                    );
          
      default:
        return (
          <>
          
          </>
        )    
    }
   }
}
const handleYearButtonClick = () => {
  const fiscalYearStart = new Date(new Date().getFullYear(), 3, 1); // April 1 of the current year
  const currentDate = new Date();

  if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
    fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
  }

  const startDate = new Date(fiscalYearStart);
  const endDate = new Date(fiscalYearStart.getFullYear() + 1, 2, 31); // March 31 of the next year

  console.log(startDate, endDate);

  setFormData((prevFormData) => ({
    ...prevFormData,
    incentivePeriod: {
      ...prevFormData.incentivePeriod,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
  }));
};

const handleHalfYearButtonClick = (halfYear) => {
  const fiscalYearStart = new Date(new Date().getFullYear(), 3, 1);

  const currentDate = new Date();

  if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
    fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
  }
  const halfYearStartMonth = halfYear === 1 ? 0 : 6; 
  const startDate = new Date(fiscalYearStart.getFullYear(), fiscalYearStart.getMonth() + halfYearStartMonth, 1);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 6, 0);
console.log(startDate, endDate);
  setFormData((prevFormData) => ({
    ...prevFormData,
    incentivePeriod: {
      ...prevFormData.incentivePeriod,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
  }));
};


  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75" onClick={handleOutsideClick}>
      <div className="bg-gray-200 p-4 rounded-lg shadow-md w-1/3">
        <form onSubmit={handleSubmit}>
        <label className="block mb-4">
            <h1 className="font-bold text-gray-700">User:</h1>
            <select
              name="cid"
              value={formData.cid}
              onChange={handleChange}
              className="form-select mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a user</option>
              {users?.map((user) => (
                <option key={user._id} value={user.cid}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
           {customUIforIncentiveCycle()}
          {/* <label className="block mb-4">
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
          </label> */}

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
