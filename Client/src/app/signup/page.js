'use client';
import MessageBox from '@/components/MessageBox';
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Error from 'next/error';
import LoginDetailsContext from '@/Context/LoginDetailsContext';

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const [formDetails, setFormDetails] = useState({state:"",city:"",country:"India", fname: "", lname: "", email: "", otp: "", phone: "", address: "", password1: "", password2: "", pincode: "" })
    const [showPass, setshowPass] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    if (loginDetails.user)
        router.replace("/")
    function handleChange(evt) {
        setFormDetails((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        if (formDetails.password1 != formDetails.password2) {
            setShowMessage({ error: "true", message: "Passwords do not match", dismissable: true })
            return;
        }
        try {
            setShowMessage({ loading: true, message: "Creating Account...Please Wait!" })
            let res = await axios.post(`/api/register`, formDetails, { withCredentials: true })
            setShowMessage(false)
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Account Created" })
                loginDetails.setloginDetails((curr) => {
                    curr.user = true
                    curr.numCartItems = res.data.numCartItems
                    return ({ ...curr })
                })
                setTimeout(() => {
                    setShowMessage(false);
                    return router.replace("/")
                }, 1000);
            }
            else if(res.data.tokenExpired){
                setShowMessage({error:true,message:"Token expired!",dismissable:true})
                setTimeout(() => {
                    window.history.reload();
                }, 1000);
            }
            else {
                if (res.data.registered == "true")
                    setShowMessage({ error: true, message: "Mobile number already registered!",dismissable:true })
                else
                    throw new Error("Something went Wrong!")
            }
        }
        catch (error) {
            setShowMessage({ error: true, message: "Something went wrong!" })
            setTimeout(() => {
                setShowMessage(false)
            }, 2000);
        }
    }
    async function sendOTP() {
        try {
            setShowMessage({loading:true,message:"Sending OTP!"})
            let message = `OTP for Registering on Pahi's Choice:`;
            let res = await axios.post(`/api/api/send-otp`, { to: formDetails.email, text: message,checkIfUserRegistered:true })
            if (res.data.status == "success") {
                setOtpSent(true)
                setShowMessage({ success: true, message: "OTP sent!" })
                setTimeout(() => {
                    setShowMessage(false)
                }, 500);
            }
            else if(res.data.alreadyRegistered)
                setShowMessage({error:true,message:"Email already registered",dismissable:true})
            else throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Unable to send OTP. Please try later", dismissable: true })
        }
    }
    async function verifyOTP() {
        try {
            setShowMessage({loading:true,message:"Verifying OTP!"})
            let res=await axios.post(`/api/api/verify-otp`,formDetails,{withCredentials:true})
            console.log(res)
            setShowMessage(false)
            if(res.data.status=="success" && res.data.verified)
                setEmailVerified(true)
            else if(res.data.status=="success" && !res.data.verified)
                setShowMessage({error:true,message:"Wrong OTP!",dismissable:true})
            else if(res.data.otpExpired)
                setShowMessage({error:true,message:"OTP Expired!",dismissable:true})
        } catch (error) {
            setShowMessage({error:true,message:"Something went wrong!",dismissable:true})
        }
    }
    if (!emailVerified)
        return (
            <>
                {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
                <div className='mt-[42%] md:mt-[6rem] max-w-md mb-10 md:px-0 px-3 mx-auto'>
                    <div className="sm:mx-auto mb-10 sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-[6rem] w-auto" src="https://t3.ftcdn.net/jpg/05/53/79/60/240_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="Your Company" />
                        <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input disabled={otpSent} value={formDetails.email} onChange={handleChange} type="email" name="email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>
                    {!otpSent &&
                        <div className='text-center'>
                            <button onClick={sendOTP} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark-:bg-blue-600 dark-:hover:bg-blue-700 dark-:focus:ring-blue-800">Verify Email</button>
                        </div>
                    }
                    {otpSent &&
                        <>
                            <div className="relative z-0 w-full mb-5 group">
                                <input value={formDetails.otp} onChange={handleChange} type="tel" name="otp" id="otp" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="otp" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">OTP</label>
                            </div>
                            <div className="text-sm text-right">
                                <span role='button' onClick={sendOTP} className="font-semibold cursor-pointer leading-6 text-indigo-600 hover:text-indigo-500">Resend OTP</span>
                            </div>
                            <div className='text-center'>
                                <button onClick={verifyOTP} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark-:bg-blue-600 dark-:hover:bg-blue-700 dark-:focus:ring-blue-800">Continue</button>
                            </div>
                        </>
                    }
                </div>
            </>
        )
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <form onSubmit={handleSubmit} className="mt-[42%] md:mt-[6rem] max-w-md mb-10 md:px-0 px-3 mx-auto">
                <div className="sm:mx-auto mb-10 sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-[6rem] w-auto" src="https://t3.ftcdn.net/jpg/05/53/79/60/240_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="Your Company" />
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled={true} value={formDetails.email} onChange={handleChange} type="email" name="email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input value={formDetails.password1} onChange={handleChange} type={showPass ? "text" : "password"} name="password1" id="password1" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password1" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <input value={formDetails.password2} onChange={handleChange} type={showPass ? "text" : "password"} name="password2" id="floating_password2" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_password2" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                </div>
                <div>
                    <input onClick={() => { setshowPass(!showPass) }} type="checkbox" name="showPass" id="showPass" /> <label htmlFor='showPass' className="text-sm text-gray-500 dark-:text-gray-400">Show Password</label>
                </div>
                <div className="grid md:grid-cols-2  mt-4 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.fname} onChange={handleChange} type="text" name="fname" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.lname} onChange={handleChange} type="text" name="lname" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.phone} onChange={handleChange} type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.pincode} onChange={handleChange} type="tel" name="pincode" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Pincode</label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.state} onChange={handleChange} type="text"  name="state" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">State</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={formDetails.city} onChange={handleChange} type="text" name="city" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
                    </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="address" className="block mb-2 text-sm  text-gray-500 dark-:text-white">Address</label>
                    <textarea defaultValue={formDetails.address} onChange={handleChange} name='address' id="address" rows="4" className="block p-2.5 w-full text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark-:bg-gray-700 dark-:border-gray-600 dark-:placeholder-gray-400  dark-:text-white dark-:focus:ring-blue-500 dark-:focus:border-blue-500" placeholder=""></textarea>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark-:bg-blue-600 dark-:hover:bg-blue-700 dark-:focus:ring-blue-800">Submit</button>
            </form>
        </>
    )
}

export default Page;