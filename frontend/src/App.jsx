import { Routes , Route } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from "./pages/auth/signup/SignUpPage";

function App() {
  

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
