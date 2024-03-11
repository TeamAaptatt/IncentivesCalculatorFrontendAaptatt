// Import necessary dependencies and styles
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../../constants/api';
import { useSelector } from 'react-redux';

const IncentiveCalculator = () => {
  // State variables
  const [cid, setCid] = useState('');
  const [incentiveData, setIncentiveData] = useState({});
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token.token);

  // Function to fetch incentive data

  const calculateOwnership = async () => {
    try {
      setLoading(true);
      const response = await axios.get( BASE_URL+ `/owenership-cost/${cid}`, {
        headers: {
            Authorization:`Bearer ${token}`
        }
      });
      
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching incentive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncentiveData = async () => {
    await calculateOwnership();
    try {
      setLoading(true);
      const response = await axios.get( BASE_URL+ `/calculate-incentive/${cid}`, {
        headers: {
            Authorization:`Bearer ${token}`
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

  // Use effect to fetch incentive data when component mounts or cid changes
 

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Incentive Calculator</h1>

      <div className="mb-4">
        <label htmlFor="cid" className="block text-sm font-medium text-gray-600">
          User CID:
        </label>
        <input
          type="text"
          id="cid"
          name="cid"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <button className=' p-2 outline-1 bg-red-400' onClick={()=>{
        fetchIncentiveData();
      }} >Calculate</button>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-600">Achieved Target: {incentiveData.achievedTarget}</p>
          <p className="text-sm font-medium text-gray-600">Target: {incentiveData.target}</p>
          {/* <p className="text-sm font-medium text-gray-600">Ownership Cost: {incentiveData.target/4}</p> */}

          <p className="text-sm font-medium text-gray-600">Incentive Percentage: {incentiveData.incentivePercentage}%</p>
          <p className="text-sm font-medium text-gray-600">Incentive Amount: {incentiveData.incentiveAmount}</p>
        </div>
      )}
    </div>
  );
};

export default IncentiveCalculator;
