import { getIdToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../utils/firebase/firebase';

const UserTypeCheck = ({ admin, user }) => {
    const [userType, setUserType] = useState(null);
    const token = useSelector((store)=>store.auth.token?.token) || '';
    useEffect(() => {
      const checkUserType = () => {
          try {
            const decodedToken = JSON.parse(atob(token?.split('.')[1]));
            const type = decodedToken?.type || null;
            setUserType(type);
          } catch (error) {
            console.error('Error fetching user type:', error);
          }
        
      };
  
      checkUserType();
    }, [token]); // Empty dependency array to run the effect once when the component mounts
  
    console.log(userType);
  
    return (
      <>
        {userType === 'admin' && admin}
        {userType === 'user' && user}
      </>
    );
  };
  
export default UserTypeCheck;
