import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../../utils/helpers/formatDate";
import { formatDateForInput } from "../../../../../utils/helpers/formatDateforInput";
import { BASE_URL } from "../../../../../constants/api";

const IncentiveData = ({userId}) => {
  const token = useSelector((store) => store.auth?.token?.token);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserData();
  }, [userId]);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incentive-period/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    

      const data = await response.data;
      console.log("Data received:", data);

      const userDataWithDefaults = data?.incentivePeriodDetails.map(
        (periodData) => ({
          ...periodData,
          incentive: {
            ...(periodData.incentive || {}),
            target: periodData.incentive?.target || 0,
            achievedTarget: periodData.incentive?.achievedTarget || 0,
          },
        })
      );
      setUserData(userDataWithDefaults);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap gap-8 justify-center m-2">
                  {userData.map((periodData, index) => (
                    <div
                      key={index}
                      className=" rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out"
                    >
                      <h3 className="text-xl font-semibold mb-4 text-yellow-700">
                        Incentive Period
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-purple-800 block">Start Date</span>
                          <span className="text-lg font-semibold">
                            {formatDate(
                              periodData.incentive.incentivePeriod?.startDate
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-800 block">End Date</span>
                          <span className="text-lg font-semibold">
                            {formatDate(
                              periodData.incentive.incentivePeriod?.endDate
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-purple-800 block">Target</span>
                          <span className="text-lg font-semibold text-green-700">
                            ₹ {periodData.incentive.target.toFixed(2) || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-800 block">
                            Achieved Target
                          </span>
                          <span className="text-lg font-semibold text-green-700">
                            {periodData.incentive.achievedTarget || 0}
                          </span>
                        </div>
                      </div>
                      <hr className="my-4" />
                      <h4 className="text-lg font-semibold mb-4 text-yellow-700">
                        Placements Data
                      </h4>
                      <div className="overflow-auto max-h-48">
                        <table className="w-full">
                          <thead className="bg-pink-200">
                            <tr>
                              <th className="py-2 px-4 text-yellow-800">
                                Candidate
                              </th>
                              <th className="py-2 px-4 text-yellow-800">Client</th>
                              <th className="py-2 px-4 text-yellow-800">
                                Date of Joining
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {periodData.placements &&
                              periodData.placements.map(
                                (placement, placementIndex) => (
                                  <tr key={placementIndex} className="text-center">
                                    <td className="py-2 px-4">
                                      {placement.candidate}
                                    </td>
                                    <td className="py-2 px-4">
                                      {placement.client}
                                    </td>
                                    <td className="py-2 px-4">
                                      {formatDate(placement.dateOfJoining)}
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
    
  );
};

export default IncentiveData;
