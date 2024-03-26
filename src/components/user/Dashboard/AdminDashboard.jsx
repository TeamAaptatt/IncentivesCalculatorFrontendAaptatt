import React, { useState } from 'react'
import CreateUserForm from '../modules/adminDashbaordModule/CreateUserForm';
import PlacementTable from '../modules/userDashboardModule/PlacementTable';
import UserList from '../modules/adminDashbaordModule/UserList';
import AdminPlacementTable from '../modules/adminDashbaordModule/AdminPlacementTable';
import OwnerShipTable from '../modules/adminDashbaordModule/OwnerShipTable';
import AddPlacementButton from '../modules/adminDashbaordModule/AddPlacementButton';
import IncentiveCalculator from '../modules/adminDashbaordModule/IncentiveCalculator';
import AddIncentivePeriod from '../modules/adminDashbaordModule/AddIncentivePeriod';

const AdminDashboard = () => {
  const [toggle, setToggle] = useState(false);
  const [usertoggle, setUSerToggle] = useState(false);
  const [creatIncentive, setCreateIncentive] = useState(false);

  const toggleCreateIncentive = () => {
    setCreateIncentive((prevState) => !prevState);
  };

  const toggleForm = () => {
    setToggle((prevState) => !prevState);
  };

  return (
    <div className='m-4 p-2 flex flex-col items-center'>
      <h2 className='text-4xl m-2 uppercase font-bold'>Placement Table</h2>
      <AdminPlacementTable />
      <AddPlacementButton />
      <OwnerShipTable />
      <IncentiveCalculator />

      <div>
        <button className="bg-black m-4 hover:bg-blue-400 text-white px-4 py-2 rounded-md w-44"
          onClick={() => setCreateIncentive((state) => !state)}>
          {creatIncentive === true ? 'Close' : 'Create Incentive'}
        </button>
        {creatIncentive && <AddIncentivePeriod handleClose={toggleCreateIncentive} />}

        <button className="bg-black m-4 hover:bg-blue-400 text-white px-4 py-2 rounded-md w-44" onClick={() => setUSerToggle((state) => !state)}>{usertoggle === true ? 'Close' : 'All Users'}</button>
        {usertoggle && <UserList />}
        {/* <button className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded-md w-44" onClick={() => setToggle((state) => !state)}>{toggle === true ? 'Close' : 'Create User'}</button>
        {toggle && <CreateUserForm />} */}
        <button className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded-md w-44" onClick={() => setToggle((state) => !state)}>{toggle === true ? 'Close' : 'Create User'}
        </button>
        {toggle && <CreateUserForm handleClose={toggleForm} />}
      </div>

    </div>
  )
}

export default AdminDashboard