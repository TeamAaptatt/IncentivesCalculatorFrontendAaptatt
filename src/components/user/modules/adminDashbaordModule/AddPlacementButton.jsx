import React, { useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import useUserManagement from "../../../../utils/hooks/useUserMangement";
import { setLoading } from "../../../../utils/redux/loadSlice/loadSlice";
import showToast from "../../../../utils/helpers/showToast";
import { validateFormData } from "../../../../utils/helpers/validationHelpers";

const AddPlacementButton = ({ getAllPlacements }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: 'Offered',
    candidate: "",
    client: "",
    offeredPosition: "",
    offeredDate:"",
    dateOfJoining: "",
    cnadidateOwner: "",
    accountManager: "",
    accountHead: "",
    pandLhead: "",
    resumeSource: "",
    billableSalary: "",
    commercial: "",
    fee: "",
    // sendOff: "",
    securityPeriod: "On-Going",
    paymentStaus: "Pending",
  });
  const [errors, setErrors] = useState({});
  const token = useSelector((state) => state.auth.token.token);
  const { users, filteredUsers, usersAboveFour } = useUserManagement();

  const [candidateOwner, setCandidateOwner] = useState(null);
  const [accountManager, setAccountManager] = useState(null);
  const [accountHead, setAccountHead] = useState(null);
  const [pandLhead, setPandLHead] = useState(null);
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      cnadidateOwner: candidateOwner,
      accountManager: accountManager,
      accountHead: accountHead,
      pandLhead: pandLhead,
    };

    const newErrors = validateFormData(updatedFormData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(updatedFormData);

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        BASE_URL + "add-placement",
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Placement created successfully ", {
        duration: 3000,
        position: "top-center",
        style: {
          border: "1px solid ",
          padding: "4px",
          color: "white",
          background: "#00FF00",
        },
      });
      await getAllPlacements();
      setIsModalOpen(false);

      setFormData({
        status: 'Offered',
        candidate: "",
        client: "",
        offeredPosition: "",
        offeredDate:"",
        dateOfJoining: "",
        cnadidateOwner: "",
        accountManager: "",
        accountHead: "",
        pandLhead: "",
        resumeSource: "",
        billableSalary: "",
        commercial: "",
        fee: "",
        // sendOff: "",
        securityPeriod: "On-Going",
        paymentStaus: "Pending",
      });
    } catch (error) {
      showToast(error.response?.data?.error, {
        duration: 3000,
        position: "top-center",
        style: {
          border: "1px solid ",
          padding: "4px",
          color: "white",
          background: "#FF0000",
        },
      });
      console.error("Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleCandidateOwnerChange = (selectedOption) => {
    setCandidateOwner(selectedOption.value);
    setErrors((prevErrors) => ({ ...prevErrors, cnadidateOwner: "" }));
  };

  const handleAccountManagerChange = (selectedOption) => {
    setAccountManager(selectedOption.value);
    setErrors((prevErrors) => ({ ...prevErrors, accountManager: "" }));
  };

  const handleAccountHeadChange = (selectedOption) => {
    setAccountHead(selectedOption.value);
    setErrors((prevErrors) => ({ ...prevErrors, accountHead: "" }));
  };

  const handlePandLHeadChange = (selectedOption) => {
    setPandLHead(selectedOption.value);
    setErrors((prevErrors) => ({ ...prevErrors, pandLhead: "" }));
  };
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const strictFilter = (option, rawInput) => {
    const inputValue = rawInput.trim().toLowerCase();
    const optionLabel = option.label.toLowerCase();

    return optionLabel.startsWith(inputValue);
  };

  

  return (
    <div className=" z-20">
      <button
        onClick={() => setIsModalOpen(true)}
        className=" bg-[#0A3A2A] hover:bg-[#4D9981] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Add Placement
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0  flex items-center justify-center bg-gray-500 bg-opacity-50 "
          onClick={handleOutsideClick}
        >
          <div className="bg-white w-full md:max-w-[60rem] p-4 md:p-8 rounded-md shadow-lg overflow-y-auto min-h-screen">
            <h2 className="text-xl md:text-2xl font-bold mb-4 mt-20 text-[#0A3A2A]">
              Add Placement
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap gap-6 uppercase"
            >
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key==='cnadidateOwner'?'Candidate Owner':key==='paymentStaus'?'Payment Status':key.replace(/([a-z])([A-Z])/g, "$1 $2")}:
                  </label>
                  {key === "dateOfJoining"||key==='offeredDate' ? (
                    <input
                      type="date"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500 uppercase"
                    />
                  ) : key === "securityPeriod" || key === "paymentStaus"||key==="status" ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    >
                      {key === "securityPeriod"
                        ? ["On-Going", "Completed", "Send-Off"].map(
                            (option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            )
                          )
                        :key==="paymentStaus"? [
                            "Pending",
                            "Received",
                            "Adjusted",
                            "Returning",
                            "Compromised",
                          ].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          )):["Offered","Joined", "Send-Off", "Back Out" ].map((option)=>(
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  ) : key === "cnadidateOwner" ? (
                    <Select
                      options={users?.map((user) => ({
                        value: user._id,
                        label: user.name,
                      }))}
                      onChange={handleCandidateOwnerChange}
                      value={
                        candidateOwner
                          ? {
                              value: candidateOwner,
                              label: users.find(
                                (user) => user._id === candidateOwner
                              ).name,
                            }
                          : null
                      }
                      className="w-full"
                      placeholder="Search Candidate Owner"
                      filterOption={strictFilter}
                    />
                  ) : key === "accountManager" ? (
                    <Select
                      options={filteredUsers?.map((user) => ({
                        value: user._id,
                        label: user.name,
                      }))}
                      onChange={handleAccountManagerChange}
                      value={
                        accountManager
                          ? {
                              value: accountManager,
                              label: users.find(
                                (user) => user._id === accountManager
                              ).name,
                            }
                          : null
                      }
                      className="w-full"
                      placeholder="Search Account Manager"
                      filterOption={strictFilter}
                    />
                  ) : key === "accountHead" ? (
                    <Select
                      options={filteredUsers?.map((user) => ({
                        value: user._id,
                        label: user.name,
                      }))}
                      onChange={handleAccountHeadChange}
                      value={
                        accountHead
                          ? {
                              value: accountHead,
                              label: users.find(
                                (user) => user._id === accountHead
                              ).name,
                            }
                          : null
                      }
                      className="w-full"
                      placeholder="Search Account Head"
                      filterOption={strictFilter}
                    />
                  ) : key === "pandLhead" ? (
                    <Select
                      options={usersAboveFour?.map((user) => ({
                        value: user._id,
                        label: user.name,
                      }))}
                      onChange={handlePandLHeadChange}
                      value={
                        pandLhead
                          ? {
                              value: pandLhead,
                              label: users.find(
                                (user) => user._id === pandLhead
                              ).name,
                            }
                          : null
                      }
                      className="w-full"
                      placeholder="Search P&L Head"
                      filterOption={strictFilter}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                  )}
                  {errors[key] && (
                    <p className="text-red-500 text-xs lowercase">{`*${errors[key]}`}</p>
                  )}
                </div>
              ))}

              <div className="m-8 flex justify-center items-center w-full gap-4">
                <button
                  type="submit"
                  className="bg-[#0A3A2A] hover:bg-[#4D9981] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#0A3A2A] hover:bg-[#4D9981] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlacementButton;
