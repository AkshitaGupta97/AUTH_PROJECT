import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="flex font-semibold text-blue-700 items-center gap-2 border border-gray-500 bg-gray-200 rounded-full px-6 py-2 hover:bg-gray-300 transition-all"
      >
        Login
        <span className="material-symbols-outlined text-xs text-gray-700 transition-all">
          trending_flat
        </span>
      </button>
    </div>
  );
};

export default Navbar;