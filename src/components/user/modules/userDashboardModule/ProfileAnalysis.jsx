import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { generateFiscalYearOptions } from '../../../../utils/helpers/genereateDateRange';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import UserTarget from './UserTarget';

const ProfileAnalysis = () => {
    const user = useSelector((state) => state.user.userData?.userData);
    const [selectedDateRange, setSelectedDateRange] = useState(generateFiscalYearOptions().slice(-1)[0].value);
    const userId = useSelector(state=> state.user?.userData?.userData?._id);
    const token = useSelector((store)=>store.auth.token?.token) || '';

    const [placements, setPlacement] = useState({});

  useEffect(() => {
    const fetchPlacementCounts = async () => {
        const [startDate, endDate] = selectedDateRange.split(",");

      try {
        const response = await axios.post(`${BASE_URL}placements-test/${userId}`, { startDate, endDate },{
            headers: {
                'Authorization': `Bearer ${token}`,
              }
        });
        setPlacement(response.data);
        console.log(placements);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlacementCounts();
  }, [userId, selectedDateRange]);
   
  const organizePlacementsByMonth = () => {
    const organizedPlacements = {};

    placements.placements?.forEach(placement => {
      const month = new Date(placement.dateOfJoining).getMonth();
      if (!organizedPlacements[month]) {
        organizedPlacements[month] = [];
      }
      organizedPlacements[month].push(placement);
    });

    return organizedPlacements;
  };

    const handleDateRangeChange = (event) => {
        setSelectedDateRange(event.target.value);
      };

      const calculateTotalFeesByMonth = () => {
        const totalFeesByMonth = {};
      
        placements?.placements?.forEach(placement => {
          const month = new Date(placement.dateOfJoining).getMonth();
          totalFeesByMonth[month] = (totalFeesByMonth[month] || 0) + (placement.fee || 0);
        });
      
        return totalFeesByMonth;
      };
      
      

      const renderTable = () => {
        const months = Array.from({ length: 12 }, (_, i) => new Date(null, i + 1, 0).toLocaleString('default', { month: 'long' }));
        const organizedPlacements = organizePlacementsByMonth();
    
        return (
          <table className="w-1/2 divide-y divide-gray-200">
            <thead className="bg-[#0a3a2a]">
              <tr>
                {months.map((month, index) => (
                  <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                {months.map((_, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap  text-white">
                    {organizedPlacements[index]?.length || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        );
      };
      const renderTableFeeDistribution = () => {
        const months = Array.from({ length: 12 }, (_, i) => new Date(null, i + 1, 0).toLocaleString('default', { month: 'long' }));
        const totalFeesByMonth = calculateTotalFeesByMonth();
    
        return (
          <table className="max-w-1/2 divide-y divide-gray-200">
            <thead className="bg-[#0a3a2a]">
              <tr>
                {months.map((month, index) => (
                  <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              <tr>
                {months.map((_, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap  text-white">
                    {totalFeesByMonth[index] || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        );
      };
    
       
  return (
    <div className='w-full flex flex-1 flex-col justify-center ' >
      <div className=' flex     text-white '>
     <div className=' flex flex-col   ml-8 border-2  border-[#0a3a2a] shadow-lg rounded p-2  bg-[#0a3a2a] hover:bg-[#091713] transition duration-300 ease-in-out  '>
     <h1 className='text-xl font-medium uppercase'>Welcome, {user?.name}</h1>
      <div className=''>
        <p><span className='font-semibold'></span> {user?.email}</p>
        <p><span className='font-semibold'>CID:</span> {user?.cid}</p>
        <p><span className='font-semibold'>Reporting To:</span> {user?.reporting[0]?.reportingTo?.name}</p>
      </div>
      </div>
     </div>
     <div className=' flex justify-between'>
     <div className="p-2  flex flex-col justify-start items-start">
          <select value={selectedDateRange} onChange={handleDateRangeChange} className=' border-2 m-4  text-white  bg-inherit border-[#0a3a2a] p-2 rounded '>
            <option className=' text-white bg-[#0a3a2a]' value="">Choose Year</option>
            {generateFiscalYearOptions().map((option) => (
              <option className=' text-white bg-[#0a3a2a]' key={option.value} value={option.value}>
               <h1 className=' text-white bg-[#0a3a2a]'>{option.label}</h1> 
              </option>
            ))}
          </select>
 
    </div>
    <UserTarget selectedDate={selectedDateRange}/>
    </div>
    <div className='ml-4 w-96  flex flex-1 flex-wrap '>

    <h1 className='w-full font-medium uppercase text-white text-xl m-4 p-2 '>Month-Wise Placemnents</h1>     
    {renderTable()}

    </div>

    <div className='ml-4  w-96 flex  flex-1 flex-wrap '>

    <h1 className='w-full font-medium uppercase text-xl m-4 p-2  text-white'>Month-Wise Placemnents Fee</h1>     
    {renderTableFeeDistribution()}

    </div>

      <div>

      </div>
    </div>
  )
}

export default ProfileAnalysis