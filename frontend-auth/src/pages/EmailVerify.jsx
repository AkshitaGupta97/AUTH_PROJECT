import { useNavigate } from "react-router-dom"
import { useRef } from "react";

const EmailVerify = () => {

  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-400 to-yellow-500" >

      <p className="absolute left-5 sm:left-20 top-5 cursor-pointer">
        <span onClick={() => navigate('/')}
          className="material-symbols-outlined logo-size-css text-gray-900">
          assured_workload
        </span>
      </p>

     <div>
      <form className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm" >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter 6-digit code send to your email id.</p>

        <div className="flex justify-between mb-8">
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required ref={e => inputRefs.current[index] = e}
              className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " />
          ) )}
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full">
          Verify Email
        </button>

      </form>
     </div>

    </div>
  )
}

export default EmailVerify