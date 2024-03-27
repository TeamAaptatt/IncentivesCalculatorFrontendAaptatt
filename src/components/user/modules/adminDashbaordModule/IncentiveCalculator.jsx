import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';

const IncentiveCalculator = () => {
  // State variables
  const [cid, setCid] = useState('');
  const [incentiveData, setIncentiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token.token);

  // Function to fetch incentive data
  const calculateOwnership = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + `/owenership-cost/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching ownership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncentiveData = async () => {
    // await calculateOwnership();
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + `/calculate-incentive/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIncentiveData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching incentive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tablestyle = "border-collapse border border-gray-800 p-2"

  return (
    <div className="flex  m-4">

      <div className="w-full flex max-w-md p-6 bg-white ">

        <div className="mb-4 mx-8 w-full flex flex-col">
          <div className='flex flex-col w-auto mx-4'>
          <label htmlFor="cid" className="block text-sm font-bold text-gray-800">
            User CID:
          </label>
          <input
            type="text"
            id="cid"
            name="cid"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="mt-1 p-2  border border-gray-300 rounded-md w-96"
          />
          </div>
          
           <button disabled={!cid.length} className="px-4 w-32 my-4 mx-4 py-2 text-white bg-red-500 rounded-md " onClick={fetchIncentiveData}>
          Calculate
        </button>
        </div>

       
        {incentiveData || loading ? <>
          {loading ? (
            <p className="mt-4 text-gray-600 text-center">Loading...</p>
          ) : (
            // <div>
            //   <ul>
            //     <li>
            //     Achieved Target
            //     </li>
            //     <li>
            //       Target
            //     </li>
            //     <li>
            //       Incentive A
            //     </li>
            //   </ul>
            // </div>
            <table className="mt-4 text-gray-600 text-center flex ">
              <thead>
                <tr className='flex flex-col items-start'>
                  
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Achieved Target</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Target</th>
                  <th className='mx-4  translate-x-16  my-[0.26rem]  text-nowrap'>Incentive Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className='   translate-x-12  flex flex-col items-start  '>
                  <td className=' text-nowrap mx-14 my-[0.26rem]'> {incentiveData.achievedTarget}</td>
                  <td className=' text-nowrap mx-14 my-[0.26rem]'> {incentiveData.target}</td>
                  <td className='  text-nowrap mx-14 my-[0.26rem'>{incentiveData.incentiveAmount}</td>
                </tr>
              </tbody>
            </table>
          )}
        </> : null
        }
      </div>
    </div>
  );
};

export default IncentiveCalculator;
