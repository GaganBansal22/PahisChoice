'use client'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GoCircle } from "react-icons/go";
import { GiPlainCircle } from "react-icons/gi";
import axios from "axios";

export default function Home() {
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  let [carouselImage, setCarImage] = useState('https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
  const [newArrivals, setNewArrivals] = useState(false)
  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get('/api/new-arrivals')
        if (res.data.status == "success")
          setNewArrivals(res.data.products)
      } catch (error) {
        ;
      }
    })()
  }, [])
  const images = [
    'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1656428851610-a2de17b056a1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1659095141570-be8b9aff59ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  ]
  const giftItems = [
    {
      url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: "@ ₹499"
    },
    {
      url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: "@ ₹999"
    },
    {
      url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: "@ ₹1499"
    },
    {
      url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: "@ ₹1999"
    },
  ]
  const trendingProducts = [
    {
      name: "T-shirt Black",
      url: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
      price: "₹299"
    },
    {
      name: "T-shirt Black",
      url: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
      price: "₹299"
    },
    {
      name: "T-shirt Black",
      url: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
      price: "₹299"
    },
    {
      name: "T-shirt Black",
      url: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
      price: "₹299"
    },

  ]
  let [index, setIndex] = useState(0)
  const changeImage = (button) => {
    let newIndex;
    if (button === 'right')
      newIndex = (index + 1) % images.length;
    else
      newIndex = (index - 1 + images.length) % images.length;
    setIndex(newIndex);
    setCarImage(images[newIndex]);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage('right')
    }, 3000);
    return () => clearInterval(interval);
  }, [index, images]);
  useEffect(() => {
    const Hammer = require('hammerjs');
    const swipeContainer = document.getElementById("swipe-container");
    const hammer = new Hammer(swipeContainer);
    const handleSwipe = (event) => {
      if (event.direction === Hammer.DIRECTION_LEFT)
        changeImage("right");
      else if (event.direction === Hammer.DIRECTION_RIGHT)
        changeImage("left");
    };
    hammer.on("swipe", handleSwipe);
    return () => {
      hammer.off("swipe", handleSwipe);
    };
  }, [changeImage]);
  return (
    <>
      <div className='mt-[5rem] md:mt-[6.5rem] px-4 md:px-10 mb-56'>
        <div className="flex h-44  md:h-[60vh] justify-between items-center md:shadow-2xl md:rounded-3xl relative">
          <div onClick={() => changeImage('left')} className='absolute text-slate-100 left-3 md:left-6 bg-slate-100  bg-opacity-50 rounded-full hover:bg-opacity-60 cursor-pointer text-2xl p-1'><FaAngleLeft /></div>
          <div
            className="bg-cover bg-center rounded-xl md:rounded-xl  h-full w-full transition-all duration-[1500ms] ease-out"
            id="swipe-container"
            style={{
              backgroundImage: `url(${carouselImage})`,
            }}
          ></div>
          <div onClick={() => changeImage('right')} className='absolute text-slate-100 right-3 md:right-6 bg-slate-100  bg-opacity-50 rounded-full hover:bg-opacity-60 cursor-pointer text-2xl p-1'><FaAngleRight /></div>
        </div>
        <div className="flex items-center mt-2 justify-center w-full">
          {images.map((item, item_index) => (
            <div key={item_index} className="flex text-slate-700 px-[.15rem] text-sm">
              {index == item_index ? <GiPlainCircle /> : <GoCircle />}
            </div>
          ))}
        </div>
        <h1 className="mt-6 mb-5 text-2xl ">Explore Categories</h1>
        <div className="grid grid-cols-2 gap-2 md:gap-5">
          <Link href='./productList?category=Jewellery'>
            <div className="relative overflow-hidden flex justify-center items-center rounded-xl cursor-pointer hover:opacity-80 transition-all duration-100 text-xl ease-in md:h-60 h-20 w-full shadow-md " >
              <img src="https://images.unsplash.com/photo-1631965004544-1762fc696476?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="hover:scale-125  duration-300"></img>
              <span className="absolute md:text-3xl md:font-semibold text-white">Jewellery</span>
            </div>
          </Link>

          <Link href='./productList?category=Bags&sub=Mini%20bag'>

            <div className="relative overflow-hidden flex justify-center items-center rounded-xl cursor-pointer hover:opacity-80 transition-all duration-100 text-xl ease-in md:h-60 h-20 w-full shadow-md " >
              <img src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="md:translate-y-10 translate-y-1 hover:scale-125 duration-300"></img>
              <span className="absolute  md:text-3xl md:font-semibold text-white">Bags</span>
            </div>
          </Link>

          <Link href='./productList?category=Clothes'>

            <div className="relative overflow-hidden flex justify-center items-center rounded-xl cursor-pointer hover:opacity-80 transition-all duration-100 text-xl ease-in md:h-60 h-20 w-full shadow-md" >
              <img src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="hover:scale-125 duration-300"></img>
              <span className="absolute md:text-3xl md:font-semibold text-white">Clothes</span>
            </div>
          </Link>

          <Link href='./productList?category=Other'>
            <div className="relative overflow-hidden flex justify-center items-center rounded-xl cursor-pointer hover:opacity-80 transition-all duration-100 text-xl ease-in md:h-60 h-20 w-full shadow-md " >
              <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="hover:scale-125 duration-300"></img>
              <span className="absolute md:text-3xl md:font-semibold text-white">Others</span>
            </div>
          </Link>

        </div>
        {/* <h1 className="mt-10 mb-5 text-2xl ">Explore Gift items</h1>
        <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4">
          {giftItems.map((item, index) => (
            (
              <div key={index} className="flex flex-col cursor-pointer md:hover:opacity-75 md:transition justify-center items-center ">
                <img src={`${item.url}`} className="rounded h-24 w-full md:h-52 mb-1 md:mb-3"></img>
                <span className="font-semibold md:text-xl">{item.price}</span>
              </div>
            )
          ))}
        </div> */}
        {newArrivals &&
          <>
            <h1 className="mt-10 mb-5 text-2xl ">New Arrivals</h1>
            <div>
              <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar md:grid md:grid-cols-4 ">
                {newArrivals.map((item, index) => (
                  (<Link key={index} href={`/product/${item._id}`}>
                    <div className="min-w-fit md:mb-10 cursor-pointer  flex flex-col items-center justify-center">
                      <div className="md:hover:opacity-80   md:hover:scale-105 md:transition">
                        <img src={`${item.images[0].url}`} className="w-36 h-auto md:h-auto   md:w-auto"></img>
                        <div className="flex  flex-col p-1 items-center justify-between w-full">
                          <span className="text-md text-slate-600">{item.name}</span>
                          <span className="text-sm text-slate-800 ">₹ {item.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>)
                ))}
              </div>
            </div>
          </>
        }
        {/* <h1 className="mt-10 mb-5 text-2xl ">Trending Products</h1>
        <div>
          <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar md:grid md:grid-cols-4 ">
            {trendingProducts.map((item, index) => (
              (<div key={index} className="min-w-fit md:mb-10 cursor-pointer  flex flex-col items-center justify-center">
                <div className="md:hover:opacity-80   md:hover:scale-105 md:transition">
                  <img src={`${item.url}`} className="w-32 h-40 md:h-[45vh]   md:w-auto"></img>
                  <div className="flex  flex-col p-1 items-center justify-between w-full">
                    <span className="text-md text-slate-600">{item.name}</span>
                    <span className="text-sm text-slate-800 "> {item.price}</span>
                  </div>
                </div>
              </div>)
            ))}
          </div>
        </div> */}
      </div>
    </>
  )
}
