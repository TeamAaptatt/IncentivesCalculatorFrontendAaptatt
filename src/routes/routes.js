import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Layout from "../layout/Layout";
import Dashboard from "../components/user/Dashboard/UserDashboard";
import AdminDashboard from "../components/user/Dashboard/AdminDashboard";
import UserTypeCheck from "./UserTypeCheck";
import UserDashboard from "../components/user/Dashboard/UserDashboard";
import SignIn from "../components/Auth/SignIn";
import UserPage from "../components/user/pages/adminPages/UserPage";
import Profile from "../components/user/Profile/UserProfile";
import AdminProfile from "../components/user/Profile/AdminProfile";
import UserProfile from "../components/user/Profile/UserProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute children={<Layout />} />,
    children: [
      {
        path: "/",
        element:(
            <UserTypeCheck admin={<AdminDashboard/>}
            user={<UserProfile/>}
            />
        ),
      },
      {
        path:"/userPage/:userId",
        element:(
          <UserTypeCheck admin={<UserPage/>}
          user={<UserDashboard/>}
          />
      ),      },{
        path:"/profile",
        element:<UserTypeCheck admin={<AdminProfile/>} user={<UserProfile/>}/>
      }
     
    ],
  },
   {
    path:"/signIn",
    element:<SignIn/>
  }
]);

export default router;
