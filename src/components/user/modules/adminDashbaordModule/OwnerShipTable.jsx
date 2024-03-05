import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faExchange,
  faMultiply,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import CreateReporting from "./TransferReporting";
import TransferReporting from "./TransferReporting";
import NewReporting from "./NewReporting";

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

  const [userId, setUserId] = useState(null);

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
    "level",
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
  }, []);
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

  const getAllReportings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-reportings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setReportings(data);
      console.log(data);
    } catch (err) {
      console.log(err);
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
  //GET ALL ASSIGNED ROLE
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
  const updateSalryOfUser = async () => {};
  //UPDATE USER
  const updateUser = async () => {
    const reportingToUpdate = reportings.find(
      (reporting) => reporting.user._id === updateUserId
    );

    try {
      const response = await axios.put(`${BASE_URL}update-user/${updateUserId} `,
      reportingToUpdate.user, 

       {
        headers:{
            Authorization: `Bearer ${token}`
        }
       }
      );
      const data = await response.data;
      console.log(response.data);
       setUpdateUserId(null)
      getAllReportings();
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateUser = (e, field) => {
    let updateValue = e.target.value;
    console.log(updateValue, "Update");
  
   if (field === "level"||field === "designation" || field === "assignedRole"|| field ==="skip") {
      updateValue =  updateValue;
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
  
  console.log(reportings);
  return (
    <div className=" w-[90vw] flex flex-col items-center overflow-x-hidden">
      <h1 className=" text-center font-bold text-4xl"> Ownership Table</h1>
      <table className=" w-[90vw] my-4 border rounded  border-collapse p-2 border-gray-800">
        <thead>
          <tr className="">
            {tableHeadNames.map((head) => {
              return (
                <th className="border border-gray-800 p-2 w-20">{head}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {reportings?.map((reporting) => (
            <>
              {updateUserId === reporting.user._id ? (
                <tr key={reporting._id}>
                  {tableFields.map((field, index) => (
                    <td key={index} className=" border border-gray-800 p-2">
                      {field === "level" ? (
                        <select
                          value={reporting.user[field]?.level}
                          onChange={(e) => handleUpdateUser(e, field)}
                          className=" w-20"
                        >
                          {levels?.map((lev) => (
                            <option key={lev._id} value={lev._id}>{lev.level}</option>
                          ))}
                        </select>
                      ) : field === "designation" ? (
                        <select
                          className="  w-40"
                          value={reporting.user[field]?.name}
                          onChange={(e) => handleUpdateUser(e, field)}

                        >
                          {designations?.map((designation) => (
                            <option key={designation._id} value={designation._id}>{designation.name}</option>
                          ))}
                        </select>
                      ) : field === "assignedRole" ? (
                        <select
                          className=" w-40"
                          value={reporting.user[field]?.name}
                          onChange={(e) => handleUpdateUser(e, field)}
                          >
                          {assignedRoles?.map((role) => (
                            <option key={role._id} value={role._id}>{role.name}</option>
                          ))}
                        </select>
                      ) : field === "reportingTo" ? (
                        reporting?.reportingTo?.name
                      ) : field === "skip" ? (
                        reporting.user[field]?.name
                      ) : field === "salary" ? (
                        reporting.user[field]?.name
                      ) : (
                        <input
                          className=" w-20"
                          value={reporting.user[field]}
                          onChange={(e) => handleUpdateUser(e, field)}

                        />
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-800 p-2 flex gap-2">
                    <button onClick={()=>{
                                              updateUser();

                    }}>
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
                <tr key={reporting._id}>
                  {tableFields.map((field, index) => (
                    <td key={index} className="border border-gray-800 p-2">
                      {field === "level" ? (
                        reporting.user[field]?.level
                      ) : field === "designation" ? (
                        reporting.user[field]?.name
                      ) : field === "assignedRole" ? (
                        reporting.user[field]?.name
                      ) : field === "reportingTo" ? (
                        <div className="flex gap-2">
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
                      ) : field === "startDate" ? (
                        new Date(reporting[field]).toLocaleDateString()
                      ) : field === "endDate" && reporting[field] ? (
                        new Date(reporting[field]).toLocaleDateString()
                      ) : field === "skip" ? `${reporting[field]?.name} (${reporting[field]?.cid})`
                        
                       : "" ? (
                        reporting.user[field]?.name
                      ) : field === "salary" ? (
                        reporting.user[field]?.name
                      ) :field ==="name"?                        `${reporting.user[field]} (${reporting.user.cid})`:
                      (
                        reporting.user[field]
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-800 p-2 flex gap-2">
                    <button
                      onClick={() => {
                        setUpdateUserId(reporting.user._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {transferReportingToggle && (
        <TransferReporting user={userId} onSubmission={getAllReportings} />
      )}
      <button onClick={() => setCreateReprtingToggle((prev) => !prev)}>
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      {createReportingToggle && (
        <NewReporting onSubmission={getAllReportings} />
      )}
    </div>
  );
};
export default OwnerShipTable;
