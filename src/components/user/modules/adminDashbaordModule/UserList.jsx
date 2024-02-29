import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../../../../constants/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((store) => store.auth.token.token) || '';

  useEffect(() => {
    axios.get(BASE_URL + '/get-all-users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="flex flex-wrap">
      {users.map((user) => (
        <Link to={`/userPage/${user.cid}`} key={user._id}>
          <UserCard user={user} />
        </Link>
      ))}
    </div>
  );
};

export default UserList;
