import { getIdToken, onIdTokenChanged} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../utils/firebase/firebase';
import { setUser } from '../utils/redux/authSlice/authSlice';

const UserTypeCheck = ({ admin, user }) => {
    const [userType, setUserType] = useState(null);
    const token = useSelector((store)=>store.auth?.token?.token) || '';
    const dispatch =useDispatch();
    useEffect(() => {
      
      const checkUserType = () => {
          try {
            const decodedToken = JSON.parse(atob(token?.split('.')[1]));
            console.log('d',decodedToken);
            const type = decodedToken?.type || 'user';
            setUserType(type);
          } catch (error) {
            console.error('Error fetching user type:', error);
          }
        
      };
  
      checkUserType();

      const unsubscribe = onIdTokenChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          // Dispatch action to update the token in your Redux store
          dispatch(setUser({token }));

        }
      });
  
      
      // Refresh token every 50 minutes
      const intervalId = setInterval(async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const token= await getIdToken(user,  true);
                      dispatch(setUser({token }));
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 300000 );  
    
      return () => {
        clearInterval(intervalId);
        unsubscribe();
      };
  

    }, [token, dispatch]); 
  
    console.log(userType);
    useEffect(()=>{
         setTokenOnFirstRender();
    }, [])

    const setTokenOnFirstRender = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token= await getIdToken(user,  true);
                    dispatch(setUser({token }));
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  //   useEffect(()=>{
  //     const user = JSON.parse(localStorage.getItem('User'))
  //       getToken(user)
  // }, [])

  // const getToken = async (user) =>{
  //   if (user) {
  //     const token= await getIdToken(user,  true);
  //               dispatch(setUser({token }));
  //   }
  // }
  
    return (
      <>
        {userType === 'admin' && admin}
        {userType === 'user' && user}
      </>
    );
  };
  
export default UserTypeCheck;
