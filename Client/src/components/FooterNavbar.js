import React from 'react'
import { FaHeart} from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from 'next/link';
import { MdAccountCircle } from 'react-icons/md';

const FooterNavbar = () => {
    return (
        <div className='flex border-t-[1px] z-20 md:hidden bg-white h-16 items-center p-4 justify-between w-full bottom-0 fixed text-sm'>
            <Link href='/'>
                <div className='flex flex-col items-center' >
                    <IoHomeOutline className='text-xl' />
                    Home
                </div>
            </Link>
            <Link href='/search'>
                <div className='flex flex-col items-center'>
                    <HiMagnifyingGlass className='text-xl' />
                    Search</div>
            </Link>
            <Link href='/account/wishlist'>
                <div className='flex flex-col items-center'>
                    <FaHeart className='text-red-500 text-xl' />Wishlist
                </div>
            </Link>
            <Link href='/account'>
                <div className='flex flex-col items-center'>
                    <MdAccountCircle className='text-pink-500 text-2xl' />Account
                </div>
            </Link>
            
        </div>
    )
}

export default FooterNavbar