import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../../constants/api";

const PlacementTable = () => {
  const [placementData, setPlacementData] = useState([]);
  const dataFields = [
    "status",
    "candidate",
    "client",
    "dateOfJoining",
    "cnadidateOwner",
    "accountManager",
    "accountHead",
    "pandLhead",
    "resumeSource",
    "billableSalary",
    "commercial",
    "fee",
    "sendOff",
    "securityPeriod",
    "paymentStaus",
  ];
 const userId = useSelector(state=> state.user?.userData?.userData?._id);
 console.log(userId,"userId");
 
 const token = useSelector((store)=>store.auth.token?.token) || '';
 useEffect(() => {
  placementDataofUser();
}, );

const placementDataofUser = async () => {
  try {
    if(token!==''){
    const response = await axios.get(BASE_URL + `placements/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    const resData = response.data;  // Extract data from the response
    console.log(resData);
    setPlacementData(resData.placements);
  }
  } catch (err) {
    console.log("Error in getting the user's placement data", err);
  }
}

  return (
    <div className="relative my-5">
      <div className="overflow-x-auto max-w-screen-xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {dataFields.map((field, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {placementData?.map((placement, index) => (
              <tr key={index}>
                {dataFields.map((field, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    {field === "accountManager" ? `${placement[field].name}` :
                      field === "cnadidateOwner" ? `${placement[field].name}` :
                      field === "pandLhead" ? `${placement[field].name}` :
                      field === "dateOfJoining" ? new Date(placement[field]).toLocaleDateString() :
                      field === "accountHead" ? `${placement[field].name}` :
                      placement[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementTable;



// import React from 'react';

// const PlacementTable = () => {
//   const fixedFields = [
//     'Status',
//     'Candidate',
//     'Client',
//     'DateOfJoining',
//   ];

//   const otherFields = [
//     'CandidateOwner',
//     'AccountManager',
//     'AccountHead',
//     'P&L Head',
//     'ResumeSource',
//     'BillableSalary',
//     'Commercial',
//     'Fee',
//     'SendOff',
//     'SecurityPeriod',
//     'PaymentStatus',
//   ];

//   return (
//     <div className='relative'>
//       <div className='overflow-x-auto max-w-screen-xl mx-auto'>
//         <table className='min-w-full divide-y divide-gray-200'>
//           <thead className='bg-gray-50'>
//             <tr>
//             <div className='sticky left-0 px-6 py-3 bg-gray-50 flex '>

//               {fixedFields.map((field, index) => (
//                   <th key={index} className={`flex bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider `}>
//                   {field}
//                 </th>

//               ))}
//              </div>

//               {otherFields.map((field, index) => (
//                 <th key={index + fixedFields.length} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   {field}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             <tr>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//                 <td>Aalo</td>
//             </tr>
//          </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PlacementTable;
