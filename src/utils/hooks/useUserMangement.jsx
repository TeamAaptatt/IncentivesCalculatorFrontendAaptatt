import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../constants/api';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const token = useSelector((state) => state.auth.token.token);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + "/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setUsers(data);
        setFilteredUsers(data.filter(user => user.level?.level !== 'Level 1' && user.level?.level !== 'Level 2'));
        console.log("Users:", data);
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();
  }, [token]);

  return { users, filteredUsers };
};

export default useUserManagement;
