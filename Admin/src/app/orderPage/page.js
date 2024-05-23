'use client'
import React, { useState } from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

function Page() {

    const [currStatus,setCurrStatus] = useState('shipped') // preparing, processing, shipped, delivered

    const date = 'March 21,2024.' 

    const status = {
        preparing : {
            text: `Preparing to ship on ${date}`,
            width :'w-1/4',
            loc : 0,
        },
        processing: {
            text: 'Your order is currently processing.',
            width : 'w-2/4',
            loc : 1,
        },
        shipped : {
            text:'Your order has been shipped.',
            width : 'w-3/4',
            loc : 2,
        },
        delivered : {
            text:'Your order has been delivered.',
            width : 'w-full',
            loc : 3,
        },
    }


    let isActive = [false,false,false,false]
    for(let i = 0; i < status[currStatus].loc+1; i++)
    {
        isActive[i] = true;
    }
    
   
    return (
        <div className='md:mt-[6rem] mt-[4rem] mb-[6rem] md:border-[1px] border-slate-200 md:rounded-md md:mx-[5%] p-5'>

            {/* Order heading part */}
            <div>
                <h1 className='md:text-3xl text-xl font-bold'>Order Details</h1>

                <div className='md:flex justify-between'>


                    <div className='md:flex items-center md:space-x-1  mt-1'>
                        <h1 className='text-gray-500 text-sm'>Order number</h1>

                        <span className='pr-1 text-sm md:text-base md:pr-0'>W086438695</span>
                        <span className='pr-1 md:pr-0'>·</span>
                        <span className='text-sm'>
                            March 22, 2021</span>
                    </div>

                    <div className='flex space-x-1 md:text-base text-sm text-md text-indigo-600 items-center'>
                        <span>View invoice</span>
                        <FaArrowRightLong />
                    </div>
                </div>
            </div>


            {/* Order details part */}
            <div className='mt-6 pt-6  border-t-[1px] '>
                {/* Order 1 */}
                <div className='md:flex mb-5'>
                    <img src='https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-01.jpg' className='md:h-60 md:w-auto rounded-md w-full h-auto' />
                    <div className='md:pl-8 mt-5 md:mt-0'>


                        <h1 className='text-lg md:text-xl pb-1 font-medium'>Distant Mountains Artwork Tee</h1>
                        <h1 className='text-base mb-2 font-medium'>$36.00</h1>
                        <span className='text-gray-500 text-sm'>
                            You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?
                        </span>
                    </div>
                </div>

                {/* Order 2 */}
                <div className='md:flex mb-5'>
                    <img src='https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-01.jpg' className='md:h-60 md:w-auto rounded-md h-auto w-full' />
                    <div className='md:pl-8 mt-5 md:mt-0'>


                        <h1 className='text-lg md:text-xl pb-1 font-medium'>Distant Mountains Artwork Tee</h1>
                        <h1 className='text-base mb-2 font-medium'>$36.00</h1>
                        <span className='text-gray-500 text-sm'>
                            You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?
                        </span>
                    </div>
                </div>


                <div className='md:flex justify-between  mb-4 border-b-[1px] pb-5'>
                    <div className='md:w-2/5'>
                        <h1 className='pb-1'>Delivery address</h1>

                        <span className='text-gray-500 text-sm md:text-base'>
                            Floyd Miles
                            7363 Cynthia Pass
                            Toronto, ON N3Y 4H8</span>
                    </div>
                    <div className='md:w-2/5 mt-2 md:mt-0 flex flex-col'>
                        <h1 className='pb-1'>Contact details</h1>
                        <span className='text-gray-500 text-sm md:text-base'>test@gmail.com</span>
                        <span className='text-gray-500 text-sm md:text-base'>+9188998098</span>
                    </div>
                </div>
            </div>


            {/* Status bar */}
            <div className='my-4 md:my-8'>
                <h1 className=' md:text-lg font-semibold'>{status[currStatus].text}</h1>

                <div className='relative mt-3 pb-2 mx-auto'>
                    <div className='border-b-8 rounded-full'>

                    </div>
                    <div className={`absolute top-0 border-b-8 rounded-full border-indigo-700 ${status[currStatus].width}`}>

                    </div>
                </div>

                <div className='text-xs md:text-base flex justify-between'>
                    <h1 className={`${isActive[0] && 'font-bold text-indigo-700'}`}>Order Placed</h1>
                    <h1 className={`${isActive[1] && 'font-bold text-indigo-700'}`}>Processing</h1>
                    <h1 className={`${isActive[2] && 'font-bold text-indigo-700'}`}>Shipped</h1>
                    <h1 className={`${isActive[3] && 'font-bold text-indigo-700'}`}>Delivered</h1>
                </div>
            </div>



            {/* Payment details part */}
            <div className='bg-slate-100 px-4 pb-4 md:pb-0 rounded-md md:p-5 '>

                <div className='md:flex justify-between md:px-5  pt-4 pb-4 w-full md:mt-5 md:mb-4 border-b-[1px] md:pb-5  md:pr-8'>
                    <div className='md:w-1/3'>
                        <h1 className='md:pb-1'>Billing address</h1>

                        <span className='text-gray-500 md:text-base text-sm'>
                            Floyd Miles
                            7363 Cynthia Pass
                            Toronto, ON N3Y 4H8</span>
                    </div>
                    <div className='flex flex-col mt-3 md:mt-0'>
                        <h1 className='pb-1'>Payment information</h1>
                        <span className='text-gray-500 md:text-base text-sm'>Bharat UPI</span>
                        
                    </div>
                </div>

                <div >
                    <div className='flex justify-between  md:px-5 py-4 mt-3 border-b-[1px]'>
                        <span className='text-gray-500'>Subtotal</span>
                        <span className='font-medium'>$72</span>
                    </div>
                    <div className='flex justify-between  md:px-5 py-5 mt-3 border-b-[1px]'>
                        <span className='text-gray-500'>Shipping</span>
                        <span className='font-medium'>$5</span>
                    </div>
                    <div className='flex justify-between  md:px-5 py-5 mt-3 border-b-[1px]'>
                        <span className='text-gray-500'>Tax GST (18%)</span>
                        <span className='font-medium'>$6.16</span>
                    </div>
                    <div className='flex justify-between  md:px-5 py-5 mt-3  border-b-[1px]'>
                        <span className='font-medium'>Order total</span>
                        <span className='font-semibold text-indigo-600'>$83.16</span>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Page
