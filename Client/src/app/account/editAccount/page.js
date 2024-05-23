'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext'
import MessageBox from '@/components/MessageBox'
import axios from 'axios';
import Error from 'next/error';
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const [formDetails, setFormDetails] = useState({ fname: "", lname: "", phone: "" })
    const [showMessage, setShowMessage] = useState(false)
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace("/login?returnTo=/account/editAccount")
    }, [loginDetails.user, router])
    useEffect(()=>{
        (async()=>{
            try {
                let res = await axios.get(`/api/account/editAccount`, { withCredentials: true })
                if(res.data.status!="success")
                    throw new Error("Error")
                setFormDetails({fname:res.data.fname,lname:res.data.lname,phone:res.data.phone})
            } catch (error) {
                setShowMessage({error:true,message:"Something went wrong!"})
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        })()
    },[])
    function handleChange(evt) {
        setFormDetails((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        if(formDetails.fname=="")
            return setShowMessage({error:true,message:"First name cannot be empty!",dismissable:true})
        if(formDetails.lname=="")
            return setShowMessage({error:true,message:"Last name cannot be empty!",dismissable:true})
        if(formDetails.phone=="")
            return setShowMessage({error:true,message:"Phone number cannot be empty!",dismissable:true})
        try {
            setShowMessage({ loading: true, message: "Updating Account...Please Wait!" })
            let res = await axios.post(`/api/account/editAccount`, formDetails, { withCredentials: true })
            setShowMessage(false)
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Account Updated!" })
                setTimeout(() => {
                    setShowMessage(false);
                    router.replace("/account")
                }, 1000);
            }
            else
                throw new Error("Something went Wrong!")
        }
        catch (error) {
            setShowMessage({ error: true, message: "Something went wrong!" })
            setTimeout(() => {
                setShowMessage(false)
            }, 2000);
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <form onSubmit={handleSubmit} className="mt-[42%] md:mt-[6rem] max-w-md mb-10 md:px-0 px-3 mx-auto">
                <div className="sm:mx-auto mb-10 sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-[6rem] w-auto" src="https://t3.ftcdn.net/jpg/05/53/79/60/240_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="Your Company" />
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Update your account
                    </h2>
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
                <div className="grid md:gap-6">
                    <div className="relative z-0 md:ms-[25%] md:w-[50%] mb-5 group">
                        <input value={formDetails.phone} onChange={handleChange} type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark-:text-white dark-:border-gray-600 dark-:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark-:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark-:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                    </div>
                </div>
                <div className='text-center'>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark-:bg-blue-600 dark-:hover:bg-blue-700 dark-:focus:ring-blue-800">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Page