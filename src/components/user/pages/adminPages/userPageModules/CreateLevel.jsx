import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../../../constants/api";
import showToast from "../../../../../utils/helpers/showToast";

const CreateLevelRange = ({cid, getAllLevelRange}) => {
  const [formData, setFormData] = useState({
    cid: cid,
    startDate: "",
    level: "",
  });
  const [levels, setLevels] = useState([]);

  const [toggle, setToggle] = useState(false);
  const token = useSelector((store) => store.auth?.token?.token);


  useEffect(() => {
    getAllLevels()
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post( `${BASE_URL}/change-level-ranges/${cid}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Level range created:", response.data);
      getAllLevelRange();
      showToast(

      )
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
      console.error("Error creating level range:", error);
    }
  };

  return (
    <div className="ml-4 mt-6">
      <div>
        <button onClick={() => setToggle((prev) => !prev)}
                  className="hover:bg-[#2399D0] bg-[#02131e] outline outline-1 rounded-md w-auto text-white font-semibold p-2">
            Promote Level
        </button>
        </div>  
        {toggle && (
               <form onSubmit={handleSubmit}>
               <div className="my-8">
                 <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                 <input
                   type="date"
                   id="startDate"
                   name="startDate"
                   value={formData.startDate}
                   onChange={handleChange}
                   className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                 />
               </div>
             
               <div className="mb-4">
                 <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
       
                 <select
                   value={formData.level}
                   name="level"
                   onChange={handleChange}
                        className="w-full rounded  py-1 shadow bg-white  "
                      >
                        {levels?.map((lev) => (
                          <option key={lev._id} value={lev._id}>
                            {lev.level}
                          </option>
                        ))}
                      </select>
                 {/* <input
                   type="text"
                   id="level"
                   name="level"
                   value={formData.level}
                   onChange={handleChange}
                   className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                 /> */}
               </div>
               <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Create</button>
             </form>
        )}
   
    </div>
  );
};

export default CreateLevelRange;
