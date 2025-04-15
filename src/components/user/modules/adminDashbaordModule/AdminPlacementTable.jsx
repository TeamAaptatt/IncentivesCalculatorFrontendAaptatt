import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faMultiply,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import useUserManagement from "../../../../utils/hooks/useUserMangement";
import AddPlacementButton from "./AddPlacementButton";
import { setLoading } from "../../../../utils/redux/loadSlice/loadSlice";
import { validateFormData } from "../../../../utils/helpers/validationHelpers";
import {
  dataFields,
  fields,
  paymentStatusOptions,
  securityPeriodOptions,
  statusOptions,
} from "../../../../constants/placementTable";
import { getFieldOptions } from "../../../../utils/helpers/getFieldOptions";
import '../../../../Styles.css'
import { generateFiscalYearOptions } from "../../../../utils/helpers/genereateDateRange";
import { formatDateForInput } from "../../../../utils/helpers/formatDateforInput";
import { exportToExcel } from "../../../../utils/helpers/exportToExcel";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { formatDate } from "../../../../utils/helpers/formatDate";

const AdminPlacementTable = () => {
  const token = useSelector((state) => state.auth.token.token);
  const [placements, setPlacements] = useState([]);
  const [updateFieldId, setupdateFieldId] = useState(null);
  const [deleteFieldId, setDeleteFieldId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const [error, setErrors] = useState({});
  const [filteredPlacements, setFilteredPlacements] = useState([]);
  const [searchBy, setSearchBy] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(generateFiscalYearOptions().slice(-1)[0].value);
  const [inputError, setInputError] = useState(false);

  const { users, filteredUsers } = useUserManagement();

  const candidateOwnerOptions = getFieldOptions(
    "cnadidateOwner",
    users,
    filteredUsers
  );

  const accountManagerOptions = getFieldOptions(
    "accountManager",
    users,
    filteredUsers
  );
  const accountHeadOptions = getFieldOptions(
    "accountHead",
    users,
    filteredUsers
  );
  const pandLHeadOptions = getFieldOptions("pandLhead", users, filteredUsers);
  const securityPeriodOption = getFieldOptions(
    "securityPeriod",
    users,
    filteredUsers
  );
  const paymentStatusOption = getFieldOptions(
    "paymentStatus",
    users,
    filteredUsers
  );

  useEffect(() => {
    getAllPlacements();
  }, [updateFieldId, deleteFieldId, selectedDateRange]);

  const getAllPlacements = async () => {
    const [startDate, endDate] = selectedDateRange.split(",");

    try {
      dispatch(setLoading(true));
      const response = await axios.post(BASE_URL + "get-all-placements",{
        startDate: startDate,
        endDate: endDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setPlacements(data);
      setFilteredPlacements(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (event, field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    let updatedValue = event.target.value;

    if (field === "dateOfJoining") {
      updatedValue = updatedValue;
    } else if (field === "accountManager") {
      const selectedOption = accountManagerOptions.find(
        (option) => option.label === updatedValue
      );
      if (selectedOption) {
        updatedValue = selectedOption.value;
      }
    } else if (field === "cnadidateOwner") {
      const selectedOption = candidateOwnerOptions.find(
        (option) => option.label === updatedValue
      );
      if (selectedOption) {
        updatedValue = selectedOption.value;
      }
    } else if (field === "accountHead") {
      const selectedOption = accountHeadOptions.find(
        (option) => option.label === updatedValue
      );
      if (selectedOption) {
        updatedValue = selectedOption.value;
      }
    } else if (field === "pandLhead") {
      const selectedOption = pandLHeadOptions.find(
        (option) => option.label === updatedValue
      );
      if (selectedOption) {
        updatedValue = selectedOption.value;
      }
    }

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
    const newErrors = validateFormData(updatedPlacement);
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(setLoading(true));
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
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = () => {
    let filteredPlacement = [];
    if(searchQuery.length>100){
      setInputError(true)
      setSearchQuery('')
    }
    switch (searchBy) {
      case "candidate":
        filteredPlacement = filteredPlacements.filter((item) =>
          item.candidate?.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
        break;
      case "candidateOwner":
        filteredPlacement = filteredPlacements.filter((item) =>
          item.cnadidateOwner.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())||item?.cnadidateOwner?.cid?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case "accountHead":
        filteredPlacement = filteredPlacements.filter((item) =>
          item.accountHead.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())||item?.accountHead?.cid?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case "accountManager":
        filteredPlacement = filteredPlacements.filter((item) =>
          item.accountManager.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())||item?.accountManager?.cid?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case "pandLhead":
        filteredPlacement = filteredPlacements.filter((item) =>
          item.pandLhead.name?.toLowerCase().includes(searchQuery.toLowerCase())||item?.pandLhead?.cid?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
        case "resumeSource":
          filteredPlacement = filteredPlacements.filter((item) =>
            item.resumeSource?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;   
      default:
        filteredPlacement = filteredPlacements;
        filteredPlacement = filteredPlacements?.filter((item) => {
          return (
            item.candidate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.cnadidateOwner.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||item?.cnadidateOwner?.cid?.toLowerCase().includes(searchQuery.toLowerCase())||
            item.accountManager.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||item?.accountManager?.cid?.toLowerCase().includes(searchQuery.toLowerCase())||
            item.accountHead.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||item?.accountHead?.cid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pandLhead.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())||item?.pandLhead?.cid?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
    }
    setPlacements(filteredPlacement);
  };

  useEffect(() => {
    handleSearch();
    setInputError(false)
  }, [searchQuery, searchBy]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  useEffect(() => {
    if (deleteFieldId !== null) {
      deleteRowHandler();
    }
  }, [deleteFieldId]);

  const deleteRowHandler = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.delete(
        BASE_URL + `/deletePlacement/${deleteFieldId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteFieldId(null);
      getAllPlacements();
      setupdateFieldId(null);
    } catch (error) {
      alert("Error deleting placement");
    }
  };
  
  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };
 

  return (
    <>
      <div className=" flex items-center w-full  ">
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
            className="  p-2  w-32 mb-2 outline-1 border-2 border-black rounded"
          >
            <option value="">Search Filter</option>
            <option value="candidate">Candidate</option>
            <option value="candidateOwner">Candidate Owner</option>
            <option value="accountHead">Account Head</option>
            <option value="accountManager">Account Manager</option>
            <option value="pandLhead">P&L Head</option>
            <option value="resumeSource">Resume Source</option>
          </select>

          <div className="p-2">
          <select value={selectedDateRange} onChange={handleDateRangeChange}>
            <option value="">Choose Year</option>
            {generateFiscalYearOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          

        </div>
        {inputError && <p className="text-red-500 text-xs lowercase">Search  length Can't be more than 100 characters.</p>}
        </div>
        <div className=" w-1/2 flex justify-end gap-2">
        <div>
      </div>
          <AddPlacementButton getAllPlacements={getAllPlacements} />
        </div>
      </div>
      <div className="overflow-hidden  border-2 border-gray-800  rounded-sm overflow-x-scroll overflow-y-scroll h-[62vh] w-full mb-2">
        <table className="min-w-full ">
          <thead className="text-black bg-white uppercase text-center sticky top-0  z-10 shadow">
            <tr > 
              {dataFields.map((data, index) => (
                <th
                  key={index}
                  className={`py-4 px-2 font-semibold   text-[1rem]  text-nowrap border-x border-gray-800 ${
                    index === dataFields.length - 1
                      ? "sticky right-0 bg-white  "
                      : " "
                  }`}
                >
                  {data}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center text-sm">
            {placements?.map((placement, index) => (
              <>
                {placement._id === updateFieldId ? (
                  <tr   key={placement._id}
                  className={`hover:bg-red-400 ${
                    selectedRowId === placement._id ? 'bg-red-500' : ''
                  }`}
                  onClick={() => setSelectedRowId(placement._id)}>
                        <td className="px-6 py-2 whitespace-nowrap border border-black w-32">{index + 1}</td>

                    {fields.map((field, fieldIndex) => (
                      <td
                        key={fieldIndex}
                        className="px-6 py-2 whitespace-nowrap border border-gray-800"
                      >
                        {fieldIndex === 15 || fieldIndex === 16 || fieldIndex === 0? (
                          <select
                            onChange={(e) => handleInputChange(e, field)}
                            value={placement[field]}
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                          >
                            {fieldIndex === 15
                              ? securityPeriodOptions.map((option, index) => (
                                  <option key={index} value={option}>
                                    {option}
                                  </option>
                                ))
                              : fieldIndex === 16? paymentStatusOptions.map((option, index) => (
                                  <option key={index} value={option}>
                                    {option}
                                  </option>
                                )): statusOptions.map((option, index)=>(
                                  <option key={index} value={option}> 
                                  {option}
                                  </option>
                                ))}
                          </select>
                        ) : fieldIndex === 4 ||fieldIndex === 5? (
                          <>
                            <input
                              type="date"
                              value={formatDateForInput(placement[field])}
                              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                              onChange={(e) => handleInputChange(e, field)}
                            />
                          </>
                        ) : (
                          <input
                            onChange={(e) => handleInputChange(e, field)}
                            className={`${
                              fieldIndex === 6 ||
                              fieldIndex === 7 ||
                              fieldIndex === 8 ||
                              fieldIndex === 9
                                ? "hidden"
                                : "visible border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            }`}
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
                          <>
                            <input
                              type="text"
                              onChange={(e) => handleInputChange(e, field)}
                              value={placement[field]?.name}
                              list="candidateOwnerOptionsList"
                              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            />
                            <datalist id="candidateOwnerOptionsList">
                              {candidateOwnerOptions.map((option, index) => (
                                <option
                                  key={index}
                                  value={option.label}
                                ></option>
                              ))}
                            </datalist>
                          </>
                        )}
                        {field === "accountManager" && (
                          <>
                            <input
                              type="text"
                              onChange={(e) => handleInputChange(e, field)}
                              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                              value={placement[field]?.name}
                              list="accountManagerOptionsList"
                            />
                            <datalist id="accountManagerOptionsList">
                              {accountManagerOptions.map((option, index) => (
                                <option
                                  key={index}
                                  value={option.label}
                                ></option>
                              ))}
                            </datalist>
                          </>
                        )}
                        {field === "pandLhead" && (
                          <>
                            <input
                              type="text"
                              onChange={(e) => handleInputChange(e, field)}
                              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                              value={placement[field]?.name}
                              list="pandLheadOptionsList"
                            />
                            <datalist id="pandLheadOptionsList">
                              {pandLHeadOptions.map((option, index) => (
                                <option
                                  key={index}
                                  value={option.label}
                                ></option>
                              ))}
                            </datalist>
                          </>
                        )}
                        {field === "accountHead" && (
                          <>
                            <input
                              type="text"
                              onChange={(e) => handleInputChange(e, field)}
                              value={placement[field]?.name}
                              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                              list="accountHeadOptionsList"
                            />
                            <datalist id="accountHeadOptionsList">
                              {accountHeadOptions.map((option, index) => (
                                <option
                                  key={index}
                                  value={option.label}
                                ></option>
                              ))}
                            </datalist>
                          </>
                        )}

                        {error[field] && (
                          <p className="text-green-900 text-xs lowercase">{`*${error[field]}`}</p>
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
                  <tr   key={placement._id}
                  className={`hover:bg-red-400  ${
                    selectedRowId === placement._id ? 'bg-red-600 ' : ''
                  }`}
                  onClick={() => setSelectedRowId(placement._id)}>
                        <td className="px-6 py-2 whitespace-nowrap border border-black w-32">{index + 1}</td>

                    {fields?.map((field, fieldIndex) => (
                      <td
                        key={fieldIndex}
                        className="px-6 py-2 whitespace-nowrap border border-black w-32" // Set fixed width here
                      >
                        {field === "accountManager"
                          ? `${placement[field]?.name} (${placement[field].cid})`
                          : field === "cnadidateOwner"
                          ? `${placement[field]?.name} (${placement[field]?.cid})`
                          : field === "pandLhead"
                          ? `${placement[field].name} (${placement[field].cid})`
                          : field === "dateOfJoining" || field === "offeredDate"
                          ? formatDate(placement[field])
                           
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
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="mr-2 text-[#030904]"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteFieldId(placement._id);
                          // deleteRowHandler();
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="mr-2   text-[#030904]"
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
    </>
  );
};

export default AdminPlacementTable;
