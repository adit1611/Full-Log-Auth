import {  motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Loader} from "lucide-react";
import {toast} from "react-hot-toast"
import { useAuthStore } from '../store/authStore';


function EmailVerification() {
    const [code,setCode] = useState(["","","","",""]);
    const inputRefs = useRef([]);
    const Navigate = useNavigate();
    const {error,isLoading,verifyEmail} =useAuthStore()
    const handleChange = (index,value) => {
        const newCode = [...code];

        if(value.length > 1){
            const pastedCode = value.slice(0,5).split(" ");
            for (let i = 0; i < 5; i++)
            {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
             const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
             const focusIndex = lastFilledIndex < 4 ? lastFilledIndex + 1 : 4;
             inputRefs.current[focusIndex].focus();
        }
        else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to next input input
            if(value && index <4) {
                inputRefs.current[index + 1].focus();
            }
        }
    };
    const handleKeyValue = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0){
            inputRefs.current[index-1].focus();
        }
    };
    // const isLoading = false;

    const handleVerify = async(e) => {
        e.preventDefault();
        const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			Navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
    };
        //AutoSubmit when All field submit
    useEffect(() => {
        if(code.every(digit => digit !== '')){
            handleVerify(new Event ('submit'));
        }
    },[code])


  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden'>
        <motion.div 
            initial= {{opacity: 0, y: -50}}
            animate= {{opacity: 1, y: 0}}
            transition={{duration:0.5}}
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
        >
            <h1 className='text-3xl font-bold mb-6 text-center bg-center bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text'>Verify your Account</h1>
            <p className='text-center text-gray-300 mb-6'>Enter the 5-digits code that sent your e-mail address</p>
            <form className='space-y-6' onSubmit={handleVerify}>
                <div className='flex justify-between'>
                    {code.map((digit, index) =>(
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type='text'
                            maxLength='5'
                            value={digit}
                            onChange={(e) => handleChange(index,e.target.value)}
                            onKeyDown={(e) => handleKeyValue(index,e)}
                            className='w-12 h-12 text-center text-2xl font-semibold bg-purple-300 text-fuchsia-600 border-2 border-gray-400 rounded-lg focus:border-emerald-600 focus:outline-dashed'
                        />
                    ))}
                </div>
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>} 
                <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition duration-200
                disabled:opacity-50'
                whileHover={{scale:1.02}}
                whileTap={{scale:0.98}}
                type='submit'
                disabled={isLoading || code.some((digit) => !digit)}> {isLoading ?<Loader className=' animate-spin mx-auto' size={24} /> : "Verify Email"}</motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default EmailVerification