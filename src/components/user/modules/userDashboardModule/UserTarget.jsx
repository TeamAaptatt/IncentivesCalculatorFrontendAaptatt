import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../utils/redux/loadSlice/loadSlice";
import showToast from "../../../../utils/helpers/showToast";
import { formatNumberIndianSystem } from "../../../../utils/helpers/formatNumberInIndianSystem";

const UserTarget = ({selectedDate}) => {
  console.log(selectedDate);
    const user = useSelector((state) => state.user.userData?.userData);

  const [cid, setCid] = useState(user?.cid);
  const [error, setError] = useState(false);
  const [incentiveData, setIncentiveData] = useState(null);
  const[incentivePeriod, setIncentivePeriod] = useState()

  const loading = useSelector((state) => state.loader.loading);
  const token = useSelector((state) => state.auth.token.token);
  const [selectedDateRange, setSelectedDateRange] = useState(selectedDate)
  const [targetData, setTargetData] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    if (incentivePeriod) {
      fetchIncentiveData();
    }
    
  }, [incentivePeriod]);
  useEffect(()=>{handleDateRangeChange()}, [selectedDate])
  
  const fetchIncentiveData = async () => {

    setIncentiveData(null);
    dispatch(setLoading(true));
    setCid(user.cid);
    const { startDate, endDate, period} = incentivePeriod;
    try {
      const response = await axios.post(
        BASE_URL + `/target/${user.cid}`,{
          startRange:startDate,
         endRange:endDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIncentiveData(response.data);
      const newData = {
        startDate: startDate,
        endDate: endDate,
        target: response.data.target,
        achievedTarget:response.data.achievedTarget,
        user:response.data.user, 
        period:period
      };
      console.log(response.data);
      if (!targetData.some(data => data.period === period )) {
        setTargetData(prevData => [...prevData, newData]);
      }      
    } catch (error) {
      showToast(error.response?.data.message, {
        duration: 3000,
        position: "top-center",
        style: {
          border: "1px solid ",
          padding: "4px",
          color: "white",
          background: "#FF0000",
        },
      });
      console.error("Error fetching incentive data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const validateCid = (input) => {
    return /^SP\d{1,4}$/.test(input);
  };

  const customUIforIncentiveCycle = ()=>{
    
    
    const [startDateofRange, endDateofRange] = selectedDateRange.split(",");

    const level = user?.levelRanges
    .filter((level) => level.startDate)
    .sort((a, b) => {
      const startDateA = new Date(a.startDate);
      const startDateB = new Date(b.startDate);
      const rangeStartDate = new Date(startDateofRange);
      return Math.abs(startDateA - rangeStartDate) - Math.abs(startDateB - rangeStartDate);
    })[0];
    console.log(level);
    
    if(user){
     console.log(user.cid);
     switch(level.level.level){
       case 'Level 1':
         return (<div className='flex  right-0 w-96  mb-2 absolute gap-2 m-2  justify-end items-end  flex-wrap'>
                       <button
                 type="button"
                 onClick={() => handleQuarterButtonClick(1)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] w-fit"
               >
                 See Target Of Quarter 1
               </button>
               <button
                 type="button"
                 onClick={() => handleQuarterButtonClick(2)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] w-fit"
               >
                 See Target Of Quarter 2
               </button>
               <button
                 type="button"
                 onClick={() => handleQuarterButtonClick(3)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] w-fit"
               >
                 See Target Of Quarter 3
               </button>
               <button
                 type="button"
                 onClick={() => handleQuarterButtonClick(4)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] w-fit"
               >
                 See Target Of Quarter 4
               </button>
 
         </div>);
        case 'Level 2':
         return (<div className='flex  right-0 w-96  mb-2 absolute gap-2 m-2  justify-end items-end  flex-wrap'>
         <button
                 type="button"
                 onClick={() => handleHalfYearButtonClick(1)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] wpink"
               >
               See Target of Half Year 1
               </button>
               <button
                 type="button"
                 onClick={() => handleHalfYearButtonClick(2)}
                 className="bg-[#0a3a2a] text-white p-2 rounded-md hover:bg-[#4d9981] w-fit"
               >
                 See Target Of Half Year 2
               </button>
 
         </div>)
                 case 'Level 3':
                   case 'Level 4':
                   case 'Level 5':
                   case 'Level 6':
                     return (
                      <div className='flex  right-0 w-96  mb-2 absolute gap-2 m-2  justify-end items-end  flex-wrap'>
                         <button
                           type="button"
                           onClick={() => handleYearButtonClick()}
                           className="bg-[#0a3a2a]  text-white p-2 mt-3 w-fit rounded-md hover:bg-[#4d9981] "
                         >
                 See Target
                         </button>
                         </div>
                     );
           
       default:
         return (
           <>
           
           </>
         )    
     }
    }
 }

 const handleQuarterButtonClick = (quarter) => {
  const [startDateofRange, endDateofRange] = selectedDateRange.split(",");
  
  const fiscalYearStart = new Date(new Date(startDateofRange).getFullYear(), 3, 1);
  const currentDate = new Date(startDateofRange);


  if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
    fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
  }

const quarterStartMonth = (quarter - 1) * 3;
const startDate = new Date(fiscalYearStart.getFullYear(), fiscalYearStart.getMonth() + quarterStartMonth, 1);
const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
console.log(startDate, endDate);
setIncentivePeriod({
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  period:`Q${quarter}`
})



};

const handleYearButtonClick = () => {

  const [startDateofRange, endDateofRange] = selectedDateRange.split(",");

  const fiscalYearStart = new Date(new Date(startDateofRange).getFullYear(), 3, 1);
  const currentDate = new Date(startDateofRange);

  if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
    fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
  }

  const startDate = new Date(fiscalYearStart);
  const endDate = new Date(fiscalYearStart.getFullYear() + 1, 2, 31); // March 31 of the next year

  console.log(startDate, endDate);

  
  setIncentivePeriod({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    period:`Yearly`

  })

};

const handleHalfYearButtonClick = (halfYear) => {
  const [startDateofRange, endDateofRange] = selectedDateRange.split(",");

  const fiscalYearStart = new Date(new Date(startDateofRange).getFullYear(), 3, 1);
  const currentDate = new Date(startDateofRange);
;

  if (currentDate < new Date(currentDate.getFullYear(), 2, 31)) {
    fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
  }
  const halfYearStartMonth = halfYear === 1 ? 0 : 6; 
  const startDate = new Date(fiscalYearStart.getFullYear(), fiscalYearStart.getMonth() + halfYearStartMonth, 1);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 6, 0);
console.log(startDate, endDate);
  
  setIncentivePeriod({
    startDate: startDate,
    endDate: endDate,
    period:`H${halfYear}`
  })

};
const handleDateRangeChange = (event) => {
  setTargetData([])
  setSelectedDateRange(selectedDate);
};
 console.log(incentivePeriod);

  return (
    <div className=" mt-2 flex flex-col">
      <div className=" flex  ">
      {/* <div className="mx-4">
      <label
              htmlFor="cid"
              className="block text-sm   ml-28 font-bold text-gray-800"
            >
              Select Year:
            </label>
            <div className=" my-2">
  <select
    className="border border-gray-300 rounded-md px-3 ml-28 py-2 focus:outline-none focus:border-blue-500"
    value={selectedDateRange}
    onChange={handleDateRangeChange}
  >
    <option value="">Select Date Range</option>
    {generateFiscalYearOptions().map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

        </div> */}

           

      </div>
      <div className="w-full flex justify-center flex-col items-center translate-x-[-10rem] mt-2">
        {customUIforIncentiveCycle()}
        </div>

    <div className="   flex flex-col">
      {incentiveData || loading ? (
        <>
          {loading ? (
            <></>
          ) : (
            <div className=" text-center m-2">
            </div>
          )}
        </>
      ) : null}
      <div className="w-full flex justify bg-inherit ">
        <div className="mb-4 flex flex-col">
          

          {/* <button
            disabled={!cid.length}
            className="px-4 w-32 my-4 mx-4 py-2 text-white bg-red-500 rounded-md "
            onClick={customUIforIncentiveCycle}
          >
            Calculate
          </button> */}
        </div>

       

        {incentiveData || loading ? (
          <>
            {loading ? (
              <></>
            ) : (
              <div className=" grid grid-cols-2  w-[60vw] mt-10  ">
                <table className="mx-4 border-collapse  border text-white border-gray-800 ">
              <thead>
                <tr>
                  <th className="border border-gray-800 px-4 py-2 text-left">Period</th>
                  <th className="border border-gray-800 px-4 py-2 text-left">Target</th>
                  <th className="border border-gray-800 px-4 py-2 text-left">Achieved Target</th>
                  <th className="border border-gray-800 px-4 py-2 text-left">Pending</th>
                </tr>
              </thead>
              {targetData?.map((incentiveData)=>{
                return(
              
              <tbody>
                <tr>
                <td className="border border-gray-800 px-4 py-2">
                  {incentiveData?.period}

                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                  ₹{formatNumberIndianSystem(incentiveData.target.toFixed(2))}

                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    ₹{formatNumberIndianSystem(incentiveData.achievedTarget.toFixed(2))}

                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    ₹{formatNumberIndianSystem(incentiveData.target.toFixed(2) - incentiveData.achievedTarget.toFixed(2))}
                  </td>
                </tr>
              </tbody>
                )
              })}
                          </table>

            </div>
            )}
          </>
        ) : null}
      </div>
    </div>
    </div>
  );
};

export default UserTarget;
