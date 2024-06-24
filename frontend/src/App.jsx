import { Routes , Route } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

function App() {
  

  return (
    <div className='flex max-w-6xl mx-auto'>\
    {/* Common componenet, bcz it's not rapped with Routes */}
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/notifications" element={<NotificationPage />}></Route>
        <Route path="/profile/:username" element={<ProfilePage />}></Route>
      </Routes>
      <RightPanel/>
      
    </div>
  );
}

export default App;
