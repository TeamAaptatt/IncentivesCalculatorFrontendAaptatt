import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../constants/api";
import { setUserData } from "../../utils/redux/userSlice";

const useUserDetails = () => {
  const token = useSelector((state) => state.auth.token.token)||null;
  console.log(token);
  const dispatch = useDispatch();

  const getUserDetails = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.get(BASE_URL + "user-me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      if (response.status === 200) {
        dispatch(
          setUserData({
            userData: data,
          })
        );

        console.log(data);
      } else {
        console.log(response.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Call getUserDetails when the component using this hook mounts
    getUserDetails();
  }, [token, dispatch]);

  return {
    getUserDetails, // Return the function to be used externally
  };
};

export default useUserDetails;
