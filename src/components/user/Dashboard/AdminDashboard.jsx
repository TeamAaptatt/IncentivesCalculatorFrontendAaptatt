import React, { useState } from 'react'
import CreateUserForm from '../modules/adminDashbaordModule/CreateUserForm';
import PlacementTable from '../modules/userDashboardModule/PlacementTable';
import UserList from '../modules/adminDashbaordModule/UserList';

const AdminDashboard = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className='m-4 p-2 flex flex-col items-center '>
      <div>
        <button className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded-md w-44" onClick={()=>setToggle((state)=>!state)}>{toggle===true?'Close':'Create User'}</button>
        </div>
        {toggle && <CreateUserForm/>}
        {/* <PlacementTable/> */}
        <UserList/>
    </div>
  )
}

export default AdminDashboard