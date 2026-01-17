import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContext);

  return (
    <div className="w-full bg-gray-50 shadow-blue-100 shadow-md h-20 flex justify-between items-center px-4 py-2 sm:p-6 sm:px-24 absolute top-0">
      
      {/* Logo Section */}
      <div className="flex items-center relative">
        <span className="material-symbols-outlined  logo-size-css text-gray-900">
          assured_workload
        </span>
        <span className="font-bold text-2xl text-blue-400 absolute left-12 top-2">
          <i>Auth</i>
        </span>
      </div>

      {
        userData ? 
        <div className="w-8 h-8 flex justify-center font-semibold items-center rounded-full bg-blue-900 text-white relative group">
          {userData.name[0]. toUpperCase()}
          <div className="absolute hidden group-hover:block top-8 right-0 z-10 text-amber-200 bg-black rounded p-4">
            <ul className="list-none m-0 p-2 text-sm">
              <li className="py-1 px-2 hover:bg-gray-800 cursor-pointer">Verify email</li>
              <li className="py-1 px-2 hover:bg-gray-800 cursor-pointer pr-10">Logout</li>
            </ul>
          </div>
        </div> 
        :  // Login Button 
          <button
            onClick={() => navigate("/login")}
            className="flex font-semibold text-blue-700 items-center gap-2 border border-gray-500 bg-gray-200 rounded-full px-6 py-2 hover:bg-gray-300 transition-all"
          >
            Login
            <span className="material-symbols-outlined text-xs text-gray-700 transition-all">
              trending_flat
            </span>
          </button>
        
      }

     
    </div>
  );
};

export default Navbar;