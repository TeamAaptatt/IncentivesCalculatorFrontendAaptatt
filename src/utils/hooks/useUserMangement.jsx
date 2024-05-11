import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../constants/api';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersAboveFour, setUsersAboveFour] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.token.token);

  useEffect(() => {
    const getAllUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/get-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setUsers(data);
        const filteredData = data?.map(user => {
          const levelRangesCopy = [...user?.levelRanges];
          const lastElementInLevel = levelRangesCopy.pop();
          return {
            ...user,
            levelRanges: levelRangesCopy,
          };
        });
        console.log(filteredData);
        setFilteredUsers(users.filter(user => {
          const lastLevel = user?.levelRanges[user.levelRanges.length - 1]?.level?.level;
          return (lastLevel !== 'Level 1') && (lastLevel !== 'Level 2');
        }));
        setUsersAboveFour(users?.filter(user => {
          const lastLevel = user?.levelRanges[user?.levelRanges?.length - 1]?.level?.level;
          console.log(lastLevel);
          return (lastLevel !== 'Level 1') && (lastLevel !== 'Level 2') && (lastLevel !== 'Level 3');
        }));
        
       
      } catch (err) {
        setError(err);
        console.error(err);
      }
      setLoading(false);
    };

    getAllUsers();
  }, [token]);

  return { users, filteredUsers, usersAboveFour, loading, error };
};

export default useUserManagement;
