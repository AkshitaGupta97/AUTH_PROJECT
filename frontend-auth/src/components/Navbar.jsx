import logo from "../../public/logo.avif"

const Navbar = () => {
  return (
    <div className="w-full bg-gray-50 shadow-blue-100 shadow-md h-20 flex justify-between items-center px-4 py-2 sm:p-6 sm:px-24 absolute top-0">
      <div className="flex items-center relative"><img src={logo} className="w-20 sm:w-20" alt="logo" /><span className="font-bold text-2xl text-blue-800 absolute left-4 top-7"><i>Auth</i></span></div>
      <button className="flex font-semibold text-blue-700 items-center gap-2 border border-gray-500 bg-gray-200 rounded-full px-6
      py-2  hover:bg-gray-300 transition-all">Login <span class="material-symbols-outlined">trending_flat</span></button>
    </div>
  )
}

export default Navbar;