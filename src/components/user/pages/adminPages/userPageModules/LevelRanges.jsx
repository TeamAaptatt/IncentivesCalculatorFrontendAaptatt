import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../constants/api";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../../utils/helpers/formatDate";
import { formatDateForInput } from "../../../../../utils/helpers/formatDateforInput";
import CreateLevelRange from "./CreateLevel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import showToast from "../../../../../utils/helpers/showToast";

const LevelRanges = ({ cid }) => {
  const [levelRanges, setLevelRanges] = useState([]);
  const [editingRange, setEditingRange] = useState(null); 
  const [editStartDate, setEditStartDate] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const token = useSelector((store) => store.auth?.token?.token);
  const [error, setError] = useState(null);


  useEffect(() => {
   

    fetchLevelRanges();
    getAllLevels()
  }, [cid, editingRange]);

  const fetchLevelRanges = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-levels-of-user/${cid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLevelRanges(response.data);
    } catch (error) {
      console.log("Error fetching level ranges:", error);
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
  }
  const handleDelete = async (rangeId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete-level/${rangeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }    
      });
           fetchLevelRanges()
      setEditingRange(null);

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
      console.log("Error deleting level range:", error);
    }
  };

  const handleUpdate = async () => {
    setError("")
    if (editLevel === "" || editStartDate === "") {
      return setError("Choose both level and start date");
    }
  
    const originalRange = levelRanges.find(range => range._id === editingRange);
  
    if (editLevel === originalRange.level._id && editStartDate === formatDateForInput(originalRange.startDate)) {

      showToast("No changes made.", {
        duration: 3000,
        position: "top-center",
        style: {
          border: "1px solid ",
          padding: "4px",
          color: "white",
          background: "#FFA500",
        },
      });
      return;
    }
  
    try {
      const response = await axios.put(`${BASE_URL}update-level-range`, {
        _id:editingRange,
        startDate:editStartDate,
        level:editLevel
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      })  
      setEditingRange(null);
      setEditStartDate("");
      setEditLevel("");
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
      console.log("Error updating level range:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-end">
      <CreateLevelRange cid={cid} getAllLevelRange={fetchLevelRanges} />
      </div>
      <div className=" ml-72 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {levelRanges.map((range,index) => (
          <div
            key={range._id}
            className=" p-6 rounded-lg  shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex-wrap"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-700">Level Period</h3>
            <div className="flex justify-between">
              <div className="mb-4">
                <p className="text-purple-800">Start Date</p>
                {editingRange === range._id && (index===levelRanges.length-1) ? (
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="border p-2"
                  />
                ) : (
                <p className="text-lg font-semibold">{formatDate(range?.startDate)}</p>
            )}

              </div>
              <div className="mb-4">
                <p className="text-purple-800">End Date</p>
                
                  <p className="text-lg font-semibold">{formatDate(range?.endDate) || 'NA'}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-purple-800">Level</p>
              {editingRange === range._id ? (
                <select
                 value={editLevel}
                 onChange={(e)=>setEditLevel(e.target.value)}
                 className="w-full rounded  py-1 shadow bg-white  "
               >
                 {levels?.map((lev) => (
                   <option key={lev._id} value={lev._id}>
                     {lev.level}
                   </option>
                 ))}
               </select>
              ) : (
                <p className="text-lg font-semibold">{range?.level.level}</p>
              )}
            </div>
            <div className="flex justify-between">
              {editingRange === range._id ? (
                <>
                  <button onClick={handleUpdate} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingRange(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                  </button>
                </>
                
              ) : (
                <>
                  <button onClick={() =>{
                    setEditingRange(range._id);
                    setEditLevel(range.level._id);
                    setEditStartDate(formatDateForInput(range.startDate));
                  }}  className="hover:bg-pink-700 bg-pink-600 outline outline-1 rounded-md w-auto text-white font-semibold p-2">
                    Edit  <FontAwesomeIcon className=" ml-2" icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(range._id)} className=" hover:bg-slate-100 text-white font-bold py-2 px-4 rounded">
                    <FontAwesomeIcon className=" ml-2 text-red-800" icon={faTrash} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
                      {error && <p className="text-red-500 text-sm mx-6">{error}</p>}

      </div>
      <div className="w-full justify-start flex mb-6">
      </div>
    </div>
  );
};

export default LevelRanges;
