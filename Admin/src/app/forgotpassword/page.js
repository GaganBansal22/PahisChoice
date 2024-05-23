'use client';
import MessageBox from '@/Components/MessageBox'
import axios from 'axios';
import Error from 'next/error';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const [formDetails, setFormDetails] = useState({ email: "", otp: "", password1: "", password2: "" })
    const [showPass, setshowPass] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [OTPVerified, setOTPVerified] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    function handleChange(evt) {
        setFormDetails((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function sendOTP() {
        try {
            setShowMessage({ loading: true, message: "Sending OTP!" })
            let message = `OTP for Changing Password on Pahi's Choice:`;
            let res = await axios.post(`/api/api/send-otp`, { to: formDetails.email, text: message, isAdmin: true })
            if (res.data.status == "success") {
                setOtpSent(true)
                setShowMessage({ success: true, message: "OTP sent!" })
                setTimeout(() => {
                    setShowMessage(false)
                }, 500);
            }
            else if (res.data.notRegistered)
                setShowMessage({ error: true, message: "You are not a registered user", dismissable: true })
            else throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Unable to send OTP. Please try later", dismissable: true })
        }
    }
    async function verifyOTP() {
        try {
            setShowMessage({loading:true,message:"Verifying OTP!"})
            let res=await axios.post(`/api/api/verify-otp`,formDetails,{withCredentials:true})
            setShowMessage(false)
            if(res.data.status=="success" && res.data.verified)
                setOTPVerified(true)
            else if(res.data.status=="success" && !res.data.verified)
                setShowMessage({error:true,message:"Wrong OTP!",dismissable:true})
            else if(res.data.otpExpired)
                setShowMessage({error:true,message:"OTP Expired!",dismissable:true})
        } catch (error) {
            setShowMessage({error:true,message:"Something went wrong!",dismissable:true})
        }
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        if (formDetails.password1 != formDetails.password2) {
            setShowMessage({ error: true, message: "Passwords do not match!", dismissable: true })
            return;
        }
        try {
            setShowMessage({ loading: true, message: "Updating Password!" })
            let res = await axios.post(`/api/admin/forgotpassword`, formDetails, { withCredentials: true })
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Password Updated!" })
                setTimeout(() => {
                    router.replace("/")
                }, 500);
            }
            else throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something went wrong!", dismissable: true })
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[42%] md:mt-[10rem] max-w-md mb-10 md:px-0 px-3 mx-auto'>
                <h2 className="mt-3 mb-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Reset Password
                </h2>
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled={otpSent} value={formDetails.email} onChange={handleChange} type="email" name="email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                </div>
                {!otpSent &&
                    <div className='text-center'>
                        <button onClick={sendOTP} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verify Email</button>
                    </div>
                }
                {otpSent &&
                    <>
                        <div className="relative z-0 w-full mb-5 group">
                            <input disabled={OTPVerified} value={formDetails.otp} onChange={handleChange} type="tel" name="otp" id="otp" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="otp" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">OTP</label>
                        </div>
                        {!OTPVerified &&
                            <>
                                <div className="text-sm text-right">
                                    <span role='button' onClick={sendOTP} className="font-semibold cursor-pointer leading-6 text-indigo-600 hover:text-indigo-500">Resend OTP</span>
                                </div>
                                <div className='text-center'>
                                    <button onClick={verifyOTP} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continue</button>
                                </div>
                            </>
                        }
                    </>
                }
                {OTPVerified &&
                    <form onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input value={formDetails.password1} onChange={handleChange} type={showPass ? "text" : "password"} name="password1" id="password1" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="password1" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input value={formDetails.password2} onChange={handleChange} type={showPass ? "text" : "password"} name="password2" id="password2" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="password2" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password</label>
                        </div>
                        <div>
                            <input onClick={() => { setshowPass(!showPass) }} type="checkbox" name="showPass" id="showPass" /> <label htmlFor='showPass' className="text-sm text-gray-500 dark:text-gray-400">Show Password</label>
                        </div>
                        <div className='text-center'>
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>
                    </form>
                }
            </div>
        </>
    )
}

export default Page