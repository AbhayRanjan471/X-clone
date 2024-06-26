import { Routes , Route, Navigate } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  
  //to fetch some data or get some request we will use "useQuery()"
  const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me"); // fetching the end user
				const data = await res.json();
				if (data.error) return null; // this means that user is unauthorised
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;

			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false, //we use this so that we don't see loading state for a long time
	});

  //if it's loading it will return the loading Spinner
   if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

  return (
    <div className='flex max-w-6xl mx-auto'>\
    {/* Common componenet, bcz it's not rapped with Routes */}
    {/* If the user is authenticated then we will show the <Slidbar> on the page , ye condition basically isliye diye hai taki <Slibar> har page me na show ho like login , signup page */}
    {authUser &&  <Sidebar/>} 
      <Routes>
                               {/* If the user is authenticated then redirect it to the Home page else redirect it to the Login Page */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to= '/login'/>}></Route>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to= '/'/>}></Route>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to= '/'/>}></Route>
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to= '/login'/>}></Route>
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to= '/login'/>}></Route>
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
      
    </div>
  );
}

export default App;
