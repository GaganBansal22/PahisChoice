import React from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='relative mb-16 md:mb-0 md:py-10 flex flex-col justify-center items-center border-t-2 pt-4 space-y-2 md:space-y-5 bg-black z-20'>
      <div className='flex justify-center text-xl md:text-2xl space-x-6 items-center '>
        <div className='p-1 bg-white rounded-full  cursor-pointer'>
          <FaFacebook />
        </div>
        <div className='p-1 bg-white rounded-full  cursor-pointer'>
          <FaWhatsapp />
        </div>
        <div className='p-1 bg-white rounded-full  cursor-pointer'>
          <FaInstagram />
        </div>
        <div className='p-1 bg-white rounded-full cursor-pointer'>
          <FaYoutube />
        </div>
      </div>
      <div className='flex flex-col md:flex-row md:space-x-6 md:text-base items-center text-sm '>
        <Link href='/contactus'>
          <span className='text-white cursor-pointer hover:text-indigo-500'>Contact Us</span>
        </Link>
        <Link href='/termsandconditions'>
          <span className='text-white cursor-pointer hover:text-indigo-500'>Terms & Conditions</span>
        </Link>
        <Link href='/privacypolicy'>
          <span className='text-white cursor-pointer hover:text-indigo-500'>Privacy Policy</span>
        </Link>
        <Link href='/refundpolicy'>
        <span className='text-white cursor-pointer hover:text-indigo-500'>Refund Policy</span>
        </Link>
      </div>
      <h1 className='text-xs md:text-sm text-white'>© {new Date().getFullYear()} www.pahischoice.com. All rights reserved.</h1>
    </footer>
  )
}

export default Footer