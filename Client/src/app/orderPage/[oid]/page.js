'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox'
import axios from 'axios'
import Error from 'next/error'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

const Page = () => {
    const loginDetails = useContext(LoginDetailsContext)
    const { oid } = useParams()
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const searchParams = useSearchParams()
    const payment_id = searchParams.get('payment_id')
    const [showMessage, setShowMessage] = useState({ loading: true, message: "Getting Payment Details..." })
    const [gettingPaymentDetails, setGettingPaymentDetails] = useState(true)
    const [orderSuccessfull, setOrderSuccessfull] = useState(false)
    useEffect(() => {
        (async () => {
            try {
                if (!payment_id || !oid)
                    throw new Error("Error")
                let res = await axios.get(`/api/payment/checkPymentStatus?payment_id=${payment_id}&orderId=${oid}`, { withCredentials: true })
                if (res.data.status != "success")
                    throw new Error("Error")
                loginDetails.setloginDetails((curr) => {
                    curr.numCartItems = res.data.numCartItems
                    return ({ ...curr })
                })
                setOrderSuccessfull(res.data.paymentSuccessfull)
                setShowMessage(false)
            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!", dismissable: true })
            } finally {
                setGettingPaymentDetails(false)
            }
        })()
    }, [])
    if (gettingPaymentDetails)
        return (showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>)
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[5rem] md:mt-[8rem] border-[1px] rounded-md mx-5 md:mx-64 p-4'>
                <div>
                    {orderSuccessfull ?
                        <>
                            <div className='flex border-b-[1px] pb-2 mb-2 space-x-2 items-center'>
                                <FaCheckCircle className='text-2xl text-green-500' />
                                <h1 className='text-xl font-semibold text-green-500'>Order successful</h1>
                            </div>
                            <h1>Thank you for ordering. Your order was successful. Please check order details for further information.</h1>
                            <div className='flex mt-2 space-x-1 md:text-base text-sm text-md text-indigo-600 items-center'>
                                <Link href={`/account/myorders/${oid}`}>
                                    <span>View order details</span>
                                </Link>
                                <FaArrowRightLong />
                            </div>
                        </>
                        :
                        <>
                            <div className='flex border-b-[1px] pb-2 mb-2 space-x-2 items-center'>
                                <IoMdCloseCircle className='text-2xl text-red-500' />
                                <h1 className='text-xl font-semibold text-red-500'>Order failed</h1>
                            </div>
                            <h1>Sorry, your order failed. Please try again.</h1>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Page