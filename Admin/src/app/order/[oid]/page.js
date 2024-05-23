'use client';
import MessageBox from '@/Components/MessageBox';
import axios from 'axios';
import Error from 'next/error';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const { oid } = useParams()
    const [orderDetails, setOrderDetails] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [currStatus, setCurrStatus] = useState('Placed')
    useEffect(() => {
        (async () => {
            try {
                let res = await axios.get(`/api/admin/orders/${oid}`, { withCredentials: true })
                if (res.data.status != "success")
                    throw new Error("Server error")
                if (res.data.orderNotFound) {
                    setShowMessage({ error: true, message: "Order not found!" })
                    setTimeout(() => {
                        router.back()
                    }, 1000);
                }
                setOrderDetails(res.data.orderDetails)
                setCurrStatus(res.data.orderDetails.status)

            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        })()
    }, [])
    const status = {
        Placed: {
            width: 'w-1/4',
            loc: 0,
        },
        Processing: {
            text: "Your order is currently being processed.",
            width: 'w-2/4',
            loc: 1,
        },
        Shipped: {
            text: 'Your order has been shipped.',
            width: 'w-3/4',
            loc: 2,
        },
        Delivered: {
            text: `Your order was delivered on ${orderDetails && formatDate(orderDetails.createdAt)}.`,
            width: 'w-full',
            loc: 3,
        },
        Pending: {
            loc: 4,
            text: "",
            width: "w-full",
        },
        'Payment Failed': {
            loc: 5,
            text: "",
            width: "w-full",
        },
        Cancelled: {
            loc: 6,
            text: "",
            width: "w-full",
        }
    }
    let isActive = [false, false, false, false]
    for (let i = 0; i < status[currStatus].loc + 1; i++)
        isActive[i] = true;
    const handleStatusChange = async () => {
        try {
            const res = await axios.get(`/api/admin/update-order-status/${oid}?status=${currStatus}`, { withCredentials: true })
            setShowMessage({ success: true, message: "Status UPdated" })
            setTimeout(() => {
                setShowMessage(false)
            }, 500);
        } catch (error) {
            setShowMessage({ error: true, message: "Error updating status" })
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            {orderDetails &&
                <div className='mb-[6rem] md:border-[1px] border-slate-200 md:rounded-md md:mx-5 p-5'>
                    <div className='flex md:flex-row flex-col md:justify-between md:items-center'>
                        <div>
                            <h1 className='md:text-3xl text-xl font-bold'>Order Details</h1>
                            <div className='md:flex justify-between'>
                                <div className='md:flex items-center md:space-x-1  mt-1'>
                                    <h1 className='text-gray-500 text-sm'>Order number</h1>
                                    <span className='pr-1 text-sm md:text-base md:pr-0'>{orderDetails.orderId}</span>
                                    <span className='pr-1 md:pr-0'>·</span>
                                    <span className='text-sm'>
                                        {orderDetails.createdAt && formatDate(orderDetails.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center mt-3 md:mt-0'>
                            <h1>Status:</h1>
                            <select onChange={(e) => setCurrStatus(e.target.value)} value={currStatus} className='h-10 border-[1px] rounded-md p-1 ml-2 cursor-pointer'>
                                <option value="Pending">Pending</option>
                                <option value="Payment Failed">Payment Failed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button onClick={handleStatusChange} className='bg-indigo-500 px-4 py-1 ml-2 cursor-pointer active:bg-indigo-400 rounded-md text-white'>
                                Set
                            </button>
                        </div>
                    </div>
                    <div className='mt-6 pt-6  border-t-[1px] '>
                        {orderDetails.products.map((product) => {
                            return (
                                <div key={product.pid._id} className='md:flex mb-5'>
                                    <Link href={`/product/${product.pid._id}`}><img src={product.pid.images[0].url} className='md:h-auto md:w-52 rounded-md w-full h-auto' /></Link>
                                    <div className='md:pl-8 mt-5 md:mt-0'>
                                        <Link href={`/product/${product.pid._id}`}>
                                            <h1 className='text-lg md:text-xl pb-1 font-medium'>{product.pid.name}</h1>
                                        </Link>
                                        <h1 className='text-base mb-2 font-medium'>₹{product.sellingPrice}</h1>
                                        <div className='text-sm text-gray-500'>
                                            <span >{product.pid.color} | </span>
                                            <span>{product.pid.size}</span>
                                        </div>
                                        <span className='text-gray-500 text-sm'>
                                            Quantity: {product.quantity}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className='md:flex justify-between mt-5 mb-4 border-b-[1px] pb-5'>
                            <div className='md:w-2/5'>
                                <h1 className='pb-1'>Delivery address</h1>
                                <span className='text-gray-500 text-sm md:text-base'>
                                    {orderDetails.userAddress},{orderDetails.userPincode}
                                </span>
                            </div>
                            <div className='md:w-2/5 mt-2 md:mt-0 flex flex-col'>
                                <h1 className='pb-1'>Contact details</h1>
                                <span className='text-gray-500 text-sm md:text-base'>{orderDetails.user.email}</span>
                                <span className='text-gray-500 text-sm md:text-base'>{orderDetails.userPhone}</span>
                            </div>
                        </div>
                    </div>
                    <div className='my-6 md:my-8'>
                        {orderDetails.status == 'Processing' || orderDetails.status == 'Shipped' || orderDetails.status == 'Delivered' ?
                            <>
                                <h1 className=' md:text-lg font-semibold'>{status[currStatus].text}</h1>
                                <div className='relative mt-3 pb-2 mx-auto'>
                                    <div className='border-b-8 rounded-full'></div>
                                    <div className={`absolute top-0 border-b-8 rounded-full border-indigo-700 ${status[currStatus].width}`}></div>
                                </div>
                                <div className='text-xs md:text-base hidden sm:flex justify-between'>
                                    <h1 className={`${isActive[0] && 'font-bold text-indigo-700'}`}>Order Placed</h1>
                                    <h1 className={`${isActive[1] && 'font-bold text-indigo-700'}`}>Processing</h1>
                                    <h1 className={`${isActive[2] && 'font-bold text-indigo-700'}`}>Shipped</h1>
                                    <h1 className={`${isActive[3] && 'font-bold text-indigo-700'}`}>Delivered</h1>
                                </div>
                            </>
                            :
                            <>
                                {orderDetails.status == 'Pending' &&
                                    <h1 className='md:text-lg font-semibold text-yellow-500'>Payment Pending</h1>
                                }
                                {orderDetails.status == 'Payment Failed' &&
                                    <h1 className='md:text-lg font-semibold text-red-500'>Payment Failed</h1>
                                }
                                {orderDetails.status == 'Cancelled' &&
                                    <h1 className='md:text-lg font-semibold text-red-500'>Cancelled</h1>
                                }
                            </>
                        }
                    </div>
                    <div className='bg-slate-100 px-4 pb-4 md:pb-0 rounded-md md:p-5 '>
                        <div className='md:flex justify-between md:px-5  pt-4 pb-4 w-full md:mt-5 md:mb-4 border-b-[1px] md:pb-5  md:pr-8'>
                            <div className='md:w-1/3'>
                                <h1 className='md:pb-1'>Billing address</h1>
                                <span className='text-gray-500 md:text-base text-sm'>
                                    <span className='block'>{orderDetails.userAddress}</span>
                                    <span className='block'>{orderDetails.userCity},{orderDetails.userState}</span>
                                    <span className='block'>{orderDetails.userCountry}</span>
                                    <span className='block'>{orderDetails.userPincode}</span>
                                </span>
                            </div>
                            <div className='flex flex-col mt-3 md:mt-0'>
                                <h1 className='pb-1'>Payment Id</h1>
                                <span className='text-gray-500 md:text-base text-sm'>{orderDetails.paymentId}</span>
                            </div>
                        </div>
                        <div >
                            <div className='flex justify-between  md:px-5 py-4 mt-3 border-b-[1px]'>
                                <span className='text-gray-500'>Subtotal</span>
                                <span className='font-medium'>₹{orderDetails.subTotalAmount}</span>
                            </div>
                            <div className='flex justify-between  md:px-5 py-5 mt-3 border-b-[1px]'>
                                <span className='text-gray-500'>Shipping</span>
                                <span className='font-medium'>₹{orderDetails.deliveryFeeAmount}</span>
                            </div>
                            {/* <div className='flex justify-between  md:px-5 py-5 mt-3 border-b-[1px]'>
                            <span className='text-gray-500'>Tax GST (18%)</span>
                            <span className='font-medium'>₹6.16</span>
                        </div> */}
                            <div className='flex justify-between  md:px-5 py-5 mt-3  border-b-[1px]'>
                                <span className='font-medium'>Order total</span>
                                <span className='font-semibold text-indigo-600'>₹{orderDetails.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Page

function formatDate(inputDate) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(inputDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}