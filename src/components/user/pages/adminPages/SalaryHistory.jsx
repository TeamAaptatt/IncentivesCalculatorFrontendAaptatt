import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../../constants/api";
import showToast from "../../../../utils/helpers/showToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faMultiply } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../../utils/helpers/formatDate";
import { formatDateForInput } from "../../../../utils/helpers/formatDateforInput";

const SalaryHistory = ({userId}) => {
  const token = useSelector((store) => store.auth?.token?.token);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [changeStartDateToggle, setChangeStartDateToggle] = useState(false);
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [error, setError] = useState('');
  const [raiseToggle, setRaiseToggle] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState();
  const [raiseDate, setRaiseDate] = useState();
  const [updateData, setUpdateData] = useState({
        amount: raiseAmount,
        startDate: raiseDate,
      });

    const [amount, setNewAmount] = useState(0);
    


  useEffect(() => {
    getSalaryHistory();
  }, []);

  const giveRaise = async () => {
    if(!raiseDate){
      setError('Please select a new starting date');
      return;
    }
    if (!raiseAmount) {
      setError('Please Enter Amount');
      return;
  } else if (raiseAmount.length > 16 || raiseAmount.length<=3) {
      setError('Please Enter Vald Amount');
      return;
  }
  
    try {
      const response = await axios.put(
        `${BASE_URL}update-salary/${userId}`,
        {
          startDate:raiseDate,
          amount:raiseAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      getSalaryHistory();
    } catch (err) {
      console.log(err);
    }
  };


  const getSalaryHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/salariesOfUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setSalaryHistory(data);
      setNewStartDate(data[data.length-1].startDate);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStartDateOfSalary = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update-start-salary/${userId}`,
        {
          startDate: newStartDate,
          amount: amount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.data;
      setNewStartDate(null);
      setChangeStartDateToggle(false);
      console.log(data);
    } catch (error) {
      showToast(error.response.data.message, {
        duration: 3000,
        position: "top-center",
        style: {
          border: "1px solid ",
          padding: "4px",
          color: "white",
          background: "#FF0000",
        },
      });
      console.log(error);
    }
  };

  return (
                <>
                  <div className=" w-full flex justify-end">
                <div className="mt-8">
                <button
                  onClick={() => setRaiseToggle((prev) => !prev)}
                  className="hover:bg-[#4D9981] bg-[#0A3A2A] outline outline-1 rounded-md  text-white font-semibold p-2"
                >
                  Give a Raise
                </button>

                {raiseToggle && (
                  <div className=" my-2 absolute translate-x-[-8.2rem] border p-2 bg-white shadow-md z-40">
                  <div className=" ">
                    <input
                      type="number"
                      placeholder="₹ 0000000"
                      value={raiseAmount}
                      onChange={(e) =>{
                        setError('')
                        setRaiseAmount(e.target.value)}}
                      className="border border-gray-300 rounded-md p-2 mr-4"
                    />
                                      <div className="flex ">

                    <input
                      className="border border-black rounded-md  mt-2 mr-2 p-1 uppercase"
                      type="date"
                      value={raiseDate}
                      onChange={(e) => {
                        setError('')
                        setRaiseDate(e.target.value)}}
                      
                    />
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => giveRaise()}
                        className="hover:bg-blue-100 p-2 rounded"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => setRaiseToggle((prev) => !prev)}
                        className="hover:bg-blue-100 p-2 rounded"
                      >
                        <FontAwesomeIcon icon={faMultiply} />
                      </button>

                    </div>
                    </div>

                    </div>
                    {error && <p className="text-red-500 text-sm ">{error}</p>}

                    
                  </div>
                  
                )}
              </div>
                </div>
              <div className="flex flex-1 gap-8 m-4 justify-center">
               
                {salaryHistory.map((salary, index) => (
                  <div
                    key={index}
                    className="  w-fit min-w-96 p-6 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex-wrap"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-yellow-700">
                      Salary Period
                    </h3>
                    <div className="flex flex-wrap justify-between">
                      <div>
                        <span className="text-purple-800 block ">
                          Start Date
                        </span>
                        <span className="text-lg font-semibold">
                          {salary.salaryStartdate?formatDate(salary.salaryStartdate):formatDate(salary.startDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-800 block  ml-6">
                          End Date
                        </span>
                        <span className="text-lg font-semibold ml-6">
                          {salary.endDate ? formatDate(salary?.endDate) : "NA"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-purple-800 block">Amount</span>
                      <span className="text-lg font-semibold text-green-700">
                        ₹ {salary?.amount || 0}
                      </span>
                    </div>
                    {index === salaryHistory.length - 1 && (
                      <>
                        <div className="my-2 flex">
                          <button
                            className={`${changeStartDateToggle?'hidden':''} hover:bg-[#4D9981] bg-[#0A3A2A] outline outline-1 rounded-md w-auto text-white font-semibold p-2`}
                            onClick={() =>
                              setChangeStartDateToggle((prev) => !prev)
                            }
                          >
                            {!changeStartDateToggle ? "Edit"  : "Close"}
                            <FontAwesomeIcon icon={faEdit} className="ml-4"/>
                          </button>

                          {changeStartDateToggle && (
                            <div className="flex">
                              {" "}
                              <input
                                className="border border-black rounded-md p-2  mr-2"
                                type="date"
                                value={formatDateForInput(newStartDate)}
                                onChange={(e) =>
                                  setNewStartDate(e.target.value)
                                }
                              />
                              <input
                                className="border border-black rounded-md  mx-2 p-2"
                                type="number"
                                placeholder="Enter Ammount"
                                value={amount}
                                onChange={(e) => setNewAmount(e.target.value)}
                              />
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={() => updateStartDateOfSalary()}
                                  className="hover:bg-blue-100 p-2 rounded"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button
                                  onClick={() =>
                                    setChangeStartDateToggle((prev) => !prev)
                                  }
                                  className="hover:bg-blue-100 p-2 rounded"
                                >
                                  <FontAwesomeIcon icon={faMultiply} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
          
            </>
  );
};

export default SalaryHistory;
