import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../../../../constants/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateUserForm from "./CreateUserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((store) => store.auth.token.token) || "";
  const [toggle, setToggle] = useState(false);
const toggleForm = () => {
    setToggle((prevState) => !prevState);
  };


  useEffect(() => {
    axios
      .get(BASE_URL + "/get-all-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-wrap">
       <div className="justify-start w-1/2 flex gap-2">
      <input
        type="text"
        placeholder="Search by name or cid"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" w-2/3 p-2 mb-2 outline-1 border-2 border-black rounded "
        />

      </div>

      <div className=" w-1/2 justify-end flex ">
      <button
            className={` ${toggle?'hidden':''}bg-pink-600 hover:bg-pink-700 my-2  text-white font-bold py-2 px-2 rounded`}
            onClick={() => setToggle((state) => !state)}>{toggle === true ? 'Close' : 'Create New User'}
        </button>
        {toggle && <CreateUserForm handleClose={toggleForm} />}        
      </div>      
      <div className="flex flex-wrap w-full">
        {filteredUsers.map((user) => (
          <Link to={`/userPage/${user.cid}`} key={user._id}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;
