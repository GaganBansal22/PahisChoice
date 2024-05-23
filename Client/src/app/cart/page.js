'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox'
import axios from 'axios'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    let [products, SetProducts] = useState([])
    let [cartTotal, SetCartTotal] = useState(0)
    const [shippingFeeTotal, setShippingFeeTotal] = useState(0)
    const [showMessage, setShowMessage] = useState(false)
    useEffect(() => {
        async function func() {
            try {
                let tempTotal = 0, shippingFee = 0;
                let productsTemp = []
                let res = await axios.get(`/api/cart`, { withCredentials: true })
                if (res.data.status == "success") {
                    for (let i = 0; i < res.data.products.length; i++) {
                        tempTotal += res.data.products[i].price * res.data.qty[i]
                        productsTemp.push({ product: res.data.products[i], qty: res.data.qty[i] })
                        shippingFee += res.data.products[i].fixedDeliveryFee;
                        shippingFee += res.data.products[i].deliveryFeeIncrement * (res.data.qty[i] - 1);
                    }
                    SetProducts(productsTemp)
                    SetCartTotal(tempTotal)
                    setShippingFeeTotal(shippingFee)
                }
                else throw new Error("Error")
            } catch (error) {
                setShowMessage({ error: true, message: "Unable to load cart!" })
                setTimeout(() => {
                    router.back();
                }, 1000);
            }
        }
        func()
    }, [products])
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className='mt-[3rem] md:mt-[6rem] py-4 px-5 md:px-16 md:w-4/5  md:mx-auto'>
                {products.length > 0 ?
                    <>
                        <h1 className='text-2xl font-semibold mb-2 '>Shopping Cart</h1>
                        <div className='md:flex' >
                            <div className='md:w-2/3'>
                                {products.map((product) => {
                                    return <CartProduct key={product.product._id} p={product} SetProducts={SetProducts} setShowMessage={setShowMessage} />
                                })}
                            </div>
                            <CartSummary cartTotal={cartTotal} shippingFeeTotal={shippingFeeTotal} />
                        </div>
                    </>
                    :
                    <>
                        <h1 className='text-2xl font-semibold mb-2 '>Your Cart is empty!</h1>
                    </>
                }
            </div>
        </>
    )
}

export default Page

function CartProduct({ SetProducts, p, setShowMessage }) {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const loginDetails = useContext(LoginDetailsContext)
    async function changeProductQuantity(qty = 0) {
        setShowMessage({ loading: true, message: "Updating cart!" })
        try {
            let res = await axios.get(`/api/cart/add/${p.product._id}?qty=${qty}`, { withCredentials: true })
            if (res.data.status == "success") {
                loginDetails.setloginDetails((curr) => {
                    curr.numCartItems = res.data.numCartItems
                    return ({ ...curr })
                })
                setShowMessage(false)
                SetProducts(false)
            }
            else
                throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something went Wrong!", dismissable: true })
        }
    }
    return (
        <div className='border-t-slate-200 border-t-[1px] flex w-full py-4'>
            <Link className='w-1/3 h-[60%] rounded' href={`/product/${p.product._id}`}><img src={p.product.images[0].url} /></Link>
            <div className='ms-10 w-2/3 px-3 flex justify-between flex-row'>
                <div className='flex flex-col h-full justify-between'>
                    <div>
                        <h1 className='font-medium'><Link href={`/product/${p.product._id}`}> {p.product.name} </Link></h1>
                        <div className='text-sm text-gray-500'>
                            <span >{p.product.color} | </span>
                            <span>{p.product.size}</span>
                        </div>
                        <div className='py-1'>
                            <select value={p.qty} onChange={(evt) => { changeProductQuantity(evt.target.value) }} className='border-2 p-1 rounded text-sm'>
                                {[...Array(p.product.qtyAvailable >= 5 ? 5 : p.product.qtyAvailable)].map((_, index) => (
                                    <option key={index} value={index + 1}>{index + 1}</option>
                                ))}
                                {/* <option value="1" >1</option>
                                <option value="2" >2</option>
                                <option value="3" >3</option>
                                <option value="4" >4</option>
                                <option value="5" >5</option> */}
                            </select>
                        </div>
                        <span className='text-[.88rem] font-semibold mt-1 text-slate-800'>₹{p.product.price}</span>
                    </div>
                    <div className='flex-row items-center flex text-sm text-green-500'>
                        <FaCheck />
                        <span className='px-[.2rem]'>In Stock</span>
                    </div>
                </div>
                <div>
                    <RxCross2 onClick={changeProductQuantity} className='text-slate-500 hover:text-slate-800 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

function CartSummary({ cartTotal, shippingFeeTotal }) {
    const loginDetails = useContext(LoginDetailsContext)
    return (
        <div className='mt-5 md:mt-0 md:ml-5 py-2 px-3 rounded md:w-1/3 bg-slate-50 md:h-[50%]'>
            <span className='text-md'>Order Summary</span>
            <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                <span>Subtotal</span>
                <span className='text-black font-medium'>₹{cartTotal}</span>
            </div>
            <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                <span>Shipping charges</span>
                <span className='text-black font-medium'>₹{shippingFeeTotal}</span>
            </div>
            {/* <div className='flex justify-between text-slate-600 py-3 border-b-slate-200 border-b-2  text-sm'>
                <span>Taxes</span>
                <span className='text-black font-medium'>₹10</span>
            </div> */}
            <div className='flex justify-between font-medium py-3 border-b-slate-200   '>
                <span>Order Total</span>
                <span className='text-black font-bold'>₹{cartTotal + shippingFeeTotal}</span>
            </div>
            <Link href={`${loginDetails.user ? "/cart/checkout" : "/login?returnTo=/cart"}`} className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Buy Now
            </Link>
        </div>
    )
}