import React, { useEffect, useState } from 'react'
import PlacementTable from '../modules/userDashboardModule/PlacementTable'
import useUserDetails from '../../Auth/useUserDetails'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../../constants/api'

const UserDashboard = () => {
   const {getUserDetails} = useUserDetails()
   const [placementData, setPlacementData] = useState([]);

   const userData = useSelector(state=>state.user.userData.userData)
   const userData1 = useSelector(state=>state.user.userData)
   const userId = useSelector(state=> state.user?.userData?.userData?._id);
   const ownedTeams = useSelector(state=>state.user.userData?.userData?.ownedTeam);
 console.log(userId,"userId");
 
 const token = useSelector((store)=>store.auth.token?.token) || '';
 useEffect(() => {
  placementDataofUser();
}, [userId]);

const placementDataofUser = async () => {
  try {
    const response = await axios.get(BASE_URL + `placements-test/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    const resData = response.data;  // Extract data from the response
    console.log('r', resData.placements);
    setPlacementData(resData.placements);
  } catch (err) {
    console.log("Error in getting the user's placement data", err);
  }
}

  return (
    <div className='text-center'>
   
    <div className=' m-2  border border-red-600 rounded  h-44 '>
    <h1>Hello {userData?.name} </h1> 
    <h1>Target:{userData?.incentivePeriod[0]?.target}</h1> 
    <h1>Achieved Target:{userData?.incentivePeriod[0]?.achievedTarget}</h1> 
    <h1>Start of Incentive Period:{new Date(userData?.incentivePeriod[0]?.incentivePeriod.startDate).toLocaleDateString()}</h1> 
    <h1>End of Incentive Period:{new Date(userData?.incentivePeriod[0]?.incentivePeriod.endDate).toLocaleDateString()}</h1> 

    </div>
    <PlacementTable placementData={placementData} />
    
 {/* { ownedTeams?.map((ownedTeam) => (
    ownedTeam?.incentivePeriod?.map((incentivePeriod) => (
      <PlacementTable key={incentivePeriod._id} placementData={incentivePeriod?.placements} />
    ))
  ))
    } */}



    
    </div>
  )
}

export default UserDashboard