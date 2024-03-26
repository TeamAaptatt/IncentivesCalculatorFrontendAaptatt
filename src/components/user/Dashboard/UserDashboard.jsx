import React, { useEffect, useState } from 'react';
import PlacementTable from '../modules/userDashboardModule/PlacementTable';
import useUserDetails from '../../Auth/useUserDetails';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../../constants/api';

const UserDashboard = () => {
  const { getUserDetails } = useUserDetails();
  const [placementData, setPlacementData] = useState([]);

  const userData = useSelector(state => state.user.userData.userData);
  const userId = useSelector(state => state.user?.userData?.userData?._id);
  const ownedTeams = useSelector(state => state.user.userData?.userData?.ownedTeam);

  const token = useSelector((store) => store.auth.token?.token) || '';
  useEffect(() => {
    placementDataofUser();
  }, [userId]);

  const placementDataofUser = async () => {
    try {
      const response = await axios.get(BASE_URL + `placements/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const resData = response.data;  // Extract data from the response
      setPlacementData(resData.placements);
    } catch (err) {
      console.log("Error in getting the user's placement data", err);
    }
  }

  const startDate = userData?.incentivePeriod[0]?.incentivePeriod.startDate;
  const formattedStartDate = startDate && isValidDate(startDate) ? new Date(startDate).toLocaleDateString() : '';

  const endDate = userData?.incentivePeriod[0]?.incentivePeriod.endDate;
  const formattedEndDate = endDate && isValidDate(endDate) ? new Date(endDate).toLocaleDateString() : '';

  function isValidDate(dateString) {
    const d = new Date(dateString);
    return !isNaN(d.getTime());
  }

  return (
    <div>
      <div className='flex justify-center'>
        <div className='text-left m-2 p-2 border border-red-600 rounded w-9
        
        
        6 h-34'>
          <h1 className="text-center font-bold">Hello {userData?.name}</h1>
          <h1 className="font-bold">Target: {userData?.incentivePeriod[0]?.target}</h1>
          <h1 className="font-bold">Achieved Target: {userData?.incentivePeriod[0]?.achievedTarget}</h1>
          <h1 className="font-bold">Start of Incentive Period: {formattedStartDate}</h1>
          <h1 className="font-bold">End of Incentive Period: {formattedEndDate}</h1>
        </div>
      </div>

      <div className="mt-4">
        <PlacementTable placementData={placementData} />
      </div>

      {ownedTeams?.map((ownedTeam) => (
        ownedTeam?.incentivePeriod?.map((incentivePeriod) => (
          <div key={incentivePeriod._id} className="mt-4">
            <PlacementTable placementData={incentivePeriod?.placements} />
          </div>
        ))
      ))}

    </div>
  );
};

export default UserDashboard;
