'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import MessageBox from '@/Components/MessageBox'
import { uniqBy } from "lodash";

function Orders() {
    let [isStatus, setStatus] = useState('Processing')
    let [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [showMessage, setShowMessage] = useState(false)
    const [loadingMoreOrders, setLoadingMoreOrders] = useState(false)
    const changeStatus = (status) => {
        setStatus(status)
        setOrders([])
        loadOrders(1)
    }
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    useEffect(()=>{
        setOrders([])
        loadOrders()
    }, [])
    async function loadOrders(pageNumber=1) {
        try {
            setShowMessage({ loading: true, message: "Loading.." })
            let res = await axios.get(`/api/admin/getOrders?status=${isStatus}&page=${pageNumber}`, { withCredentials: true })
            if (res.data.status != 'success')
                throw new Error('Error')
            setOrders((curr)=>{
                return (uniqBy([...curr,...res.data.orderDetails], '_id'))
            })
            setTotalPages(res.data.totalPages)
            setCurrentPage(res.data.currentPage)
            setShowMessage(false)
        } catch (error) {
            setShowMessage({ error: true, message: "Unable to load orders" })
        }
    }
    async function loadMoreOrders() {
        if (loadingMoreOrders) return;
        setLoadingMoreOrders(true)
        loadOrders(currentPage+1)
        setLoadingMoreOrders(false)
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className=''>
                <nav className='px-3  py-3 flex justify-between border-[1px] md:mr-5 overflow-x-auto no-scrollbar cursor-pointer ' style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                    <div onClick={() => changeStatus('Pending')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Pending' && 'font-semibold'}`}>Pending</div>
                    <div onClick={() => changeStatus('Processing')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Processing' && 'font-semibold'}`}>Processing</div>
                    <div onClick={() => changeStatus('Shipped')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Shipped' && 'font-semibold'}`}>Shipped</div>
                    <div onClick={() => changeStatus('Delivered')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Delivered' && 'font-semibold'}`}>Delivered</div>
                    <div onClick={() => changeStatus('Failed')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Failed' && 'font-semibold'}`}>Failed</div>
                    <div onClick={() => changeStatus('Cancelled')} className={`hover:font-semibold  transition-all duration-150 ${isStatus == 'Cancelled' && 'font-semibold'}`}>Cancelled</div>
                </nav>
                <div className='mt-2'>
                    {orders.length == 0 ?
                        <>
                            <h1 className='text-2xl text-center mt-5'>No orders to display</h1>
                        </> :
                        <>
                            {orders.map((order, index) => (
                                <Link href={`/order/${order.orderId}`} key={index}>
                                    <div className='flex cursor-pointer whitespace-nowrap justify-between overflow-x-auto space-x-8 p-4 border-b-[1px] hover:bg-slate-50'>
                                        <div>
                                            <h1 className='font-semibold'>Order Id</h1>
                                            <span className='text-sm'>{order.orderId}</span>
                                            {/* <div className='text-sm flex flex-col'>
                                        <span>{order.orderId}</span>
                                        <span>Product name</span>
                                    </div> */}
                                        </div>
                                        <div>
                                            <h1 className='font-semibold'>Date</h1>
                                            <span className='text-sm'>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div>
                                            <h1 className='font-semibold'>Amount</h1>
                                            <span className='text-sm'>₹{order.totalAmount}</span>
                                        </div>
                                        <div>
                                            <h1 className='font-semibold'>User Details</h1>
                                            <div className='flex  flex-col text-sm'>
                                                <span>{order.userName}</span>
                                                <span>Ph. {order.userPhone}</span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            ))}
                            {currentPage < totalPages &&
                                <div className='w-full text-center mt-5 '>
                                    <button onClick={loadMoreOrders} className='text-sm md:text-base py-1 px-5 bg-indigo-600 text-white rounded hover:bg-indigo-500'>
                                        Load More
                                    </button>
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Orders


