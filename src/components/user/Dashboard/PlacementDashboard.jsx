import React, { useEffect, useState } from "react";
import PlacementTable from "../modules/userDashboardModule/PlacementTable";
import useUserDetails from "../../Auth/useUserDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { generateFiscalYearOptions } from "../../../utils/helpers/genereateDateRange";

const PlacementDashboard = () => {
  const [placementData, setPlacementData] = useState([]);

  const userId = useSelector((state) => state.user?.userData?.userData?._id);
  console.log(userId, "userId");
  const [selectedDateRange, setSelectedDateRange] = useState(
    generateFiscalYearOptions().slice(-1)[0].value
  );

  const token = useSelector((store) => store.auth.token?.token) || "";
  useEffect(() => {
    placementDataofUser();
  }, [userId, selectedDateRange]);

  // useEffect(()=>{
  //   placementDataofUser();
  // }, [selectedDateRange])
  const placementDataofUser = async () => {
    const [startDate, endDate] = selectedDateRange.split(",");

    try {
      const response = await axios.post(
        BASE_URL + `placements-test/${userId}`,
        {
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = response.data;
      console.log("r", resData.placements);
      setPlacementData(resData.placements);
    } catch (err) {
      console.log("Error in getting the user's placement data", err);
    }
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  return (
    <div className="text-center min-h-screen ">
      <h1 className="text-center text-3xl font-bold mb-4 uppercase text-white">
        My Placements
      </h1>

      <div className="p-2  flex flex-col justify-start items-start">
        <select
          value={selectedDateRange}
          onChange={handleDateRangeChange}
          className=" border-2 m-4 bg-inherit text-white border-[#0a3a2a] p-2 rounded "
        >
          <option className="bg-[#0a3a2a] text-white" value="">
            Choose Year
          </option>
          {generateFiscalYearOptions().map((option) => (
            <option
              className="bg-[#0a3a2a] text-white"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <PlacementTable placementData={placementData} />
      </div>

      {/* { ownedTeams?.map((ownedTeam) => (
    ownedTeam?.incentivePeriod?.map((incentivePeriod) => (
      <PlacementTable key={incentivePeriod._id} placementData={incentivePeriod?.placements} />
    ))
  ))
    } */}
    </div>
  );
};

export default PlacementDashboard;
