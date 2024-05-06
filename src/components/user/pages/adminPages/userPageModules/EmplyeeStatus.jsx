import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../../constants/api";
import { useSelector } from "react-redux";
import { formatDateForInput } from "../../../../../utils/helpers/formatDateforInput";
import { formatDate } from "../../../../../utils/helpers/formatDate";
import showToast from "../../../../../utils/helpers/showToast";

const EmplyeeStatus = ({ cid }) => {
  const token = useSelector((store) => store.auth?.token?.token);
  const [reporting, setReporting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [endDate, setEndDate] = useState();
  const [error, setError] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    getLatestReporing();
    getStatusOfEmployee();
    
  }, []);

  const blockUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/block-user/${cid}`,
        null, // No data payload
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      setIsBlocked(await response.data);
    } catch (error) {
      console.log(error);
    }
  }
  

  const getLatestReporing = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/latest-reporting/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
      },);

      const data = response.data;
      setReporting(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusOfEmployee = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-termination-date/${cid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.data;
      setStatusData(data);
      console.log(data);
      if (data.status === "Left") {
        setToggle(false);
      }
      console.log(data.isBlocked);
      setIsBlocked(data.isBlocked)

    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (reporting && !endDate) {
        setError("End date is required.");
        return;
      }

      // Check if status has changed
      if (isActive) {
        setError("Status has not changed.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/updated-endDate/${cid}`,
        {
          id: reporting?._id,
          endDate: endDate,
          status: isActive ? "Active" : "Left",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getLatestReporing();
      getStatusOfEmployee();

    } catch (error) {
      showToast(error.data.message, {
        duration: 3000,
        position: 'top-center', 
        style: {
          border: '1px solid ',
          padding: '4px',
          color: 'white',
          background: '#FF0000',
          
        },
      })
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex relative w-full  justify-center">
        <div className="  mx-8 my-8  w-2/4 relative h-64  cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
        <div className="flex mt-2">
                <span className="mx-6  text-lg  font-medium block uppercase ">
                  {" "}
                  CID
                </span>
                <h2 className=" ml-28 text-purple-800   text-lg  font-medium block uppercase  ">
                 {""} {cid}
                </h2>
              </div>
          <div className="flex mt-6  ">
            <span className="font-medium uppercase text-lg mx-6">
              Change Status{" "}
            </span>
            
            <label className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                disabled={statusData?.status === "Left"}
                checked={isActive}
                onChange={() => setIsActive((prev) => !prev)}
                className="opacity-0 w-0 h-0 "
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out ${
                  !statusData?.status === "Left" ? " bg-pink-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                    isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </span>
            </label>
            <span className=" font-medium ml-6 mr-12">
              {isActive ? "Active" : "Left"}
            </span>
          </div>
          {toggle  ? (
            <>
              <div className="flex mt-2">
                <span className="mx-6  text-lg  font-medium block uppercase ">
                  {" "}
                  Reporting To{" "}
                </span>
                <h2 className=" mx-4 text-purple-800   text-lg  font-medium block uppercase  ">
                  {reporting?.reportingTo?.name}
                </h2>
              </div>
              <div className=" flex mt-2 ">
                <span className="mx-6  uppercase font-medium text-lg">
                  {" "}
                  From{" "}
                </span>
                <h1                   className="font-medium  ml-[5.5rem]"
>                  
                  {formatDate(reporting?.startDate)}
                  </h1>
              </div>
              <div className="flex gap-2 mt-2">
                <span className=" mx-6  text-lg  font-medium block uppercase">
                  End Date
                </span>
                <input
                  type="date"
                  className=" text-black  border p-2 uppercase rounded ml-10"
                  value={formatDateForInput(endDate)}
                  onChange={(e) => {
                    setError("");
                    setEndDate(e.target.value);
                  }}
                />
              </div>
              {error && <p className="text-red-500 text-sm mx-6">{error}</p>}

              <button
                className="hover:bg-pink-700 bg-pink-600 bottom-0 right-0 absolute  outline outline-1 rounded-md w-auto text-white font-semibold p-2 m-2 "
                onClick={() => handleUpdate()}
              >
                Terminate
              </button>
            </>
          ) : (
            <div className="flex">
            <div>
                <h2 className="flex mt-6">
                <span className="mx-6 block uppercase font-medium text-sm">
                  {" "}
                  This employee was terminated on{" "}
                  {formatDate(statusData?.statuschangedate)}
                </span>
                
              </h2>
              </div>
              <div>
                  <button
                  onClick={blockUser}
                  className={`${isBlocked?'hover:bg-green-700 bg-green-600 ':'hover:bg-red-700 bg-red-600 '} p-4  w-24 text-white  rounded-2xl border-2`}

                  > {isBlocked? "Unblock": "Block"}</button>

              </div>



            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmplyeeStatus;
