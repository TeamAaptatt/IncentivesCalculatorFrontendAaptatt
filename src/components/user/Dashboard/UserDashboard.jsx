import React, { useEffect } from 'react'
import PlacementTable from '../modules/userDashboardModule/PlacementTable'
import useUserDetails from '../../Auth/useUserDetails'
import { useSelector } from 'react-redux'

const UserDashboard = () => {
   const {getUserDetails} = useUserDetails()
   const userData = useSelector(state=>state.user.userData.userData)
  return (
    <div className=' text-center'>
    <h1>Hello {userData.name} </h1>  
    <PlacementTable/>
    </div>
  )
}

export default UserDashboard