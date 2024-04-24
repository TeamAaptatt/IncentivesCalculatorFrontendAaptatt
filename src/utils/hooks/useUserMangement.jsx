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
        setFilteredUsers(data.map((user) => {
          const levelRangesCopy = [...user.levelRanges]; // Create a copy of levelRanges array
          const lastElementInLevel = levelRangesCopy.pop(); // Remove the last element from the copied array
          return {
            ...user,
            levelRanges: levelRangesCopy, // Update the levelRanges property with the modified array
          };
        }).filter((user) => {
          const lastElementInLevel = user.levelRanges[user.levelRanges.length - 1];
          return lastElementInLevel.level?.level !== 'Level 1' && lastElementInLevel.level?.level !== 'Level 2';
        }));
      
      console.log("Users:", data);
      console.log(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();
  }, [token]);

  return { users, filteredUsers };
};

export default useUserManagement;
