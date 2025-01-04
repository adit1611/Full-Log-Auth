import React, { useState } from 'react';
import {motion} from 'framer-motion';
import {Mail, Lock, DoorOpen, Loader} from 'lucide-react'
import { Link } from 'react-router-dom'
import Input from "../component/Input";
import { useAuthStore } from '../store/authStore';

function Login() {

  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState("");
  const {login,isLoading, error} = useAuthStore();

  const handleLogin = async(e) => {
    e.preventDefault();
    await login(email,password)
  }

  return (
    <motion.div 
    initial = {{opacity:0, y:20}}
    animate = {{opacity:1,y:0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden'>
    <div className='p-8'>
    <h1 className='text-3xl font-bold mb-6 text-center bg-center bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text'>Reunite With Your Account</h1>
    <form onSubmit={handleLogin}>
                
            <Input
            icon={Mail}
            type='email'
            placeholder='E-mail Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <div className='px-4 py-4'>
                          
                            <Link to={"/forgot-password"} className='text-green-600'>Forgot-Password</Link>
                        </div>
                        {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}
            <motion.button 
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition duration-200 flex justify-center'
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type='submit' >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              <div className='flex justify-center'>
              <motion.div
              initial={{ scale: 0, rotateY: 90 }} // Door starts invisible and rotated
              animate={{ scale: 1, rotateY: 0 }}  // Door grows and rotates open
              transition={{
                duration: 1,        // Animation duration
                ease: "easeInOut",  // Smooth easing
                times: [0, 0.5, 1], // Timing control for animation phases
                repeat: Infinity,   // Loop the animation
                repeatType: "loop", // Continuous loop
              }}
              
            >
              <DoorOpen />
            </motion.div>
            <span>&nbsp;&nbsp;Go In</span>
              </div> )}           
            </motion.button>
    </form>
    
</div>
        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Don't have an account?{" "}
          <Link to='/signup' className='text-green-400 hover:underline'>
            Sign up
          </Link>
        </p>
        </div>
    </motion.div>
  )
}

export default Login