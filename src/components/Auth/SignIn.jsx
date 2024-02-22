import { getIdToken, signInWithEmailAndPassword } from 'firebase/auth';
import { auth,  } from '../../utils/firebase/firebase';
import { useEffect, useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  
  useEffect(() => {
    const checkUserRole = async () => {
      // Get the current user
      const user = auth.currentUser;
      if (user) {
        // Get the user's ID token
        const token = await getIdToken(user);

        // Parse the token to get custom claims (including the role)
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken?.role);
      }
    };

    checkUserRole();
  }, []);
  const handleSignIn = async () => {
    try {
    //   setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const {uid, displayName, email: userEmail} = userCredential.user;
      const token  = await getIdToken(userCredential.user);
      console.log(token);
      
      setConfirmation('Login successful!');
    } catch (error) {
      setError(error.message);
    } finally {
    //   setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
       
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {confirmation ? (
          <p className="text-green-500 mb-4">{confirmation}</p>
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