'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox';
import axios from 'axios';
import Error from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const [orderDetails, setOrderDetails] = useState([])
    const [orderDetailsFalied, setOrderDetailsFalied] = useState([])
    const [failedOrderFetched, setFailedOrderFetched] = useState(false)
    const [currentPageNumberFailed, setCurrentPageNumberFailed] = useState(1)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [totalPagesFailed, setTotalPagesFailed] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showMessage, setShowMessage] = useState(false)
    const [showFailedOrders, setShowFailedOrders] = useState(false)
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace(`/login?returnTo=/account/myorders`)
    }, [loginDetails.user, router])
    useEffect(() => {
        getOrders(1)
    }, [])
    async function getOrders(page) {
        try {
            setShowMessage({ loading: true, message: "Loading Orders..." })
            let res = await axios.get(`/api/account/myorders?page=${page}`, { withCredentials: true })
            if (res.data.status != "success")
                throw new Error("Server error")
            setShowMessage(false)
            setOrderDetails(res.data.orderDetails)
            setCurrentPageNumber(res.data.currentPage)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            setShowMessage({ error: true, message: "Something went wrong!" })
            setTimeout(() => {
                router.back()
            }, 1000);
        }
    }
    async function getFaliedOrders(page) {
        try {
            setShowMessage({ loading: true, message: "Loading Orders..." })
            let res = await axios.get(`/api/account/myordersFalied?page=${page}`, { withCredentials: true })
            if (res.data.status != "success")
                throw new Error("Server error")
            setShowMessage(false)
            setOrderDetailsFalied(res.data.orderDetails)
            setCurrentPageNumberFailed(res.data.currentPage)
            setTotalPagesFailed(res.data.totalPages)
            setFailedOrderFetched(true)
        } catch (error) {
            setShowMessage({ error: true, message: "Something went wrong!" })
            setTimeout(() => {
                router.back()
            }, 1000);
        }
    }
    async function loadMoreProducts(loadFaliedOrders){
        setShowMessage({loading:true,message:"Loading more orders..."})
        if(loadFaliedOrders){
            try {
                let res = await axios.get(`/api/account/myordersFalied?page=${currentPageNumberFailed+1}`, { withCredentials: true })
                if (res.data.status != "success")
                    throw new Error("Server error")
                setShowMessage(false)
                setOrderDetailsFalied((curr)=>{
                    return ([...curr,...res.data.orderDetails])
                })
                setCurrentPageNumberFailed(res.data.currentPage)
                setTotalPagesFailed(res.data.totalPages)
            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        }
        else{
            try {
                let res = await axios.get(`/api/account/myorders?page=${currentPageNumber+1}`, { withCredentials: true })
                if (res.data.status != "success")
                    throw new Error("Server error")
                setShowMessage(false)
                setOrderDetails((curr)=>{
                    return ([...curr,...res.data.orderDetails])
                })
                setCurrentPageNumber(res.data.currentPage)
                setTotalPages(res.data.totalPages)
            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        }
    }
    useEffect(() => {
        if (showFailedOrders && !failedOrderFetched)
            getFaliedOrders(1)
    }, [showFailedOrders])
    return (
        <div className='my-[5rem] md:mt-[8rem]'>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            {!showFailedOrders && <DisplayOrders loadMoreProducts={loadMoreProducts} orderDetails={orderDetails} showFailedOrders={showFailedOrders} setShowFailedOrders={setShowFailedOrders} currentPageNumber={currentPageNumber} totalPages={totalPages} />}
            {showFailedOrders && <DisplayOrders loadMoreProducts={loadMoreProducts} orderDetails={orderDetailsFalied} showFailedOrders={showFailedOrders} setShowFailedOrders={setShowFailedOrders} currentPageNumber={currentPageNumberFailed} totalPages={totalPagesFailed} />}
        </div>
    )
}

export default Page

function DisplayProduct({ product }) {
    return (
        <div>
            <div className='mt-5 px-6 '>
                <div className='flex  items-center space-x-5 text-sm'>
                    <Link href={`/product/${product.pid._id}`}>
                        <img src={product.pid.images[0].url} className='rounded w-28 md:w-32'></img>
                    </Link>
                    <div className='flex space-y-1 flex-col justify-between'>
                        <Link href={`/product/${product.pid._id}`}><div className='text-sm md:text-base'>{product.pid.name}</div></Link>
                        <div className='text-xs md:text-base font-medium'>₹{product.sellingPrice}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DisplayOrders({loadMoreProducts, orderDetails, showFailedOrders, setShowFailedOrders, currentPageNumber, totalPages }) {
    return (
        <div className=' border-b-[1px] mb-4 md:border-b-0 pb-4 md:pb-0 md:w-3/5 md:mx-auto'>
            {orderDetails.length == 0 ?
                <>
                    <div className='flex justify-between px-4 items-center'>
                        <h1 className='md:text-2xl w-2/5  font-semibold md:font-bold'>No {showFailedOrders && "Failed"} Orders to display</h1>
                        <label className="inline-flex items-center cursor-pointer space-x-2">
                            <span className="ms-3 text-sm md:text-base font-medium text-gray-900 dark-:text-gray-300">Failed Orders</span>
                            <input checked={showFailedOrders} onChange={() => { setShowFailedOrders(!showFailedOrders) }} type="checkbox" value="" className="sr-only peer" />
                            <div className="relative w-11 h-6  bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark-:peer-focus:ring-blue-800 rounded-full peer dark-:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark-:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </>
                :
                <>
                    <div className='flex justify-between px-4 items-center '>
                        <h1 className='md:text-2xl text-xl font-semibold md:font-bold'>Your Orders</h1>
                        <label className="inline-flex items-center cursor-pointer space-x-2">
                            <span className="ms-3 text-sm md:text-base font-medium text-gray-900 dark-:text-gray-300">Failed Orders</span>
                            <input checked={showFailedOrders} onChange={() => { setShowFailedOrders(!showFailedOrders) }} type="checkbox" value="" className="sr-only peer" />
                            <div className="relative w-11 h-6  bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark-:peer-focus:ring-blue-800 rounded-full peer dark-:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark-:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    {orderDetails.map((order) => {
                        return (
                            <div key={order._id} className='mt-5 md:border-[1px] md:pb-4  md:border-slate-200 md:rounded-xl md:shadow-md'>
                                <div>
                                    <div className='px-6  justify-between border-b-[1px] border-t-[1px] md:border-t-0 border-slate-200 py-2 md:py-5'>
                                        <div className='flex justify-between'>
                                            <div className='flex flex-col '>
                                                <div className='flex items-center space-x-1'>
                                                    <span className='whitespace-nowrap text-sm md:text-base'>Order Number</span>
                                                </div>
                                                <span className='text-xs md:text-sm text-slate-500 '>{order.orderId}</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='whitespace-nowrap text-sm md:text-base'>Total Amount</span>
                                                <span className='text-xs md:text-sm font-medium'>₹{order.totalAmount}</span>
                                            </div>
                                        </div>
                                        <span className='text-sm font-medium md:font-semibold text-green-500'>
                                            {order.createdAt && formatDate(order.createdAt)}
                                        </span>
                                        <div className='flex space-x-1 mt-2 md:text-base text-sm text-indigo-600 items-center'>
                                            <Link href={`/account/myorders/${order.orderId}`}>
                                                <span>View order details</span>
                                            </Link>
                                            <FaArrowRightLong />
                                        </div>
                                    </div>
                                </div>
                                {order.products.map((product) => {
                                    return (<DisplayProduct key={`${order._id} ${product._id}`} product={product} order={order} />)
                                })}
                            </div>
                        )
                    })}
                    {currentPageNumber < totalPages &&
                        <div className='w-full text-center mt-5 '>
                            <button onClick={()=>{loadMoreProducts(showFailedOrders)}} className='text-sm md:text-base py-1 px-5 bg-indigo-600 text-white rounded hover:bg-indigo-500'>
                                Load More
                            </button>
                        </div>
                    }
                </>
            }
        </div>
    )
}

function formatDate(inputDate) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(inputDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}