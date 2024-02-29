import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../constants/api";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCheck,
  faCross,
  faEdit,
  faMultiply,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const AdminPlacementTable = () => {
  const token = useSelector((state) => state.auth.token.token);
  const [placements, setPlacements] = useState([]);
  const [updateFieldId, setupdateFieldId] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [deleteFieldId, setDeleteFieldId] = useState(null)
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
      updatedValue = new Date(updatedValue);
    } else if (field === "accountManager" || field === "cnadidateOwner" || field === "accountHead"|| field === "pandLhead") {
      updatedValue = { name: updatedValue };
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
    const updatedPlacement =  placements.find((placement) => placement._id === updateFieldId);
    console.log(updatedPlacement);
    const response = await axios.put(BASE_URL+`/updatePlacement/${updateFieldId}`, updatedPlacement, {
      headers:{
        'Authorization' : `Bearer ${token}` ,
      }
    })
    setupdateFieldId(null);
    if(response.status==='200'){
      setupdateFieldId(null);
    }
  }


useEffect(()=>{
  if(deleteFieldId!==null){
  deleteRowHandler();

  }
}, [deleteFieldId])
    const deleteRowHandler = async () => {
    const response = await axios.delete(BASE_URL + `/deletePlacement/${deleteFieldId}`,{
      headers:{
        'Authorization': `Bearer ${token}`
      }
    })
  
    if(response.status==='200'){
    setDeleteFieldId(null)
    setupdateFieldId(null)
    getAllPlacements();

    }

  }

  return (
    <div className="overflow-hidden border border-collapse border-gray-800 overflow-x-scroll w-[80%] m-4">
      <table className="min-w-full  ">
        <thead>
          <tr>
            {dataFields.map((data) => (
              <th className="py-2 px-4 border-b">{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {placements.map((placement) => (
            <>
              {placement._id === updateFieldId ? (
                <tr key={placement._id} className="hover:bg-gray-100">
                  {fields.map((field, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      <input
                         
                        onChange={(e)=>handleInputChange(e, field)} 
                        value={
                          field === "accountManager"
                            ? `${placement[field].name}`
                            : field === "cnadidateOwner"
                            ? `${placement[field].name}`
                            : field === "pandLhead"
                            ? `${placement[field].name}`
                            : field === "dateOfJoining"
                            ? new Date(placement[field]).toLocaleDateString()
                            : field === "accountHead"
                            ? `${placement[field].name}`
                            : placement[field]
                        }
                      />
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        saveChangesHandler();
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    </button>
                    <button
                      onClick={() => {
                        setupdateFieldId(null)
                      }}
                    >
                      <FontAwesomeIcon icon={faMultiply} className="mr-2" />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={placement._id} className="hover:bg-gray-100">
                  {fields.map((field, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      {field === "accountManager"
                        ? `${placement[field].name}`
                        : field === "cnadidateOwner"
                        ? `${placement[field].name}`
                        : field === "pandLhead"
                        ? `${placement[field].name}`
                        : field === "dateOfJoining"
                        ? new Date(placement[field]).toLocaleDateString()
                        : field === "accountHead"
                        ? `${placement[field].name}`
                        : placement[field]}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b">
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
