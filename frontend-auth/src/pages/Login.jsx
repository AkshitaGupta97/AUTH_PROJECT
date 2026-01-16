import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-400 to-pink-500">
      <p className="absolute left-5 sm:left-20 top-5 cursor-pointer">
        <span onClick={() => navigate('/')}
          className="material-symbols-outlined logo-size-css text-gray-900">
          assured_workload
        </span>
      </p>

     <div className="bg-slate-800 p-10 rounded-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">{state === 'Sign Up' ? "Create Account" : "Login Account!"} </h2>
        <p className="text-center mb-1.5">{state === 'Sign Up' ? "Create your account" : "Login to your account!"}</p>

        <form >

          {
            state === 'Sign Up' && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <span class="material-symbols-outlined text-amber-50">person</span>
                <input  onChange={e => setName(e.target.value)} value={name}
                  className="bg-transparent outline-none" type="text" placeholder="Full Name" required />
              </div>
            )
          }

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <span class="material-symbols-outlined text-amber-50">mark_email_unread</span>
            <input  onChange={e => setEmail(e.target.value)} value={email}
            className="bg-transparent outline-none" type="email" placeholder="Email id" required />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <span class="material-symbols-outlined text-amber-50">lock</span>
            <input onChange={e => setPassword(e.target.value)} value={password}
            className="bg-transparent outline-none" type="password" placeholder="Password" required />
          </div>

          <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-300 cursor-pointer">Forgot Password?</p>

          <button className="w-full py-2 cursor-pointer rounded-full bg-gradient-to-r text-amber-50 font-medium from-blue-600 to-purple-800">
            {state}
          </button>

        </form>

        {
          state === 'Sign Up' ? (
            <p className="text-center text-gray-400 text-xs  mt-2.5">Already have an account? {' '} 
              <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer  underline">Login here</span>
            </p>

          ) : (
            <p className="text-center text-gray-400 text-xs  mt-2.5">Don't have an account? {' '} 
              <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer  underline">Sign Up</span>
            </p>
          )
        }

     </div>
    </div>
  )
}


export default Login