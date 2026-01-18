import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import { toast } from "react-toastify";

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSet] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const onSubmitEmail = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSet(true)

    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');

    } catch (error) {
      toast.error(error.message);
    }
  }

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-amber-200 to-purple-500">
      <p className="absolute left-5 sm:left-20 top-5 cursor-pointer">
        <span onClick={() => navigate('/')}
          className="material-symbols-outlined logo-size-css text-gray-900">
          assured_workload
        </span>
      </p>

      <div className="flex justify-center items-center gap-2">

        {
          !isEmailSent &&

          <form onSubmit={onSubmitEmail}
           className="bg-slate-800 p-8 py-9 rounded-lg shadow-lg w-96 text-sm">

            <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter your registered email</p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <span className="material-symbols-outlined text-amber-50">mark_email_unread</span>
              <input type="email" placeholder="Enter email" required className="bg-transparent outline-none text-white"
                value={email} onChange={e => setEmail(e.target.value)} />

            </div>
            <button className="w-full py-2.5 cursor-pointer font-semibold bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-full mt-3">
              Submit
            </button>
          </form>
        }

        {/* Otp input form : - Shows OTP input form if email is sent but OTP not yet submitted. */}

        {
          !isOtpSubmitted && isEmailSent &&
          <form onSubmit={onSubmitOtp}
            className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm" >

            <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
            <p className="text-center mb-6 text-indigo-300">Enter 6-digit code send to your email id.</p>

            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type="text" maxLength='1' key={index} required ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " />
              ))}
            </div>

            <button type="submit" className="w-full py-2.5 bg-gradient-to-r cursor-pointer from-indigo-500 to-pink-400 text-white rounded-full">
              Verify Email
            </button>

          </form>
        }

        {/* enter new password */}

        {
          isOtpSubmitted && isEmailSent &&
          <form onSubmit={onSubmitNewPassword}
            className="bg-slate-800 p-8 py-9 rounded-lg shadow-lg w-96 text-sm">

            <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter new password below</p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <span className="material-symbols-outlined text-amber-50">lock</span>
              <input type="password" placeholder="Enter password" required className="bg-transparent outline-none text-white"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />

            </div>
            <button className="w-full py-2.5 cursor-pointer font-semibold bg-gradient-to-r from-indigo-600 to-yellow-600 text-white rounded-full mt-3">
              Submit
            </button>
          </form>
        }


      </div>


    </div>
  )
}

export default ResetPassword