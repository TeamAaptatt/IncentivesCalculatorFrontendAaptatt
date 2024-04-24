import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faExchange,
  faMultiply,
  faPlusCircle,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import CreateReporting from "./TransferReporting";
import TransferReporting from "./TransferReporting";
import NewReporting from "./NewReporting";
import { setLoading } from "../../../../utils/redux/loadSlice/loadSlice";
import { generateFiscalYearOptions } from "../../../../utils/helpers/genereateDateRange";

const OwnerShipTable = () => {
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [updateUserId, setUpdateUserId] = useState(null);
  const [designations, setDesignations] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [reportings, setReportings] = useState(null);
  const [createReportingToggle, setCreateReprtingToggle] = useState(false);
  const [transferReportingToggle, setTransferReprtingToggle] = useState(false);
  const [salaryValue, setSalaryValue] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReporting, setFilterdReporting] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(generateFiscalYearOptions().slice(-1)[0].value);
  const [searchBy, setSearchBy] = useState(null);

  const tableHeadNames = [
    "Employee Status",
    "Emoployee Name",
    // "Emp. ID ",
    "Level Of Job",
    "Designation",
    "Assigned Role Category",
    "Reporting To",
    "Start Date",
    "End Date",
    "Skip Level Manager",
    "Fixed Yearly Salary",
    "Update",
  ];
  const tableFields = [
    "status",
    "name",
    // "cid",
    "levelRanges",
    "designation",
    "assignedRole",
    "reportingTo",
    "startDate",
    "endDate",
    "skip",
    "salary",
  ];

  const token = useSelector((state) => state.auth.token.token);
  useEffect(() => {
    
    // getAllUsers();
    getAllReportings();
    getAllLevels();
    getAllDesignations();
    getAllAssignedRoles();
  }, [selectedDateRange]);
  //ALL USERS
  // const getAllUsers = async () => {
  //   try {
  //     const response = await axios.get(BASE_URL + "/get-all-users", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.data;
  //     setUsers(data);
  //     console.log("Users:", data);
  //   } catch (err) {
  //     // console.log(err);
  //   }
  // };

  //GET ALL LEVELS
  const dispatch = useDispatch();
  const getAllReportings = async () => {
    const [startDate, endDate] = selectedDateRange.split(",");
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${BASE_URL}/get-reportings`,
        {
          startDate: startDate,
          endDate: endDate
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = response.data;
      setReportings(data);
      setFilterdReporting(data);
  
      console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const getAllLevels = async () => {
    try {
      const response = await axios.get(BASE_URL + "/get-levels", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allLevels = await response.data;
      setLevels(allLevels);
      //  console.log(allLevels);
    } catch (err) {
      console.log(err);
    }
  };
  //GET ALL DESIGNATIONS
  const getAllDesignations = async () => {
    try {
      const response = await axios.get(BASE_URL + "get-designations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allDesignations = await response.data;
      setDesignations(allDesignations);
      console.log(allDesignations);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllAssignedRoles = async () => {
    try {
      const response = await axios.get(BASE_URL + "get-assigned-role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allAssignedRoles = await response.data;
      setAssignedRoles(allAssignedRoles);
      console.log(allAssignedRoles);
    } catch (err) {
      console.log(err);
    }
  };
  //UPDATE SALARY

  const updateSalryOfUser = async () => {
    const reportingToUpdate = reportings.find(
      (reporting) => reporting.user._id === updateUserId
    );
    const cid = reportingToUpdate.user.cid;
    try {
      const response = await axios.put(
        BASE_URL + `/update-salary/${cid}`,
        { amount: salaryValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      reportingToUpdate.user.salary = response?.data?._id;
      getAllReportings();
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  //UPDATE USER
  const updateUser = async () => {
    
    dispatch(setLoading(true));
    // await updateSalryOfUser();
    await getAllReportings();
    const reportingToUpdate = reportings.find(
      (reporting) => reporting.user._id === updateUserId
    );
    try {
      const response = await axios.put(
        `${BASE_URL}update-user/${updateUserId} `,
        reportingToUpdate.user,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      console.log(response.data);
      setUpdateUserId(null);
      getAllReportings();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
   let filteredReportings = [];
   switch(searchBy){
     case "name":
      filteredReportings = filteredReporting.filter((item) =>
      item.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    break;
  case "reportingTo":
    filteredReportings = filteredReporting.filter((item) =>
      item.reportingTo.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    break;
  default:  
  filteredReportings = filteredReporting.filter((item) => {
      return (
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.user?.cid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reportingTo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item?.reportingTo?.cid
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });

   }

    // const filteredReportings = filteredReporting.filter((item) => {
    //   return (
    //     item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     item?.user?.cid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     item.reportingTo.name
    //       .toLowerCase()
    //       .includes(searchQuery.toLowerCase()) ||
    //     item?.reportingTo?.cid
    //       ?.toLowerCase()
    //       .includes(searchQuery.toLowerCase())
    //   );
    // });

    // console.log(filteredReportings);
    setReportings(filteredReportings);
  };
  const handleUpdateUser = (e, field) => {
    let updateValue = e.target.value;
    if (field === "salary") {
      updateValue = { amount: updateValue };
    }
    if (
      field === "levelRange" ||
      field === "designation" ||
      field === "assignedRole" ||
      field === "skip"
    ) {
      updateValue = updateValue;

      console.log(updateValue);
    }

    const updatedUserCopy = { ...updatedUser, [field]: updateValue };
    setUpdatedUser(updatedUserCopy);

    const updatedReportings = reportings.map((reporting) => {
      if (reporting.user._id === updateUserId) {
        return {
          ...reporting,
          user: { ...reporting.user, [field]: updateValue },
        };
      }
      return reporting;
    });
    setReportings(updatedReportings);
  };

  const handleDeleteReporting = async (reporting) => {
    const reportingid = reporting;
    try {
      const deleteReporting = await axios.delete(
        `${BASE_URL}delete-reporting/${reportingid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Deleted Successfully!");
      getAllReportings();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

 
  return (
    <>
      <div className=" flex items-center w-full ">
       <div className="justify-start w-1/2 flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" w-2/3 p-2 mb-2 outline-1 border-2 border-black rounded "
          />
             <select
            onChange={(e) => {
              const selectedOption = e.target.value;
              setSearchBy(selectedOption);
            }}
            className=" p-2 mb-2 outline-1 border-2 border-black rounded"
          >
            <option value="">Search Filter</option>
            <option value="name">Employee</option>
            <option value="reportingTo">Reporting To</option>
          </select>
          <div className="p-2">
          <select value={selectedDateRange} onChange={handleDateRangeChange}>
            <option value="">Select Date Range</option>
            {generateFiscalYearOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className=" w-1/2 flex justify-end">
          <button
            className="bg-pink-600 hover:bg-pink-700 my-2  text-white font-bold py-2 px-2 rounded"
            onClick={() => setCreateReprtingToggle((prev) => !prev)}
          >
            Add Ownership
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center overflow-x-hidden">
        <div className="w-full flex flex-col items-center">
          {/* <h1 className="text-center my-4 font-bold uppercase text-4xl"> Ownership Table</h1> */}
        </div>
        <div className="w-full overflow-x-auto  overflow-y-scroll rounded-sm h-[62vh] border-2 border-gray-800 hover: ">
          <table className="w-full rounded border-collapse ">
            <thead className="text-black uppercase text-center sticky top-0  z-10 bg-white shadow ">
              <tr className="">
                {tableHeadNames.map((head, index) => (
                  <th
                    key={index}
                    className={`py-4 px-2  font-semibold  text-[1rem]  text-nowrap  w-20  border-x border-gray-800 border-collapse ${
                      index === tableHeadNames.length - 1
                        ? "sticky right-0 bg-white"
                        :index===1? "sticky left-0 outline-1	bg-white outline ":""
                    }`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportings?.map((reporting) => (
                <>
                  {updateUserId === reporting.user._id ? (
                    <tr
                      key={reporting._id}
                      className={`hover:bg-slate-50 ${
                        selectedRowId === reporting._id ? "bg-slate-100 " : ""
                      } `}
                      onClick={() => setSelectedRowId(reporting._id)}
                    >
                      {tableFields.map((field, index) => (
                        <td key={index}                           
                        className={` ${index===1?'sticky left-0 outline-1	 outline bg-slate-100':" "} border border-gray-800 px-4 whitespace-nowrap`}
                        >
                          {field === "levelRanges" ? (
                            <select
                             disabled
                              value={reporting.user[field]?.level}
                              onClick={(e) => handleUpdateUser(e, field)}
                              className="w-full rounded  py-1 shadow bg-white  "
                            >
                              {levels?.map((lev) => (
                                <option key={lev._id} value={lev._id}>
                                  {lev.level}
                                </option>
                              ))}
                            </select>
                          ) : field === "designation" ? (
                            <select
                              className="w-full rounded  py-1 shadow bg-white "
                              value={reporting.user[field]?.name}
                              onClick={(e) => handleUpdateUser(e, field)}
                            >
                              {designations?.map((designation) => (
                                <option
                                  key={designation._id}
                                  value={designation._id}
                                >
                                  {designation.name}
                                </option>
                              ))}
                            </select>
                          ) : field === "assignedRole" ? (
                            <select
                              className="w-full rounded py-1 shadow bg-white"
                              value={reporting.user[field]?.name}
                              onClick={(e) => handleUpdateUser(e, field)}
                            >
                              {assignedRoles?.map((role) => (
                                <option key={role._id} value={role._id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          ) : field === "reportingTo" ? (
                            <>
                              <div className="flex justify-between ">
                                {`${reporting?.reportingTo?.name} (${reporting?.reportingTo?.cid})`}
                                <button
                                  onClick={() => {
                                    setUserId(reporting.user._id);
                                    setTransferReprtingToggle((prev) => !prev);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faExchange} />
                                </button>
                              </div>
                            </>
                          ) : field === "skip" ? (
                            
                            reporting.user?.skip?.name
                          ) : field === "salary" ? (
                            <input
                             disabled
                              value={salaryValue}
                              className="w-full rounded  py-1 shadow bg-white"
                              onChange={(e) => setSalaryValue(e.target.value)}
                            />
                          ) : field === "name" ?(

                            <input
                              className=""
                              value={reporting.user[field]}
                              onChange={(e) => handleUpdateUser(e, field)}
                            />
                          ):field==="status" ?(
                            <select
                            className="w-full rounded py-1 shadow bg-white"
                            value={reporting.user[field]}
                            onChange={(e) => handleUpdateUser(e, field)}                    
                            >
                                   <option value="Active">Active</option>
                                    <option value="Left">Left</option>

                            </select>
                          ):(<></>)}
                        </td>
                      ))}
                      <td className="border border-gray-800 p-2 flex gap-2 justify-center sticky right-0 bg-white">
                        <button
                          onClick={() => {
                            updateUser();
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => {
                            setUpdateUserId(null);
                          }}
                        >
                          <FontAwesomeIcon icon={faMultiply} />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={reporting._id}
                      className={`hover:bg-red-400 ${
                        selectedRowId === reporting._id ? "bg-red-500" : ""
                      }`}
                      onClick={() => setSelectedRowId(reporting._id)}
                    >
                      {tableFields.map((field, index) => (
                        <td
                          key={index}
                          className={` ${index===1?`sticky left-0 outline-1	 outline   
                          
                          hover:bg-red-400 ${
                            selectedRowId === reporting._id ? "bg-red-500" : " bg-white"
                          }
                          
                          `:" "} border border-gray-800 px-4 p-2 whitespace-nowrap`}
                        >
                          {field === "levelRanges" ? (
                            reporting.user[field][0]?.level?.level
                          ) : field === "designation" ? (
                            reporting.user[field]?.name
                          ) : field === "assignedRole" ? (
                            reporting.user[field]?.name
                          ) : field === "reportingTo" ? (
                            <>
                              <div className="flex justify-between">
                                {`${reporting?.reportingTo?.name} (${reporting?.reportingTo?.cid})`}
                                <button
                                  onClick={() => {
                                    setUserId(reporting.user._id);
                                    setTransferReprtingToggle((prev) => !prev);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faExchange} />
                                </button>
                              </div>
                            </>
                          ) : field === "startDate" ? (
                            // new Date(reporting[field]).toLocaleDateString()
                            new Date(reporting[field]).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          ) : field === "endDate" && reporting[field] ? (
                            // new Date(reporting[field]).toLocaleDateString()
                            new Date(reporting[field]).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          ) : field === "skip" ? (
                            `${reporting.user.skip?.name} (${reporting.user.skip?.cid})`
                          ) : field === "salary" ? (
                            reporting.user?.salary?.amount
                          ) : field === "name" ? (
                            `${reporting.user[field]} (${reporting.user.cid})`
                          ) : (
                            reporting.user[field]
                          )}
                        </td>
                      ))}
                      <td className="border  p-2 flex gap-2 justify-center sticky right-0 bg-white">
                        <button
                          onClick={() => {
                            setUpdateUserId(reporting.user._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button>
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDeleteReporting(reporting._id)}
                          />
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-center"></div>
        {transferReportingToggle && (
          <TransferReporting user={userId} onSubmission={getAllReportings} />
        )}
        {createReportingToggle && (
          <NewReporting
            onSubmission={getAllReportings}
            onClose={() => setCreateReprtingToggle(false)}
          />
        )}
      </div>
    </>
  );
};
export default OwnerShipTable;
