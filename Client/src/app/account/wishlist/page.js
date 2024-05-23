'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext'
import MessageBox from '@/components/MessageBox';
import axios from 'axios'
import Error from 'next/error'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { MdCancel } from 'react-icons/md'

const Page = () => {
    const [showMessage, setShowMessage] = useState(false)
    let [products, setProducts] = useState([])
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const loginDetails = useContext(LoginDetailsContext)
    const router = useRouter()
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace("/login?returnTo=/account/wishlist")
    }, [loginDetails.user, router])
    useEffect(() => {
        (async () => {
            try {
                let res = await axios.get(`/api/account/wishlist`, { withCredentials: true })
                if (res.data.status != "success")
                    throw new Error("Error")
                setProducts(res.data.wishlist)
            } catch (error) {
                setShowMessage({ error: true, message: "Something went Wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        })()
    }, [])
    async function addToCart(pid) {
        try {
            let res = await axios.get(`/api/cart/add/${pid}?qty=${1}`, { withCredentials: true })
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Product added to cart!" })
                loginDetails.setloginDetails((curr) => {
                    curr.numCartItems = res.data.numCartItems
                    return ({ ...curr })
                })
                setTimeout(() => {
                    setShowMessage(false)
                }, 500);
            }
            else
                throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something went Wrong!", dismissable: true })
        }
    }
    async function removeProductFromWishList(pid){
        try {
            let res = await axios.delete(`/api/account/wishlist/${pid}`, { withCredentials: true })
            if (res.data.status != "success")
                throw new Error("Error")
            setProducts((curr)=>{
                return (curr.filter(p=>p.pid._id!=pid))
            })
        } catch (error) {
            setShowMessage({ error: true, message: "Something went Wrong!" })
            setTimeout(() => {
                router.back()
            }, 1000);
        }
    }
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className="px-4 mt-[5rem] md:mt-[7rem] mb-16">
                {products.length == 0 ?
                    <NoProducts />
                    :
                    <Products products={products} addToCart={addToCart} removeProductFromWishList={removeProductFromWishList} />
                }
            </div>
        </>
    )
}

function NoProducts() {
    return (
        <div className=' md:grid md:gap-5 md:px-10 md:grid-cols-3 lg:grid lg:grid-cols-4 lg:gap-5 lg:w-4/5 lg:px-0 md:mx-auto md:mb-10'>
            <h1 className=''>No Products Found</h1>
        </div>
    )
}

function Products({ products, addToCart,removeProductFromWishList }) {
    const router = useRouter()
    function returnDeliverydate() {
        var currentDate = new Date();
        var deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + 7);
        var formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
        return (formattedDeliveryDate);
    }
    return (
        <>
            <div className='mt-5 md:mt-[7rem] grid grid-cols-1 md:gap-5 md:px-10 md:grid-cols-3 lg:grid lg:grid-cols-4 lg:gap-5 lg:w-4/5 lg:px-0 md:mx-auto md:mb-10'>
                {products.map((product, index) => {
                    return (
                        <div key={product.pid._id} className={`border-y-2  flex md:flex-col md:border-[1px]   items-center py-4 lg:w-[90%] md:rounded-lg md:shadow-md cursor-pointer hover:lg:shadow-xl '}  lg:transition-shadow lg:duration-400`}>

                            <div className='hidden md:block w-full'>
                            <MdCancel onClick={()=>{removeProductFromWishList(product.pid._id)}} className='ms-auto mr-4 text-2xl ' />

                            </div>

                            <Link href={`/product/${product.pid._id}`} className='w-full flex justify-center items-center'>
                                <img src={product.pid.images[0].url} className='h-32 lg:h-40 w-auto'></img>
                            </Link>
                            <div className='lg:mt-2 lg:px-5 w-full text-sm  flex flex-col px-2'>
                                <Link href={`/product/${product.pid._id}`}><span className='font-semibold lg:text-xl'>{product.pid.name}</span></Link>
                                <span className='md:text-xl font-medium'>
                                    ₹{product.pid.price}
                                    {product.pid.price != product.pid.mrp &&
                                        <span className='text-xs md:text-sm'><span className='text-green-600'> -{product.pid.discount >= 1 ? `${product.pid.discount}%` : product.pid.mrp - product.pid.price}</span>
                                            <span> <s> ₹ {product.pid.mrp}</s></span></span>
                                    }
                                </span>
                                <span className='text-[.6rem] lg:text-sm'>Delivery by <strong> {returnDeliverydate()}</strong></span>
                                <button onClick={() => { addToCart(product.pid._id) }} className='bg-pink-500 text-xs md:text-sm text-white mt-2 w-24 lg:w-24 rounded-md shadow-md py-1 hover:bg-pink-400'>Add to cart</button>
                            </div>

                            <div className='md:hidden h-full'>
                            <MdCancel onClick={()=>{removeProductFromWishList(product.pid._id)}} className=' text-2xl ' />

                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Page