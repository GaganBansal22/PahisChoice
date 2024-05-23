'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox';
import axios from 'axios';
import Error from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const loginDetails = useContext(LoginDetailsContext)
    const router = useRouter()
    const [showMessage, setShowMessage] = useState(false)
    let [products, SetProducts] = useState([])
    let [cartTotal, SetCartTotal] = useState(0)
    let [shippingCharges, SetShippingCharges] = useState(0)
    let [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(0)
    useEffect(() => {
        if (!loginDetails.user)
            return router.push("/login?returnTo=/cart/checkout")
        async function func() {
            try {
                // let tempTotal = 0
                // let productsTemp = []
                let res = await axios.get(`/api/cart/checkout`, { withCredentials: true })
                if (res.data.status == "success") {
                    // for (let i = 0; i < res.data.products.length; i++) {
                    //     tempTotal += res.data.products[i].price * res.data.qty[i]
                    //     productsTemp.push({ product: res.data.products[i], qty: res.data.qty[i] })
                    // }
                    // SetProducts(productsTemp)
                    // SetCartTotal(tempTotal)
                    if(res.data.orderTotal==0){
                        setShowMessage({error:true,message:"No Products in cart!"})
                        setTimeout(() => {
                            router.back()
                        }, 500);
                    }
                    setAddresses(res.data.addresses)
                    SetCartTotal(res.data.orderTotal)
                    SetShippingCharges(res.data.shippingCharge)
                }
                else throw new Error("Error")
            } catch (error) {
                console.log(error)
                setShowMessage({ error: true, message: "Unable to checkout!" })
                setTimeout(() => {
                    router.back();
                }, 1000);
            }
        }
        func()
    }, [loginDetails.user, router])
    async function PayNow(){
        try {
            setShowMessage({loading:true,message:"loading..."})
            let res=await axios.post(`/api/cart/payNow`,{addressIndex:selectedAddress},{withCredentials:true})
            if(!res.data.status=="success")
                throw new Error("Error")
            router.replace(res.data.paymentUrl)
        } catch (error) {
            console.log(error)
            setShowMessage({error:true,message:"Something went wrong!",dismissable:true})
        }
    }
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className='mt-[9rem] md:mt-[6rem] p-3 md:w-4/5 md:mx-auto md:flex '>
                <div className='md:w-2/3 md:border-r-2 md:pr-10'>
                    <h1 className='font-semibold md:font-bold md:pb-3 text-lg md:text-2xl border-b-2 border-b-slate-200 pb-1'>Checkout Section</h1>
                    <h2 className='mt-2 text-lg'> Select delivery address</h2>
                    <div>
                        {addresses.map((addr,index) => {
                            return (
                                <label htmlFor={`address${index}`} key={addr._id} className='flex mt-4 border-2 rounded-lg p-2 hover:bg-slate-100'>
                                    <input onChange={()=>{setSelectedAddress(index)}} checked={index==selectedAddress} className='mr-2' name='address' type='radio' id={`address${index}`} value={index} required={true} />
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
                        <span className='text-black font-bold'>₹{cartTotal+shippingCharges}</span>
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