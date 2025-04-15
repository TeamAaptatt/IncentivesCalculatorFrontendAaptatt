import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../Loader";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faUserCircle,
  faDatabase,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import AdminProfile from "./AdminProfile";
import ProfileAnalysis from "../modules/userDashboardModule/ProfileAnalysis";
import PlacementDashboard from "../Dashboard/PlacementDashboard";

const UserProfile = () => {
  const user = useSelector((state) => state.user.userData?.userData);
  const [confirmation, setConfirmation] = useState(null);
  const [showUserData, setShowUserData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPlacemnetTable, setShowPlacementTable] = useState(false);
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };
  const isBlocked = useSelector(
    (state) => state?.user?.userData?.userData?.isBlocked
  );

  if (isBlocked) {
    return (
      <div className="w-full flex justify-center">
        <p className="text-red-500 text-xl font-semibold">
          You are not allowed to access this page. Please Contact support for
          further details.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center ">
      <motion.div
        className="flex flex-row   w-full bg-[#060D0A]   "
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className=" bg-[#0a3a2a] w-56 flex flex-col justify-between">
          <div className=" w-full h-screen">
            <button
              className="w-full text-left px-6 py-2 mt-8 text-white font-semibold text-xl hover:bg-[#40826D]"
              onClick={() => {
                setShowPasswordChange(false);
                setShowUserData(true);
                setShowPlacementTable(false);
              }}
            >
              <FontAwesomeIcon icon={faUserCircle} className="mx-2 text-xl" />{" "}
              Profile
            </button>

            <button
              className="w-full text-left px-6 py-2 text-white hover:bg-[#40826D] font-semibold text-xl"
              onClick={() => {
                setShowPlacementTable(true);
                setShowPasswordChange(false);
                setShowUserData(false);
              }}
            >
              <FontAwesomeIcon icon={faDatabase} className=" mx-2 text-xl" />{" "}
              Placements
            </button>
            <button
              className="w-full text-left px-6 py-2 text-white hover:bg-[#40826D] font-medium text-xl"
              onClick={() => setShowPasswordChange(true)}
            >
              <FontAwesomeIcon icon={faGear} className="mx-2 text-xl" /> Setting
            </button>
          </div>
        </div>

        <div className="flex-grow">
          {loading && <Loader />}

          <h2 className="text-2xl text-black font-semibold mb-4"></h2>
          {showPasswordChange && (
            <div className=" w-[80vw] justify-center items-center">
              <AdminProfile />
            </div>
          )}

          {showUserData && (
            <div className=" flex flex-1 flex-col justify-center items-center ">
              <ProfileAnalysis />
            </div>
          )}

          {showPlacemnetTable && <PlacementDashboard />}

          {confirmation && (
            <p className="text-green-500 mt-4">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              {confirmation}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
