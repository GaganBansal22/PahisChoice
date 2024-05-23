'use client'
import React, { useContext } from 'react'
import { useState } from 'react';
import Link from 'next/link';
import { MdAccountCircle } from "react-icons/md";
import "../app/navbar.css"
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import axios from 'axios';
import MessageBox from './MessageBox';
import { IoBagHandleOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter()
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  let [showAccountOptions, SetShowAccountOptions] = useState(false);
  let [isOpenJwellery, setOpenJwellery] = useState(false);
  let [isOpenBags, setOpenBags] = useState(false);
  let [isOpenClothes, setOpenClothes] = useState(false);
  let [isOpenWomen, setWomen] = useState(false)
  let [isOpenMen, setMen] = useState(false)
  let [isBurgerOpen, setBurgerOpen] = useState(false)

  const pathname = usePathname()

  const loginDetails = useContext(LoginDetailsContext)
  const [showMessage, setShowMessage] = useState(false)
  async function LogoutUser() {
    let res = await axios.post(`/api/logout`, {}, { withCredentials: true })
    if (res.data.loggedOut) {
      setShowMessage({ success: true, message: "Logged Out successfully!" })
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    }
    else {
      setShowMessage({ error: true, message: "Something went Wrong!" })
      setTimeout(() => {
        setShowMessage(false)
      }, 1000);
    }
  }
  function showOptions() {
    SetShowAccountOptions(true)
  }
  function hideOptions() {
    SetShowAccountOptions(false)
  }
  const jwerllery = () => {
    setOpenJwellery(!isOpenJwellery)
    setOpenBags(false)
    setOpenClothes(false)
  }
  const bags = () => {
    setOpenBags(!isOpenBags)
    setOpenClothes(false)
    setOpenJwellery(false)
  }
  const clothes = () => {
    setOpenClothes(!isOpenClothes)
    setOpenJwellery(false)
    setOpenBags(false)
    setMen(false)
    setWomen(false)
  }
  const women = () => {
    setMen(false)
    setWomen(!isOpenWomen)
  }
  const men = () => {
    setMen(!isOpenMen)
  }

  const burger = () => {
    setBurgerOpen(!isBurgerOpen)
  }
  return (
    <>
      {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
      <div className='flex-row bg-white w-full fixed top-0 md:flex flex-wrap shadow-md  items-center md:text-md border-b-2 md:flex-nowrap px-3 py-1 md:py-3 md:px-10 z-10'>
        <div className='flex md:w-full  justify-between items-center'>
          <div className='flex ml-2 md:ml-0 items-center'>
            <Link href={"/"}><img src="https://yt3.googleusercontent.com/mztzf5coAd8QVf210loKj9G6EW82NvfyLw0jsKvfXhk4Jcqz6YZdhw0Wsfcon6BfX3ZmXKu_kJo=s176-c-k-c0x00ffffff-no-rj" className='md:w-12 md:h-12 w-11 h-11  border-slate-600  rounded-full' /></Link>
            <Link href={"/"}><span className='md:mx-5 md:font-bold font-md mx-3'>Pahi&apos;s Choice</span></Link>
          </div>
          {/* Cart and account button*/}
          <div className='flex items-center'>
            {/* <div onClick={showOptions} className="end-0 me-2 py-2.5 md:hidden ms-2 text-xl min-w-fit font-medium text-gray-900 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-pink-500 focus:z-10 focus:ring-4 focus:ring-gray-200 " role='button'>
              <MdAccountCircle className='inline text-pink-500 w-8 h-8 md:w-10 md:h-10' />
            </div> */}

            <Link href="/cart">
              <div className='md:hidden flex'>
                <IoBagHandleOutline className='text-2xl' />
                <span className=''>{loginDetails.numCartItems}</span>
              </div>
            </Link>
          </div>
        </div>

        <SearchBar />

        {/* Navlinks  */}
        <div className={`hidden md:flex px-2 md:px-0 py-1  md:py-0 pt-5 md:pt-1 items-center`}>
          <ul className='flex-row flex text-sm md:text-lg md:flex md:space-x-4 space-y-3 md:space-y-0 tracking-normal cursor-pointer'>
            <li>
              <div onClick={jwerllery} className='flex items-center  transition duration-200 hover:text-pink-500'>
                <span>Jewellery</span>
                <svg className="w-2.5 h-2.5 hidden md:block ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </div>
              {isOpenJwellery && <div onMouseLeave={jwerllery} className='md:absolute  bg-white md:border-[2px] rounded-lg text-gray-500 md:border-black-50 py-2 md:shadow-xl mt-2 '>
                <ul>
                  <li><Link href={"/search?q=Assamese Jewellery"} className=' hover:bg-slate-100 px-4 py-2 '>Assamese Jewellery</Link></li>
                  <li><Link href={"/search?q=Oxidised Jewellery"} className='hover:bg-slate-100 px-4 py-2'>Oxidised Jewellery</Link></li>
                  <li><Link href={"/search?q=Kundan Jewellery"} className='hover:bg-slate-100 px-4 py-2'>Kundan Jewellery</Link></li>
                  <li><Link href={"/search?q=Bracelet Jewellery"} className='hover:bg-slate-100 px-4 py-2'>Bracelet Jewellery</Link></li>
                  <li><Link href={"/search?q=Pendant"} className='hover:bg-slate-100 px-4 py-2'>Pendant</Link></li>
                  <li><Link href={"/search?q=Handmade"} className='hover:bg-slate-100 px-4 py-2'>Handmade</Link></li>
                  <li><Link href={"/search?q=Other"} className='hover:bg-slate-100 px-4 py-2'>Other</Link></li>
                </ul>
              </div>}
            </li>
            <li >
              <div onClick={bags} className='flex items-center transition duration-200 hover:text-pink-500'>
                <span>Bags</span>
                <svg className="w-2.5 h-2.5 ms-2.5 hidden md:block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </div>

              {isOpenBags && <div onMouseLeave={bags} className='md:absolute bg-white md:border-[2px] rounded-lg text-gray-500 md:border-black-50 py-2 md:shadow-xl mt-2 '>
                <ul>
                  <li><Link href="/search?q=Mini Bag" className=' hover:bg-slate-100 px-5 py-2 '>Mini Bag</Link></li>
                  <li><Link href="/search?q=Sling Bag" className='hover:bg-slate-100 px-5 py-2'>Sling Bag</Link></li>
                  <li><Link href="/search?q=Hand bag" className='hover:bg-slate-100 px-5 py-2'>Hand bag</Link></li>
                  <li><Link href="/search?q=Tote bag" className='hover:bg-slate-100 px-5 py-2'>Tote bag</Link></li>
                  <li><Link href="/search?q=Purse" className='hover:bg-slate-100 px-5 py-2'>Purse</Link></li>
                  <li><Link href="/search?q=Other" className='hover:bg-slate-100 px-5 py-2'>Other</Link></li>
                </ul>
              </div>}

            </li>
            <li>
              <div onClick={clothes} className='flex items-center transition duration-200 hover:text-pink-500'>
                <span>Clothes</span>
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </div>

              {isOpenClothes && <div onMouseLeave={clothes} className='md:absolute bg-white md:border-[2px] rounded-lg text-gray-500 md:border-black-50 py-2 md:shadow-xl mt-2 '>
                <ul>
                  <li>
                    <div onClick={women} className='flex hover:bg-slate-100   border-b-slate-200 mb-1 px-4 py-2 border-b-2 items-center font-bold'>
                      <span>Women</span>
                      <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </div>

                    {isOpenWomen && <div>
                      <ul>
                        <li><Link href="/search?q=Jacket/Coat" className='px-4 py-2 hover:bg-slate-100'>Jacket/Coat</Link></li>
                        <li><Link href="/search?q=Tops" className='px-4 py-2 hover:bg-slate-100'>Tops</Link></li>
                        <li><Link href="/search?q=Cardigan" className='px-4 py-2 hover:bg-slate-100'>Cardigan</Link></li>
                        <li><Link href="/search?q=Co-ordset" className='px-4 py-2 hover:bg-slate-100'>Co-ordset</Link></li>
                        <li><Link href="/search?q=Lower" className='px-4 py-2 hover:bg-slate-100'>Lower</Link></li>
                        <li><Link href="/search?q=Dresses" className='px-4 py-2 hover:bg-slate-100'>Dresses</Link></li>
                        <li><Link href="/search?q=Mekhela Chador" className='px-4 py-2 hover:bg-slate-100'>Mekhela Chador</Link></li>
                        <li><Link href="/search?q=Others" className='px-4 py-2 hover:bg-slate-100'>Others</Link></li>
                      </ul>
                    </div>}
                  </li>
                  <li>
                    <div onClick={men} className={`flex hover:bg-slate-100   ${isOpenMen && 'border-b-slate-200 border-b-2'}  mb-1 px-4 py-2  items-center font-bold`}>
                      <span>Men</span>
                      <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </div>

                    {isOpenMen && <div>
                      <ul>
                        <li><Link href="/search?q=T-shirts" className='px-4 py-2 hover:bg-slate-100'>T-shirts</Link></li>
                        <li><Link href="/search?q=Shirts" className='px-4 py-2 hover:bg-slate-100'>Shirts</Link></li>
                        <li><Link href="/search?q=Hoodies" className='px-4 py-2 hover:bg-slate-100'>Hoodies</Link></li>
                        <li><Link href="/search?q=Other" className='px-4 py-2 hover:bg-slate-100'>Other</Link></li>
                      </ul>
                    </div>}
                  </li>
                </ul>
              </div>}
            </li>
            <li className='hover:text-pink-500 transition duration-200 '><Link href="/search?q=Other">Other</Link></li>
          </ul>
        </div>
        <div onClick={showOptions} className="py-2.5 mr-1 hidden md:block px-4 ms-3 text-xl min-w-fit font-medium text-gray-900 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-pink-500 focus:z-10 focus:ring-4 focus:ring-gray-200 dark-:focus:ring-gray-700 dark-:bg-gray-800 dark-:text-gray-400 dark-:border-gray-600 dark-:hover:text-white dark-:hover:bg-gray-700" role='button'>
          <MdAccountCircle className='inline mb-1' /> Account
        </div>
        <Link href="/cart">
          <div className='hover:text-pink-500 ml-1'>
            <span className='absolute md:block right-[2%] hidden'>{loginDetails.numCartItems}</span>
            <IoBagHandleOutline className='hidden  text-3xl md:block' />
          </div>
        </Link>
      </div>
      {showAccountOptions && <UserAccountOptions hideOptions={hideOptions} LogoutUser={LogoutUser} />}
    </>
  )
}

export default Navbar;

function UserAccountOptions({ hideOptions, LogoutUser }) {
  const loginDetails = useContext(LoginDetailsContext)
  return (
    <>
      <div onClick={hideOptions} className="menu-overlay">
        <div className="menu mt-3 md:w-[18%] text-center">
          <div className='m-8 my-6'>
            {loginDetails.user ?
              <div className='font-medium text-lg'>
                <span onClick={LogoutUser} className='block hover:text-pink-500 hover:text-xl'><Link href="/account" >Sign Out</Link></span>
                <Link href="/account/myorders" ><span className='block hover:text-pink-500 hover:text-xl'>Your Orders</span></Link>
                <Link href="/account" ><span className='block hover:text-pink-500 hover:text-xl'>Your Account</span></Link>
                <Link href="/account/wishlist" ><span className='block hover:text-pink-500 hover:text-xl'>Wishlist</span></Link>
              </div>
              :
              <div className='whitespace-nowrap'>
                <Link href="/login" ><span className='block hover:text-pink-500 hover:text-xl'>Sign In</span></Link>
                <Link href="/signup"><span className='block hover:text-pink-500 hover:text-xl'>Create Account</span></Link>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}



function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  function updateSearchQuery(evt) {
    setSearchQuery(evt.target.value)
  }
  function searchProduct(evt) {
    evt.preventDefault();
    if (searchQuery == "") return;
    router.push(`/search?q=${searchQuery}`)
  }
  return (
    <>
      <div className="relative hidden w-full px-2 mt-3 md:m-0 md:mr-3">


        <div className="absolute inset-y-0 start-2 flex  items-center ps-3 cursor-pointer">
          <svg className="w-4 h-4 text-gray-500 dark-:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input value={searchQuery} onChange={updateSearchQuery} type="text" id="search-navbar" className=" md:block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark-:bg-gray-700 dark-:border-gray-600 dark-:placeholder-gray-400 dark-:text-white dark-:focus:ring-blue-500 dark-:focus:border-blue-500" placeholder="Search..." />
      </div>

      {/* Search bar for mobile */}
      {/* <div className="md:hidden relative w-full px-2 mt-3 md:m-0 md:mr-3">
        <div onClick={searchProduct} className="absolute inset-y-0 start-2 flex  items-center ps-3 cursor-pointer">
          <svg className="w-4 h-4 text-gray-500 dark-:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input value={searchQuery} onChange={updateSearchQuery} type="text" id="search-navbar" className=" md:block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark-:bg-gray-700 dark-:border-gray-600 dark-:placeholder-gray-400 dark-:text-white dark-:focus:ring-blue-500 dark-:focus:border-blue-500" placeholder="Search..." />
      </div> */}

      <div className="hidden md:block relative w-full px-2 mt-3 md:m-0 md:mr-3">
        <div onClick={searchProduct} className="absolute inset-y-0 start-2 flex  items-center ps-3 cursor-pointer">
          <svg className="w-4 h-4 text-gray-500 dark-:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <form onSubmit={searchProduct}>
          <input value={searchQuery} onChange={updateSearchQuery} type="text" id="search-navbar" className=" md:block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark-:bg-gray-700 dark-:border-gray-600 dark-:placeholder-gray-400 dark-:text-white dark-:focus:ring-blue-500 dark-:focus:border-blue-500" placeholder="Search..." />
        </form>
      </div>
    </>
  )
}