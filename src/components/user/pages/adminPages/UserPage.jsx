import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';

const UserPage = () => {
  const { userId } = useParams();
  const token = useSelector((store) => store.auth.token?.token);
  const [incentivePeriodData, setIncentivePeriodData] = useState(null);

  useEffect(() => {
    getIncentivePeriod();
  }, []);

  const getIncentivePeriod = async () => {
    try {
      console.log('Fetching incentive period data...');
      const response = await fetch(`${BASE_URL}get-incentive-period?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);

      // Convert UTC date strings to local date strings
      data.incentivePeriod.startDate = new Date(data.incentivePeriod.startDate).toLocaleDateString();
      data.incentivePeriod.endDate = new Date(data.incentivePeriod.endDate).toLocaleDateString();

      setIncentivePeriodData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Render UI and table with Tailwind CSS
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{`${incentivePeriodData?.user?.name}'s Data`}</h2>
      <div className="mb-4">
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Incentive Period Data</h3>
        {incentivePeriodData ? (
          <table className="min-w-full border rounded overflow-hidden mb-4">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Start Date</th>
                <th className="py-2 px-4">End Date</th>
                <th className="py-2 px-4">Target</th>
                <th className="py-2 px-4">Achieved Target</th>
              </tr>
            </thead>
            <tbody>
              <tr className=' text-center'>
                <td className="py-2 px-4">{incentivePeriodData.incentivePeriod.startDate}</td>
                <td className="py-2 px-4">{incentivePeriodData.incentivePeriod.endDate}</td>
                <td className="py-2 px-4">{incentivePeriodData.target}</td>
                <td className="py-2 px-4">{incentivePeriodData.achievedTarget}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Placements Data</h3>
        {incentivePeriodData?.placements ? (
          <table className="min-w-full border rounded overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Candidate</th>
                <th className="py-2 px-4">Client</th>
                <th className="py-2 px-4">Date of Joining</th>
                {/* Add more column headers as needed */}
              </tr>
            </thead>
            <tbody>
              {incentivePeriodData.placements.map((placement) => (
                <tr key={placement._id} className=' text-center'>
                  <td className="py-2 px-4">{placement.candidate}</td>
                  <td className="py-2 px-4">{placement.client}</td>
                  <td className="py-2 px-4">{new Date(placement.dateOfJoining).toLocaleDateString()}</td>
                  {/* Add more cells with placement data */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No placements data available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
