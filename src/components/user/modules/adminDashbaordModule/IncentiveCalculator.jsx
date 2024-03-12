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
    await calculateOwnership();
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

  // Use effect to fetch incentive data when component mounts or cid changes
  useEffect(() => {
    if (cid) {
      fetchIncentiveData();
    }
  }, [cid]);

  return (
    <div className="flex items-center justify-center m-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold mb-8 text-center">Incentive Calculator</h1>

        <div className="mb-4">
          <label htmlFor="cid" className="block text-sm font-bold text-gray-800">
            User CID:
          </label>
          <input
            type="text"
            id="cid"
            name="cid"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button className="px-4 py-2 text-white bg-red-500 rounded-md w-full" onClick={fetchIncentiveData}>
          Calculate
        </button>

        {loading ? (
          <p className="mt-4 text-gray-600 text-center">Loading...</p>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-bold">Achieved Target: {incentiveData.achievedTarget}</p>
            <p className="text-sm font-bold text-gray-600">Target: {incentiveData.target}</p>
            <p className="text-sm font-bold text-gray-600">Incentive Amount: {incentiveData.incentiveAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncentiveCalculator;
