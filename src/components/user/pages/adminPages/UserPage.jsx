import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../constants/api';

const UserPage = () => {
  const { userId } = useParams();
  const token = useSelector((store) => store.auth?.token?.token);
  const [userData, setUserData] = useState(null);
 const [user, setUser] = useState('');
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-incentive-period/${userId}`, {
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

      // Setting default values for target and achievedTarget if not provided
      const userDataWithDefaults = data?.incentivePeriodDetails.map(periodData => ({
        ...periodData,
        incentive: {
          ...(periodData.incentive || {}),
          target: periodData.incentive?.target || 0,
          achievedTarget: periodData.incentive?.achievedTarget || 0
        }
      }));
      setUser(data);
      setUserData(userDataWithDefaults);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {userData && (
        <>
          <h2 className="text-3xl font-bold mb-8 text-yellow-700 text-center">Incentive Period Data of {user?.name}</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {userData.map((periodData, index) => (
              <div key={index} className=" rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold mb-4 text-yellow-700">Incentive Period</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-purple-800 block">Start Date</span>
                    <span className="text-lg font-semibold">{new Date(periodData.incentive.incentivePeriod?.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-purple-800 block">End Date</span>
                    <span className="text-lg font-semibold">{new Date(periodData.incentive.incentivePeriod?.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-purple-800 block">Target</span>
                    <span className="text-lg font-semibold text-green-700">{periodData.incentive.target||0}</span>
                  </div>
                  <div>
                    <span className="text-purple-800 block">Achieved Target:</span>
                    <span className="text-lg font-semibold text-green-700">{periodData.incentive.achievedTarget||0}</span>
                  </div>
                </div>
                <hr className="my-4" />
                <h4 className="text-lg font-semibold mb-4 text-yellow-700">Placements Data</h4>
                <div className="overflow-auto max-h-48">
                  <table className="w-full">
                    <thead className="bg-pink-200">
                      <tr>
                        <th className="py-2 px-4 text-yellow-800">Candidate</th>
                        <th className="py-2 px-4 text-yellow-800">Client</th>
                        <th className="py-2 px-4 text-yellow-800">Date of Joining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodData.placements && periodData.placements.map((placement, placementIndex) => (
                        <tr key={placementIndex} className="text-center">
                          <td className="py-2 px-4">{placement.candidate}</td>
                          <td className="py-2 px-4">{placement.client}</td>
                          <td className="py-2 px-4">{new Date(placement.dateOfJoining).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
