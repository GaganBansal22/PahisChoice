'use client';
import React, { useContext, useEffect, useState } from 'react'
import LoginDetailsContext from '@/Context/LoginDetailsContext'
import { useRouter } from 'next/navigation'
import { BsBoxSeam } from "react-icons/bs";
import { FaAddressBook, FaHeart, FaRegEdit } from "react-icons/fa";
import Link from 'next/link';
import { MdOutlineEmail, MdPassword } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import axios from 'axios';
import MessageBox from '@/components/MessageBox';
import { FiPhoneCall } from 'react-icons/fi';

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const loginDetails = useContext(LoginDetailsContext)
    const router = useRouter()
    const [showMessage, setShowMessage] = useState(false)
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace("/login?returnTo=/account")
    }, [loginDetails.user, router])
    async function LogoutUser() {
        let res = await axios.post(`/api/logout`, {}, { withCredentials: true })
        if (res.data.loggedOut) {
            setShowMessage({ success: true, message: "Logged Out successfully!" })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        else {
            setShowMessage({ error: true, message: "Something went Wrong!" })
            setTimeout(() => {
                setShowMessage(false)
            }, 1000);
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}

            <div className='mt-[3rem] md:mt-[4rem] p-4 md:w-2/5 md:mx-auto'>
                <h1 className='mt-3 mb-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 '>Your Account</h1>
                <div className=' flex flex-col border-[1px] border-slate-200  rounded-xl text-slate-700'>
                    <Link href={'/account/myorders'}>
                        <div className='flex items-center space-x-3 md:py-5 md:pl-5 md:text-lg border-b-[1px] py-2 pl-3 hover:bg-slate-100 rounded-t-xl cursor-pointer'>
                            <BsBoxSeam className='text-xl md:text-3xl' />
                            <span>Your Orders</span>
                        </div>
                    </Link>
                    <Link href={'/account/wishlist'}>
                        <div className='flex items-center space-x-3 border-b-[1px] md:text-lg py-2 pl-3 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5'>
                            <FaHeart className='text-red-500 m-0 text-xl md:text-3xl' />
                            <span>Wishlist</span>
                        </div>
                    </Link>
                    <Link href='./account/editAccount'>
                        <div className='flex items-center space-x-3 border-b-[1px] md:text-lg pl-3 py-2 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5'>
                            <FaRegEdit className='text-xl md:text-3xl' />
                            <span>Edit Account</span>
                        </div>
                    </Link>
                    <Link href='./account/email'>
                        <div className='flex items-center space-x-3 border-b-[1px] md:text-lg pl-3 py-2 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5'>
                            <MdOutlineEmail className='text-xl md:text-3xl' />
                            <span>Update E-mail</span>
                        </div>
                    </Link>
                    <Link href='/forgotpassword'>
                        <div className='flex items-center space-x-3 border-b-[1px] md:text-lg pl-3 py-2 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5'>
                            <MdPassword className='text-xl md:text-3xl' />
                            <span>Reset Password</span>
                        </div>
                    </Link>
                    <Link href='./account/addresses'>
                        <div className='flex items-center space-x-3 border-b-[1px] md:text-lg pl-3 py-2 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5'>
                            <FaAddressBook className='text-xl md:text-3xl' />
                            <span>Your Addresses</span>
                        </div>
                    </Link>
                    <div className='flex items-center space-x-3 border-b-[1px] md:text-lg pl-3 py-2 hover:bg-slate-100 cursor-pointer md:py-5 md:pl-5' >
                        <FiPhoneCall className='text-xl md:text-3xl' />
                        <span>Contact Us</span>
                    </div>
                    <div onClick={LogoutUser} className='py-2 pl-3 flex items-center md:text-lg space-x-3 hover:bg-slate-100 rounded-b-xl cursor-pointer md:py-5 md:pl-5'>
                        <GoSignOut className='text-xl md:text-3xl' />
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page