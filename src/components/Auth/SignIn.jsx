import { getIdToken, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth,  } from '../../utils/firebase/firebase';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../utils/redux/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from '../../constants/api';
import useUserDetails from './useUserDetails';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const nevigate = useNavigate();
  const { getUserDetails } = useUserDetails();

  // const [uid, setUid] = useState(null); // Track user ID
  // const [token, setToken] = useState(null);  // Store the token

  const dispatch = useDispatch();
  // useEffect(() => {
  //   const checkUserRole = async () => {
  //     // Get the current user
  //     const user = auth.currentUser;
  //     if (user) {
  //       // Get the user's ID token
  //       const token = await getIdToken(user);

  //       // Parse the token to get custom claims (including the role)
        // const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // console.log(decodedToken?.type);
  //     }
  //   };
 
  //   checkUserRole();
  // }, []);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUid(user.uid);
        getIdToken(user)
          .then((token) => {
            // setToken(token);
            dispatch(setUser({
              token:token,
            }));
            setConfirmation('Login successful!');
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // setUid(userCredential.user.uid);

      // Get token after successful sign-in
      const newToken = await getIdToken(userCredential.user);
      // const decodedToken = JSON.parse(atob(newToken.split('.')[1]));
      // setToken(newToken);
      
      dispatch(setUser({
        token:newToken,
        // type:decodedToken.type || null  
      }));
      getUserDetails()
      setConfirmation('Login successful!');
      nevigate("/")
      
    } catch (error) {
      setError(error.message);
    }
  };
 
 
  return (
    <div className="flex flex-col items-center justify-center h-screen">
       
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {confirmation ? (
          <>
          <p className="text-green-500 mb-4">{confirmation}</p>

          </>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded-md w-full"
              onClick={handleSignIn}
            //   disabled={loading}
            >
              {/* {loading ? 'Signing In...' : 'Sign In'} */}
              Sign In
            </button>
          </div>
        )}{!confirmation &&(  <p className="text-sm text-gray-600 mt-4">
        {/* Don't have an account? <Link to="/signUp" className="text-blue-500">Register</Link> */}
      </p>)}
      
      </div>
    </div>
  );
};

export default SignIn;