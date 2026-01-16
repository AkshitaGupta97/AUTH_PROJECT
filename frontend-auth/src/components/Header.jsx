import { useContext } from "react"
import { AppContext } from "../context/AppContext"

const Header = () => {

  const {userData} = useContext(AppContext);

  return (
    <div className="mt-32 flex flex-col items-center px-4">
        <img src="https://img.freepik.com/premium-psd/3d-cartoon-beautiful-woman-glasses-character-saying-hi-transparent-background-generative-ai_875755-151.jpg" alt="header" className="w-56 h-64 rounded-full mb-6" />
        <h1 className="flex items-center gap-2 text-amber-100 text-xl sm:text-2xl font-medium mb-2">Hey {userData? userData.name : 'Developer...' } </h1>
        <h2 className="text-2xl text-blue-300 sm:text-3xl font-semibold mb-2">Welcome to <i className="font-bold text-xl text-blue-600">Auth</i> app.</h2>
        <p className="mb-4 max-w-md">👉 Your privacy and security are our top priority. Start your journey with confidence!</p>
        <button className="border border-gray-500 rounded-full font-medium px-8 py-2.5 hover:bg-gray-100 hover:text-gray-900 transition-all">Get Started</button>
    </div>
  )
}

export default Header