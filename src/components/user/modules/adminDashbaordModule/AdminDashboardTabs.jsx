import React, { useState } from "react";
import PlacementTable from "../userDashboardModule/PlacementTable";
import OwnerShipTable from "./OwnerShipTable";
import IncentiveCalculator from "./IncentiveCalculator";
import AdminPlacementTable from "./AdminPlacementTable";
import CreateUserForm from "./CreateUserForm";
import UserCard from "./UserCard";
import UserList from "./UserList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import AddPlacementButton from "./AddPlacementButton";


const AdminDashboardTabs = ({ color }) => {
  const [openTab, setOpenTab] = React.useState(1);
  const [usertoggle, setUSerToggle] = useState(false);

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className=" flex list-none flex-wrap  pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-pink-600 "
                    : "text-pink-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Placement Table
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-pink-600"
                    : "text-pink-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Ownership Table
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 3
                    ? "text-white bg-pink-600"
                    : "text-pink-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Incentive Calculator
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 4
                    ? "text-white bg-pink-600"
                    : "text-pink-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Users
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col  w-[90vw] break-words bg-white mb-6 shadow-lg rounded">
            <div className="px-4  flex-auto">
              <div className="tab-content tab-space relative">
                <div className={openTab === 1 ? "block " : "hidden"} id="link1">
                  {/* <div className=" flex w-full  justify-end">
                  <AddPlacementButton/>
                  </div> */}
                  <AdminPlacementTable/>
                  <div className="absolute bottom-0 right-0">
                     {/* <button className=" h-10 w-10">
                        <FontAwesomeIcon icon={faPlusCircle}/>
                     </button> */}
                  </div>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <OwnerShipTable/>
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <IncentiveCalculator/>                </div>
              </div>
              <div className={openTab === 4 ? "block" : "hidden"} id="link4">
     
        
         <UserList />
         </div>    
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardTabs;