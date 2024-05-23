'use client'
// import { RxHamburgerMenu } from "react-icons/rx";
// import { IoSearch } from "react-icons/io5";
// import { useContext, useEffect, useState } from "react";
// import { AiOutlineHome } from "react-icons/ai";
// import { HiOutlineHome } from "react-icons/hi2";
// import { FaBoxArchive } from "react-icons/fa6";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { IoMdAdd, IoIosCloseCircleOutline, IoIosArrowDown } from "react-icons/io";
// import LoginDetailsContext from "@/Context/LoginDetailsContext.js";
// import Link from "next/link";
// import axios from "axios";
// import MessageBox from "@/Components/MessageBox";
// import { useRouter } from "next/navigation";
// import Orders from "./orders/page";

// export default function Home() {
//   let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
//   const loginDetails = useContext(LoginDetailsContext)
//   const [showMessage, setShowMessage] = useState(false)
//   let router = useRouter()
//   useEffect(() => {
//     if (!loginDetails.admin)
//       router.push(`/login`)
//   }, [loginDetails.admin, router])
//   async function LogoutAdmin() {
//     let res = await axios.post(`${serverAddress}/admin/logout`, {}, { withCredentials: true })
//     if (res.data.loggedOut) {
//       loginDetails.setloginDetails((curr) => {
//         curr.admin = false
//         return ({ ...curr })
//       })
//       setShowMessage({ success: true, message: "Logged Out successfully!" })
//       setTimeout(() => {
//         setShowMessage(false)
//         router.replace("/")
//       }, 1000);
//     }
//     else {
//       setShowMessage({ error: true, message: "Something went Wrong!" })
//       setTimeout(() => {
//         setShowMessage(false)
//       }, 1000);
//     }
//   }
//   let [openAccount, setOpenAccount] = useState(false);
//   let [categories, setCategories] = useState(
//     { Dashboard: false, Orders: false, Products: false, AddProduct: false }
//   )
//   let [ispanel, setPanel] = useState(true)
//   const Account = () => {
//     setOpenAccount(!openAccount)
//   }
//   const panel = () => {
//     setPanel(!ispanel)
//   }
//   const handleChange = (categoryName) => {
//     setCategories((prevCategory) => {
//       const updatedCategories = {};
//       Object.keys(prevCategory).forEach((categories) => {
//         updatedCategories[categories] = categories === categoryName;
//       });
//       return updatedCategories;
//     });
//     setPanel(!ispanel)
   
//   }



  
//   return (
//     <>
//       {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
//       <div className="md:flex  ">

//         {/* Side Panel */}
//         <div className={`fixed z-10  ${ispanel && 'hidden'} md:block  top-0 left-0 w-[100%] h-[100vh] md:w-1/5 bg-black bg-opacity-80`}>
//           <IoIosCloseCircleOutline onClick={panel} className="text-slate-200 absolute right-3 top-4 text-3xl md:hidden" />
//           <div className="w-[80%] md:w-[100%] bg-slate-900 px-5 h-[100vh] ">
//             <h1 className="text-slate-50 text-2xl font-semibold pt-5">Admin Panel</h1>
//             <div className="text-white mt-12 space-y-2">
//               <div onClick={() => handleChange('Dashboard')} className={`flex items-center ${categories.Dashboard && 'bg-slate-800'} hover:bg-slate-800 cursor-pointer py-3 rounded-md px-2 space-x-2`}>
//                 <HiOutlineHome className="text-2xl" />
//                 <span>Dashboard</span>
//               </div>
//               <div onClick={() => handleChange('Orders')} className={`flex items-center ${categories.Orders && 'bg-slate-800'} hover:bg-slate-800 cursor-pointer py-3 rounded-md px-2 space-x-2`}>
//                 <FaBoxArchive className="text-2xl" />
//                 <span>Orders</span>
//               </div>
//               <div onClick={() => handleChange('Products')} className={`flex items-center ${categories.Products && 'bg-slate-800'} hover:bg-slate-800 cursor-pointer py-3 rounded-md px-2 space-x-2`}>
//                 <AiOutlineShoppingCart className="text-2xl" />
//                 <span>Products</span>
//               </div>
//               <Link href={"/admin/product/new"} onClick={() => handleChange('AddProduct')} className={`flex items-center ${categories.AddProduct && 'bg-slate-800'} hover:bg-slate-800 cursor-pointer py-3 rounded-md px-2 space-x-2`}>
//                 <IoMdAdd className="text-2xl" />
//                 <span>Add new product</span>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Navbar */}
//         <div className=" fixed md:block top-0 bg-white  w-full">
//           <nav className="h-14  border-b-[1px] p-4 flex justify-between items-center">
//             <div className="flex items-center "> <RxHamburgerMenu onClick={panel} className="text-xl text-slate-500 md:hidden" />
//               <span className="text-slate-200 text-xl px-3 md:hidden">|</span>
//               <IoSearch className="text-xl  text-slate-400" />
//               <input placeholder="Search..." className=" mx-2 w-20 p-1 focus:outline-none"></input>
//             </div>
//             <div className="flex  items-center " onClick={Account}>
//               <img src="https://yt3.googleusercontent.com/mztzf5coAd8QVf210loKj9G6EW82NvfyLw0jsKvfXhk4Jcqz6YZdhw0Wsfcon6BfX3ZmXKu_kJo=s176-c-k-c0x00ffffff-no-rj" className="h-10 w-10 rounded-full">
//               </img>
//               <IoIosArrowDown className="px-2 text-slate-300 hidden md:block text-4xl" />
//               {(openAccount &&
//                 <div className='absolute flex flex-col transition-transform ease-in duration-1000 whitespace-nowrap top-11 w-24 right-1 rounded px-3 py-1 shadow-md border-[1px] border-black-50 bg-white text-gray-700'>
//                   {loginDetails.admin ?
//                     <>
//                       <span role="button" onClick={LogoutAdmin}>Sign Out</span>
//                       <span role="button">Profile</span>
//                     </> :
//                     <>
//                       <Link href={"/login"}>Sign In</Link>
//                     </>}
//                 </div>)}
//             </div>
//           </nav>
 
//         </div>
//       </div>
//     </>
//   )
// }


import Navbar from '@/Components/Navbar'
import React from 'react'

function Page() {
  return (
    <div>
    
      This is the Home page
    </div>
  )
}

export default Page
