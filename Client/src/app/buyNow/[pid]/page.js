'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext'
import MessageBox from '@/components/MessageBox'
import axios from 'axios'
import Error from 'next/error'
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const { pid } = useParams()
    const searchParams = useSearchParams()
    const qty = searchParams.get('qty')
    const [showMessage, setShowMessage] = useState(false)
    let [addresses, setAddresses] = useState([])
    let [cartTotal, SetCartTotal] = useState(0)
    let [shippingCharges, SetShippingCharges] = useState(0)
    const [selectedAddress, setSelectedAddress] = useState(0)
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace(`/login?returnTo=/buyNow/${pid}?qty=${qty}`)
    }, [loginDetails.user, router])
    useEffect(() => {
        (async () => {
            try {
                let res = await axios.get(`/api/cart/buyNow/${pid}?qty=${qty}`, { withCredentials: true })
                if (res.data.productNotFound) {
                    setShowMessage({ error: true, message: "Product not Found" })
                    setTimeout(() => {
                        router.back()
                    }, 1000);
                }
                else if (res.data.ProductOutOfStock) {
                    setShowMessage({ error: true, message: "Product out of Stock" })
                    setTimeout(() => {
                        router.back()
                    }, 1000);
                }
                else if (res.data.status == "success"){
                    setAddresses(res.data.addresses)
                    SetCartTotal(res.data.productPrice*qty)
                    let delivery=res.data.fixedDeliveryFee
                    delivery+=(qty-1)*res.data.deliveryFeeIncrement
                    SetShippingCharges(delivery)
                }
                else throw new Error("Error")
            } catch (error) {
                setShowMessage({ error: true, message: "Product out of Stock" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        })()
    }, [])
    async function PayNow(){
        try {
            setShowMessage({loading:true,message:"loading..."})
            let res=await axios.post(`/api/cart/buyNow`,{addressIndex:selectedAddress,pid:pid,qty:qty},{withCredentials:true})
            if(res.data.ProductOutOfStock){
                setShowMessage({error:true,message:"Product Out of Stock"})
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
            if(res.data.status!="success")
                throw new Error("Error")
            router.replace(res.data.paymentUrl)
        } catch (error) {
            setShowMessage({error:true,message:"Something went wrong!",dismissable:true})
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[9rem] md:mt-[6rem] p-3 md:w-4/5 md:mx-auto md:flex '>
                <div className='md:w-2/3 md:border-r-2 md:pr-10'>
                    <h1 className='font-semibold md:font-bold md:pb-3 text-lg md:text-2xl border-b-2 border-b-slate-200 pb-1'>Checkout Section</h1>
                    <h2 className='mt-2 text-lg'> Select delivery address</h2>
                    <div>
                        {addresses.map((addr, index) => {
                            return (
                                <label htmlFor={`address${index}`} key={addr._id} className='flex mt-4 border-2 rounded-lg p-2 hover:bg-slate-100'>
                                    <input onChange={() => { setSelectedAddress(index) }} checked={index == selectedAddress} className='mr-2' name='address' type='radio' id={`address${index}`} value={index} required={true} />
                                    <label htmlFor={`address${index}`} className='text-sm px-1 '>
                                        <div>{addr.name}</div>
                                        <div>{addr.address}</div>
                                        <div>{addr.city},{addr.state}</div>
                                        <div>Pincode:{addr.pincode}</div>
                                        <div>Ph:{addr.phone}</div>
                                    </label>
                                </label>
                            )
                        })}
                    </div>
                    <div className='mt-4'>
                        <Link href="/account/addresses" className='shadow-md p-2 px-3 rounded bg-gray-100 text-sm hover:bg-gray-200 '>+ Add new address</Link>
                    </div>
                </div>
                <div className='mt-5 md:mt-0 md:ml-10 py-2 px-3 rounded md:w-1/3  bg-slate-50 md:h-[50%]'>
                    <span className='text-md'>Order Summary</span>
                    <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                        <span>Subtotal</span>
                        <span className='text-black font-medium'>₹{cartTotal}</span>
                    </div>
                    <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                        <span>Shipping estimate</span>
                        <span className='text-black font-medium'>₹{shippingCharges}</span>
                    </div>
                    {/* <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                        <span>Tax estimate</span>
                        <span className='text-black font-medium'>₹10.00</span>
                    </div> */}
                    <div className='flex justify-between font-medium py-3 border-b-slate-200   '>
                        <span>Order Total</span>
                        <span className='text-black font-bold'>₹{cartTotal + shippingCharges}</span>
                    </div>
                    <button onClick={PayNow} className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Pay Now
                    </button>
                </div>
            </div>
        </>
    )
}

export default Page