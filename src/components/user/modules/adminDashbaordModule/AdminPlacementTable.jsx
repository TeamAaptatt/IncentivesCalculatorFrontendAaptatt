import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faMultiply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import useUserManagement from "../../../../utils/hooks/useUserMangement";

const AdminPlacementTable = () => {
  const token = useSelector((state) => state.auth.token.token);
  const [placements, setPlacements] = useState([]);
  const [updateFieldId, setupdateFieldId] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [deleteFieldId, setDeleteFieldId] = useState(null);
  const dataFields = [
    "Status",
    "Candidate",
    "Client",
    "Offered Position",
    "Date Of Joining",
    "Candidate Owner",
    "Account Manager",
    "Account Head",
    "P&L Head",
    "Resume Source",
    "Billable Salary",
    "Commercial",
    "Fee",
    "Send Off",
    "Security Period",
    "Payment Status",
    "Update",
  ];
  const fields = [
    "status",
    "candidate",
    "client",
    "offeredPosition",
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
  const securityPeriodOptions = ["On-Going", "Completed", "Send-Off"]; // Replace with your actual options
  const paymentStatusOptions = ["Pending", "Received", "Adjusted", "Returning", "Compromised"]; // Replace with your actual options

  const { users, filteredUsers } = useUserManagement();


  const getFieldOptions = (field) => {
    switch (field) {
      case "cnadidateOwner":
      case "accountManager":
      case "accountHead":
      case "pandLhead":
        const usersToDisplay = field === "cnadidateOwner" ?
          users?.map((user) => ({
            label: `${user.name} (${user.cid})`,
            value: user._id,
          })) : filteredUsers?.map((user) => ({
            label: `${user.name} (${user.cid})`,
            value: user._id,
          }))
        return usersToDisplay;

      case "securityPeriod":
        return securityPeriodOptions.map((option) => ({
          label: option,
          value: option,
        }));
      case "paymentStatus":
        return paymentStatusOptions.map((option) => ({
          label: option,
          value: option,
        }));
      default:
        return [];
    }
  };

  const candidateOwnerOptions = getFieldOptions("cnadidateOwner");

  const accountManagerOptions = getFieldOptions("accountManager");
  const accountHeadOptions = getFieldOptions("accountHead");
  const pandLHeadOptions = getFieldOptions("pandLhead");
  const securityPeriodOption = getFieldOptions("securityPeriod");
  const paymentStatusOption = getFieldOptions('paymentStatus')



  useEffect(() => {
    getAllPlacements();
  }, [updateFieldId, deleteFieldId]);

  const getAllPlacements = async () => {
    const response = await axios.get(BASE_URL + "get-all-placements", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;
    setPlacements(data);
    console.log(data);
  };

  const handleInputChange = (event, field) => {
    let updatedValue = event.target.value;

    // Handle special cases based on the field name
    if (field === "dateOfJoining") {
      updatedValue = updatedValue;
    } else if (
      field === "accountManager" ||
      field === "cnadidateOwner" ||
      field === "accountHead" ||
      field === "pandLhead"
    ) {
      const user = users.find((user) => user.name === updatedValue);

      if (user) {
        updatedValue = { name: user.name, id: user.id };
      }
    }

    // Use the field name to update the corresponding state in a new array
    const updatedPlacements = placements.map((placement) => {
      if (placement._id === updateFieldId) {
        return {
          ...placement,
          [field]: updatedValue,
        };
      }
      return placement;
    });
    setPlacements(updatedPlacements);
  };

  const saveChangesHandler = async () => {
    const updatedPlacement = placements.find(
      (placement) => placement._id === updateFieldId
    );
    console.log(updatedPlacement);
    const response = await axios.put(
      BASE_URL + `/updatePlacement/${updateFieldId}`,
      updatedPlacement,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setupdateFieldId(null);
    if (response.status === "200") {
      setupdateFieldId(null);
    }
  };

  useEffect(() => {
    if (deleteFieldId !== null) {
      deleteRowHandler();
    }
  }, [deleteFieldId]);

  const deleteRowHandler = async () => {
    const response = await axios.delete(
      BASE_URL + `/deletePlacement/${deleteFieldId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === "200") {
      setDeleteFieldId(null);
      setupdateFieldId(null);
      getAllPlacements();
    }
  };

  return (
    <div className="overflow-hidden border rounded border-collapse border-gray-800 overflow-x-scroll w-full m-4">
      <table className="min-w-full border border-gray-800">
        <thead className="text-indigo-600 uppercase text-center">
          <tr>
            {dataFields.map((data, index) => (
              <th
                key={index}
                className={`px-4 py-2 border border-b border-black ${index === dataFields.length - 1 ? 'sticky right-0 bg-white' : ''
                  }`}
              >
                {data}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center text-sm">
          {placements?.map((placement) => (
            <>
              {placement._id === updateFieldId ? (
                <tr key={placement._id} className="hover:bg-gray-100">
                  {fields.map((field, fieldIndex) => (
                    <td
                      key={fieldIndex}
                      className="px-6 py-2 whitespace-nowrap border border-gray-800"
                    >
                      {fieldIndex === 14 || fieldIndex === 15 ? ( // Check if the field index is 14 or 15
                        <select
                          onChange={(e) => handleInputChange(e, field)}
                          value={placement[field]}
                        >
                          {fieldIndex === 14
                            ? securityPeriodOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))
                            : paymentStatusOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                        </select>
                      ) : fieldIndex === 4 ? (<>
                        <input type="date" value={placement[field]}
                          onChange={(e) => handleInputChange(e, field)}

                        />

                      </>) : (
                        <input
                          onChange={(e) => handleInputChange(e, field)}
                          className={`${fieldIndex === 5 || fieldIndex === 6 || fieldIndex === 7 || fieldIndex === 8 ? 'hidden' : 'visible'}`}

                          value={
                            field === "accountManager" ||
                              field === "cnadidateOwner" ||
                              field === "pandLhead" ||
                              field === "accountHead"
                              ? placement[field]?.name
                              : placement[field]
                          }
                        />
                      )}
                      {field === "cnadidateOwner" && (
                        <select
                          onChange={(e) => handleInputChange(e, field)}
                          value={placement[field]?.name}
                        >
                          {candidateOwnerOptions?.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {field === "accountManager" && (
                        <select
                          onChange={(e) => handleInputChange(e, field)}
                          value={placement[field]?.name}
                        >
                          {accountManagerOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {field === "pandLhead" && (
                        <select
                          onChange={(e) => handleInputChange(e, field)}
                          value={placement[field]?.name}
                        >
                          {pandLHeadOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {field === "accountHead" && (
                        <select
                          onChange={(e) => handleInputChange(e, field)}
                          value={placement[field]?.name}
                        >
                          {accountHeadOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}


                    </td>
                  ))}
                  <td className="px-4 py-2 border-b sticky right-0 bg-white border-gray-800">
                    <button
                      onClick={() => {
                        saveChangesHandler();
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    </button>
                    <button
                      onClick={() => {
                        setupdateFieldId(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faMultiply} className="mr-2" />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={placement._id} className="hover:bg-gray-100">
                  {fields?.map((field, fieldIndex) => (
                    <td
                      key={fieldIndex}
                      className="px-6 py-2 whitespace-nowrap border border-black w-32" // Set fixed width here
                    >
                      {field === "accountManager"
                        ? `${placement[field]?.name} (${placement[field].cid})`
                        : field === "cnadidateOwner"
                          ? `${placement[field].name} (${placement[field].cid})`
                          : field === "pandLhead"
                            ? `${placement[field].name} (${placement[field].cid})`
                            : field === "dateOfJoining"
                              ? new Date(placement[field]).toLocaleDateString()
                              : field === "accountHead"
                                ? `${placement[field].name} (${placement[field].cid})`
                                : placement[field]}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b sticky right-0 bg-white border border-gray-800">
                    <button
                      onClick={() => {
                        setupdateFieldId(placement._id);
                        console.log(placement._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteFieldId(placement._id);
                        // deleteRowHandler();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    </button>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );

};

export default AdminPlacementTable;
