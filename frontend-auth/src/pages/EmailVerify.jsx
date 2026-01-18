import { useNavigate } from "react-router-dom"
import { useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useEffect } from "react";

const EmailVerify = () => {
  
  axios.defaults.withCredentials = true;

  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1 ){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index-1].focus(); // move to previous input
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');  // clipboard gives the data you copied or paste
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      // - Collects all input values into an array, then joins them into a single OTP string.
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/')
      }
      else {
        toast.error(data.message);
      }

    } catch (error) {
        toast.error(error.message);
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-400 to-yellow-500" >

      <p className="absolute left-5 sm:left-20 top-5 cursor-pointer">
        <span onClick={() => navigate('/')}
          className="material-symbols-outlined logo-size-css text-gray-900">
          assured_workload
        </span>
      </p>

     <div>
      <form onSubmit={onSubmitHandler}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm" >
          
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter 6-digit code send to your email id.</p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " />
          ) )}
        </div>

        <button type="submit" className="w-full py-3 bg-gradient-to-r cursor-pointer from-indigo-500 to-indigo-800 text-white rounded-full">
          Verify Email
        </button>

      </form>
     </div>

    </div>
  )
}

export default EmailVerify

/*
- useRef(initialValue) creates a mutable object that React will keep the same between renders. - { current: initialValue }

const inputRefs = useRef([]);
- inputRefs.current - starts as an empty array.

ref={e => inputRefs.current[index] = e}
- Each input element is stored in the array at its position.
- Example after rendering 6 inputs:
inputRefs.current = [
  HTMLInputElement, // index 0
  HTMLInputElement, // index 1
  ...
  HTMLInputElement  // index 5
]
  *****
  1. const paste = e.clipboardData.getData('text');
- e is the paste event triggered when the user pastes something.
- e.clipboardData.getData('text') retrieves the plain text from the clipboard.
- Example: If the user copies 123456 and pastes it, paste will be "123456".
-split('') : - "123456".split('') → ["1", "2", "3", "4", "5", "6"].
3. pasteArray.forEach((char, index) => { ... }): - char is the digit (like "1", "2", etc.). - index is the position (0–5 for a 6-digit OTP).
5. inputRefs.current[index].value = char;
- - inputRefs.current[0].value = "1"
- inputRefs.current[1].value = "2"


*/