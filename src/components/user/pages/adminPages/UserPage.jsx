// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { BASE_URL } from "../../../../constants/api";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCheck,
//   faCross,
//   faMultiply,
// } from "@fortawesome/free-solid-svg-icons";
// import LevelRanges from "./userPageModules/LevelRanges";
// import { formatDate } from "../../../../utils/helpers/formatDate";
// import EmplyeeStatus from "./userPageModules/EmplyeeStatus";
// import { formatDateForInput } from "../../../../utils/helpers/formatDateforInput";
// import showToast from "../../../../utils/helpers/showToast";

// const UserPage = () => {
//   const { userId } = useParams();
//   const token = useSelector((store) => store.auth?.token?.token);
//   const [userData, setUserData] = useState(null);
//   const [salaryHistory, setSalaryHistory] = useState([]);
//   const [user, setUser] = useState("");
//   const [incentivePeriodtoggle, setIncentivePeriodToggle] = useState(false);
//   const [salrytoggle, setSalaryToggle] = useState(false);
//   const [raiseToggle, setRaiseToggle] = useState(false);
//   const [raiseAmount, setRaiseAmount] = useState();
//   const [changeStartDateToggle, setChangeStartDateToggle] = useState(false);
//   const [raiseDate, setRaiseDate] = useState();
//   const [newStartDate, setNewStartDate] = useState(new Date());
//   const [updateData, setUpdateData] = useState({
//     amount: raiseAmount,
//     startDate: raiseDate,
//   });
//   const [error, setError] = useState('');
//   const [amount, setNewAmount] = useState(0);
//   useEffect(() => {
//     setUpdateData({
//       amount: raiseAmount,
//       startDate: raiseDate,
//     });
//   }, [raiseAmount, raiseDate]);

//   const giveRaise = async () => {
//     if(!raiseDate){
//       setError('Please select a new starting date');
//       return;
//     }
//     if (!raiseAmount) {
//       setError('Please Enter Amount');
//       return;
//   } else if (raiseAmount.length > 16) {
//       setError('Amount should not be more than 16 digits');
//       return;
//   }
  
//     try {
//       const response = await axios.put(
//         `${BASE_URL}update-salary/${userId}`,
//         updateData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response.data);
//       getSalaryHistory();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//     getSalaryHistory();
//   }, [newStartDate]);

//   const getUserData = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}get-incentive-period/${userId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch data. Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Data received:", data);

//       const userDataWithDefaults = data?.incentivePeriodDetails.map(
//         (periodData) => ({
//           ...periodData,
//           incentive: {
//             ...(periodData.incentive || {}),
//             target: periodData.incentive?.target || 0,
//             achievedTarget: periodData.incentive?.achievedTarget || 0,
//           },
//         })
//       );
//       setUser(data);
//       setUserData(userDataWithDefaults);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const getSalaryHistory = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/salariesOfUser/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.data;
//       setSalaryHistory(data);
//       setNewStartDate(data[data.length-1].startDate)
//       console.log(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateStartDateOfSalary = async () => {

    
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/update-start-salary/${userId}`,
//         {
//           startDate: newStartDate,
//           amount: amount,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const data = await response.data;
//       setNewStartDate(null);
//       setChangeStartDateToggle(false);
//       console.log(data);
//     } catch (error) {
//       showToast(error.response.data.message, {
//         duration: 3000,
//         position: "top-center",
//         style: {
//           border: "1px solid ",
//           padding: "4px",
//           color: "white",
//           background: "#FF0000",
//         },
//       });
//       console.log(error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {userData && (
//         <>
//           <h2 className="text-3xl font-bold mb-8 text-center">{user?.name}</h2>
//           <div className="flex flex-wrap -mx-4">
//             <EmplyeeStatus cid={userId} />
//           </div>
//           <div className="flex flex-wrap -mx-4">
//             <LevelRanges cid={userId} />
//           </div>
//           <div className=" flex items-center  justify-center">
//             <button
//               onClick={() => {
//                 setIncentivePeriodToggle(false);
//                 setSalaryToggle((prev) => !prev);
//               }}
//               className=" hover:bg-[#2399D0] bg-[#02131e]  outline outline-1 rounded-md w-auto text-white font-semibold p-2 m-2 "
//             >
//               View Salary History
//             </button>

//             <button
//               onClick={() => {
//                 setSalaryToggle(false);
//                 setIncentivePeriodToggle((prev) => !prev);
//               }}
//               className=" hover:bg-[#2399D0] bg-[#02131e]  outline outline-1 rounded-md w-auto text-white font-semibold p-2 m-2 "
//             >
//               View Incentive Data
//             </button>
//           </div>
//           {salrytoggle && (
///             <>
//               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {salaryHistory.map((salary, index) => (
//                   <div
//                     key={index}
//                     className=" p-6 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex-wrap"
//                   >
//                     <h3 className="text-xl font-semibold mb-4 text-yellow-700">
//                       Salary Period
//                     </h3>
//                     <div className="flex flex-wrap justify-between">
//                       <div>
//                         <span className="text-purple-800 block ">
//                           Start Date
//                         </span>
//                         <span className="text-lg font-semibold">
//                           {formatDate(salary.startDate)}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-purple-800 block  ml-6">
//                           End Date
//                         </span>
//                         <span className="text-lg font-semibold ml-6">
//                           {salary.endDate ? formatDate(salary?.endDate) : "NA"}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <span className="text-purple-800 block">Amount</span>
//                       <span className="text-lg font-semibold text-green-700">
//                         ₹ {salary?.amount || 0}
//                       </span>
//                     </div>
//                     {index === salaryHistory.length - 1 && (
//                       <>
//                         <div className="my-2 flex">
//                           <button
//                             className={`${changeStartDateToggle?'hidden':''} hover:bg-[#2399D0] bg-[#02131e] outline outline-1 rounded-md w-auto text-white font-semibold p-2`}
//                             onClick={() =>
//                               setChangeStartDateToggle((prev) => !prev)
//                             }
//                           >
//                             {!changeStartDateToggle ? "Edit" : "Close"}
//                           </button>

//                           {changeStartDateToggle && (
//                             <div className="flex">
//                               {" "}
//                               <input
//                                 className="border border-black rounded-md p-2  mr-2"
//                                 type="date"
//                                 value={formatDateForInput(newStartDate)}
//                                 onChange={(e) =>
//                                   setNewStartDate(e.target.value)
//                                 }
//                               />
//                               <input
//                                 className="border border-black rounded-md  mx-2 p-2"
//                                 type="number"
//                                 placeholder="Enter Ammount"
//                                 value={amount}
//                                 onChange={(e) => setNewAmount(e.target.value)}
//                               />
//                               <div className="flex justify-center gap-4">
//                                 <button
//                                   onClick={() => updateStartDateOfSalary()}
//                                   className="hover:bg-blue-100 p-2 rounded"
//                                 >
//                                   <FontAwesomeIcon icon={faCheck} />
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     setChangeStartDateToggle((prev) => !prev)
//                                   }
//                                   className="hover:bg-blue-100 p-2 rounded"
//                                 >
//                                   <FontAwesomeIcon icon={faMultiply} />
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-8">
//                 <button
//                   onClick={() => setRaiseToggle((prev) => !prev)}
//                   className="hover:bg-[#2399D0] bg-[#02131e] outline outline-1 rounded-md w-auto text-white font-semibold p-2"
//                 >
//                   Give a Raise
//                 </button>

//                 {raiseToggle && (
//                   <div className="flex flex-col my-2">
//                   <div className="flex">
//                     <input
//                       type="number"
//                       placeholder="₹ 0000000"
//                       value={raiseAmount}
//                       onChange={(e) =>{
//                         setError('')
//                         setRaiseAmount(e.target.value)}}
//                       className="border border-gray-300 rounded-md p-2 mr-4"
//                     />
//                     <input
//                       className="border border-black rounded-md  mx-4 p-1 uppercase"
//                       type="date"
//                       value={raiseDate}
//                       onChange={(e) => {
//                         setError('')
//                         setRaiseDate(e.target.value)}}
                      
//                     />
                    
//                     <div className="flex justify-center gap-4">
//                       <button
//                         onClick={() => giveRaise()}
//                         className="hover:bg-blue-100 p-2 rounded"
//                       >
//                         <FontAwesomeIcon icon={faCheck} />
//                       </button>
//                       <button
//                         onClick={() => setRaiseToggle((prev) => !prev)}
//                         className="hover:bg-blue-100 p-2 rounded"
//                       >
//                         <FontAwesomeIcon icon={faMultiply} />
//                       </button>

//                     </div>
//                     </div>
//                     {error && <p className="text-red-500 text-sm ">{error}</p>}

                    
//                   </div>
                  
//                 )}
//               </div>
//             </>
//           )}

//           {incentivePeriodtoggle && (
//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {userData.map((periodData, index) => (
//                 <div
//                   key={index}
//                   className=" rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out"
//                 >
//                   <h3 className="text-xl font-semibold mb-4 text-yellow-700">
//                     Incentive Period
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <span className="text-purple-800 block">Start Date</span>
//                       <span className="text-lg font-semibold">
//                         {formatDate(
//                           periodData.incentive.incentivePeriod?.startDate
//                         )}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-purple-800 block">End Date</span>
//                       <span className="text-lg font-semibold">
//                         {formatDate(
//                           periodData.incentive.incentivePeriod?.endDate
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <span className="text-purple-800 block">Target</span>
//                       <span className="text-lg font-semibold text-green-700">
//                         ₹ {periodData.incentive.target.toFixed(2) || 0}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-purple-800 block">
//                         Achieved Target
//                       </span>
//                       <span className="text-lg font-semibold text-green-700">
//                         {periodData.incentive.achievedTarget || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <hr className="my-4" />
//                   <h4 className="text-lg font-semibold mb-4 text-yellow-700">
//                     Placements Data
//                   </h4>
//                   <div className="overflow-auto max-h-48">
//                     <table className="w-full">
//                       <thead className="bg-pink-200">
//                         <tr>
//                           <th className="py-2 px-4 text-yellow-800">
//                             Candidate
//                           </th>
//                           <th className="py-2 px-4 text-yellow-800">Client</th>
//                           <th className="py-2 px-4 text-yellow-800">
//                             Date of Joining
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {periodData.placements &&
//                           periodData.placements.map(
//                             (placement, placementIndex) => (
//                               <tr key={placementIndex} className="text-center">
//                                 <td className="py-2 px-4">
//                                   {placement.candidate}
//                                 </td>
//                                 <td className="py-2 px-4">
//                                   {placement.client}
//                                 </td>
//                                 <td className="py-2 px-4">
//                                   {formatDate(placement.dateOfJoining)}
//                                 </td>
//                               </tr>
//                             )
//                           )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default UserPage;

import React, { useState } from "react";
import EmplyeeStatus from "./userPageModules/EmplyeeStatus";
import LevelRanges from "./userPageModules/LevelRanges";
import { useParams } from "react-router-dom";
import SalaryHistory from "./SalaryHistory";
import IncentiveData from "./userPageModules/IncentiveData";

const UserPage = ({ color }) => {
  const [openTab, setOpenTab] = useState(1);
  const [usertoggle, setUSerToggle] = useState(false);
  const { userId } = useParams();

  return (
    <>
      <div className="flex flex-wrap justify-center items-center mt-6 sticky">
        <div className="w-3/2">
          <ul
            className=" flex list-none flex-wrap  pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-[#0A3A2A]"
                    : "text-[#0A3A2A] bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Employee Status
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-[#0A3A2A]"
                    : "text-[#0A3A2A] bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Level Ranges
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 3
                    ? "text-white bg-[#0A3A2A]"
                    : "text-[#0A3A2A] bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Salary History
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 4
                    ? "text-white bg-[#0A3A2A]"
                    : "text-[#0A3A2A] bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Incentive Data
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col  w-[90vw] break-words bg-white mb-6 shadow-lg rounded">
            <div className="px-4  flex-auto">
              <div className="tab-content tab-space relative">
                <div className={openTab === 1 ? "block " : "hidden"} >
                  {/* <div className=" flex w-full  justify-end">
                  <AddPlacementButton/>
                  </div> */}
                  <EmplyeeStatus cid={userId}/>
                  <div className="absolute bottom-0 right-0">
                     {/* <button className=" h-10 w-10">
                        <FontAwesomeIcon icon={faPlusCircle}/>
                     </button> */}
                  </div>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <LevelRanges cid={userId}/>
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <SalaryHistory userId={userId}/>
                </div>
              </div>
              <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                 <IncentiveData userId={userId}/>
        
         </div>    
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;