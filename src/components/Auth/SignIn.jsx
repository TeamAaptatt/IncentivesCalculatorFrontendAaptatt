import { getIdToken, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase/firebase';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../utils/redux/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';
import useUserDetails from './useUserDetails';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const { getUserDetails } = useUserDetails();
  const [authUser, setAuthUser] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);

        try {
          const token = await getIdToken(user);
          dispatch(setUser({ token }));
          setupTokenRefresh();

          setConfirmation('Login successful!');
          navigate('/');
        } catch (error) {
          setError(error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const setupTokenRefresh = () => {
    if (!authUser) {
      console.error('Error refreshing token: authUser is null');
      return;
    }
  
    const intervalId = setInterval(async () => {
      try {
        const token = await authUser.getIdToken();
        console.log('Token refreshed:', token);
      } catch (error) {
        console.error('Error refreshing token:', error.message);
      }
    }, 200); // Refresh token every hour

    return () => clearInterval(intervalId);
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const newToken = await getIdToken(userCredential.user);
      dispatch(setUser({ token: newToken }));

      const tokenRefreshInterval = setInterval(async () => {
        const refreshedToken = await getIdToken(userCredential.user);
        dispatch(setUser({ token: refreshedToken }));
      }, 55 * 60 * 1000);

      navigate('/');
      setConfirmation('Login successful!');
      getUserDetails();

      return () => clearInterval(tokenRefreshInterval);
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