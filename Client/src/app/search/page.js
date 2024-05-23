'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox';
import axios from 'axios';
import Error from 'next/error';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { LiaFilterSolid } from "react-icons/lia";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import StarRating from '@/components/StartRatings';

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const searchParams = useSearchParams()
    const q = searchParams.get('q')
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const [showMessage, setShowMessage] = useState(false)
    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    useEffect(() => {
        async function func() {
            try {
                let res = await axios.get(`/api/search?q=${q}`, { withCredentials: true })
                if (res.data.status == "success") {
                    setProducts(res.data.products)
                    setAllProducts(res.data.products)
                }
                else throw new Error("Error")
            } catch (error) {
                setShowMessage({ error: true, message: "Something went Wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        }
        func()
    }, [q])
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
    function returnDeliverydate() {
        var currentDate = new Date();
        var deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + 7);
        var formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
        return (formattedDeliveryDate);
    }
    if (products.length == 0)
        return <NoProducts />
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='md:flex md:w-full'>
                <div className='md:w-1/5 hidden md:block md:mr-8'>
                    <Filter products={products} setProducts={setProducts} allProducts={allProducts} />
                </div>
                <div className='md:w-4/5 mt-[5rem] md:mt-[7rem]  md:grid md:gap-5 md:px-10 md:grid-cols-3 lg:grid lg:grid-cols-4 lg:gap-5 lg:w-4/5 lg:px-0 md:mx-auto mb-[5rem] md:mb-10'>
                    <SearchBarMobile />
                    <div className='md:hidden'>
                        <Filter products={products} setProducts={setProducts} allProducts={allProducts} />
                    </div>
                    {products.map((product) => {
                        return (
                            <div key={product._id} className='border-y-[1px] border-y-slate-200 flex md:flex-col md:border-[1px]  mt-3 items-center py-4 lg:w-[90%] md:rounded-lg md:shadow-md cursor-pointer hover:lg:shadow-xl  lg:transition-shadow lg:duration-400'>
                                <Link href={`/product/${product._id}`} className='w-2/5 md:w-full flex justify-center items-center'>
                                    <img src={product.images[0].url} className='h-28 lg:h-40 w-auto'></img>
                                </Link>
                                <div className='w-3/5 lg:mt-2 lg:px-5 md:w-full text-sm  flex flex-col px-2'>
                                    <Link href={`/product/${product._id}`}><span className='font-semibold lg:text-xl'>{product.name}</span></Link>
                                    {product.totalReviews > 0 &&
                                        <div className='item-center'>
                                            <div className='flex items-center  text-sm mt-1'>
                                                {/* <FaStar className={`${(product.totalRatings / product.totalReviews) >= 1 ? "text-yellow-400" : "text-slate-300"}`} /> */}
                                                {/* <FaStar className={`${(product.totalRatings / product.totalReviews) >= 2 ? "text-yellow-400" : "text-slate-300"}`} /> */}
                                                {/* <FaStar className={`${(product.totalRatings / product.totalReviews) >= 3 ? "text-yellow-400" : "text-slate-300"}`} /> */}
                                                {/* <FaStar className={`${(product.totalRatings / product.totalReviews) >= 4 ? "text-yellow-400" : "text-slate-300"}`} /> */}
                                                {/* <FaStar className={`${(product.totalRatings / product.totalReviews) >= 5 ? "text-yellow-400" : "text-slate-300"}`} /> */}
                                                <StarRating rating={product.totalRatings / product.totalReviews} fillColor={"text-yellow-400"} emptyColor={"text-slate-300"} />
                                                <span className='text-[.65rem] text-blue-500 ml-1'> ({product.totalReviews})</span>
                                            </div>
                                        </div>
                                    }
                                    <span className='text-xl font-medium'>
                                        ₹{product.price}
                                        {product.price != product.mrp &&
                                            <span className='text-sm'><span className='text-red-600'> -{product.discount >= 1 ? `${product.discount}%` : product.mrp - product.price}</span>
                                                <span> <s> ₹ {product.mrp}</s></span></span>
                                        }
                                    </span>
                                    <span className='text-[.6rem] lg:text-sm'>Delivery by <strong> {returnDeliverydate()}</strong></span>
                                    <button onClick={() => { addToCart(product._id) }} className='bg-pink-500 text-white mt-2 w-28 lg:w-24 rounded-md shadow-md py-1 hover:bg-pink-400'>Add to cart</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

const PageWithSuspense = () => (
    <Suspense fallback={<MessageBox error={true} message={"Something went wrong!"} />}>
        <Page />
    </Suspense>
  );
  
  export default PageWithSuspense;

function NoProducts() {
    return (
        <div className='mt-[5rem] md:mt-[7rem] md:grid md:gap-5 md:px-10 md:grid-cols-3 lg:grid lg:grid-cols-4 lg:gap-5 lg:w-4/5 lg:px-0 md:mx-auto md:mb-10'>
            <SearchBarMobile />
            <h1 className='hidden md:block'>No Products Found</h1>
        </div>
    )
}

function SearchBarMobile() {
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
            <div className=" md:hidden relative w-full px-5 mt-3 md:m-0 md:mr-3">
                <div onClick={searchProduct} className="absolute inset-y-0 start-5 flex  items-center ps-3 cursor-pointer">
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

function Filter({ products, allProducts, setProducts }) {
    let [isOpenFilter, setOpenFilter] = useState(false)
    let [filter, setFilter] = useState({ price: true, sortby: false, review: false })
    let [price, setPrice] = useState({ allprices: false, under500: false, under1000: false, under1500: false, })
    let [sortby, setSortby] = useState({ htl: false, lth: false })
    let [review, setReview] = useState({ one: false, two: false, three: false, four: false, five: false })
    const applyFilters = ({ newPrice, newReview }) => {
        let filteredProducts = [...allProducts];
        if (newPrice.under500)
            filteredProducts = filteredProducts.filter(product => product.price < 500);
        else if (newPrice.under1000)
            filteredProducts = filteredProducts.filter(product => product.price < 1000);
        else if (newPrice.under1500)
            filteredProducts = filteredProducts.filter(product => product.price < 1500);
        else if (newReview.one)
            filteredProducts = filteredProducts.filter(product => product.totalReviews > 0 && product.totalRatings / product.totalReviews >= 1);
        else if (newReview.two)
            filteredProducts = filteredProducts.filter(product => product.totalReviews > 0 && product.totalRatings / product.totalReviews >= 2);
        else if (newReview.three)
            filteredProducts = filteredProducts.filter(product => product.totalReviews > 0 && product.totalRatings / product.totalReviews >= 3);
        else if (newReview.four)
            filteredProducts = filteredProducts.filter(product => product.totalReviews > 0 && product.totalRatings / product.totalReviews >= 4);
        else if (newReview.five)
            filteredProducts = filteredProducts.filter(product => product.totalReviews > 0 && product.totalRatings / product.totalReviews >= 5);
        setProducts(filteredProducts);
    };
    const applySorting = ({ newSortBy }) => {
        let sortedProducts = [...products];
        if (newSortBy.htl)
            sortedProducts.sort((a, b) => (a.price < b.price ? 1 : -1));
        else if (newSortBy.lth)
            sortedProducts.sort((a, b) => (a.price > b.price ? 1 : -1));
        setProducts(sortedProducts);
    };
    const selectFilter = (e) => {
        for (let key in filter) {
            if (key === e)
                filter[key] = true
            else
                filter[key] = false
        }
        setFilter({ ...filter })
    }
    const toggleFilter = () => {
        setOpenFilter(!isOpenFilter)
    }
    const selectPrice = (e) => {
        let newPrice = { ...price }
        for (let key in newPrice) {
            if (key == e)
                newPrice[key] = true
            else
                newPrice[key] = false
        }
        setPrice(newPrice)
        setOpenFilter(false)
        applyFilters({ newPrice, newReview: review })
    }
    const selectSortby = (e) => {
        let newSortBy = { ...sortby }
        for (let key in newSortBy) {
            if (key === e) {
                newSortBy[key] = true
            }
            else {
                newSortBy[key] = false
            }
        }
        setOpenFilter(false)
        setSortby(newSortBy)
        applySorting({ newSortBy })
    }
    const selectReview = (e) => {
        let newReview = { ...review };
        for (let key in newReview) {
            if (key === e)
                newReview[key] = true
            else
                newReview[key] = false
        }
        setReview(newReview)
        setOpenFilter(false)
        applyFilters({ newPrice: price, newReview })
    }
    const clear = () => {
        for (let key in price) {
            price[key] = false
        }
        for (let key in sortby) {
            sortby[key] = false
        }
        for (let key in review) {
            review[key] = false
        }
        setOpenFilter(false)
        setPrice({ ...price })
        setSortby({ ...sortby })
        setReview({ ...review })
        setProducts(allProducts)
    }
    return (
        <div>
            <div onClick={toggleFilter} className='px-3 mt-5 md:hidden space-x-1 flex items-center'>
                <LiaFilterSolid />
                <h2 className='font-semibold text-md text-slate-700'>Filters</h2>
                <IoIosArrowDown />
            </div>
            <div className={`${!isOpenFilter && 'hidden'} md:flex md:flex-col md:w-1/5  absolute bottom-0 md:top-20 md:fixed  md:rounded-none md:border-t-0 h-[80%] md:border-r-2 md:h-[100vh]  w-full bg-white border-t-2  rounded-xl `}>
                <div className='flex py-4 border-b-2 mx-4 justify-between items-center'>
                    <h1 className='text-md md:text-xl  font-semibold '>Filters</h1>
                    <div className='flex items-center'>
                        <span className='text-sm md:text-base cursor-pointer text-slate-500 px-2' onClick={clear}>Clear</span>
                        <IoMdClose onClick={toggleFilter} className='text-xl md:hidden text-slate-500' />
                    </div>
                </div>
                <div className='flex h-full '>
                    <div className='flex flex-col w-1/3 px-5 py-4 h-full border-r-[1px] space-y-4 text-md'>
                        <span className={`cursor-pointer ${filter.price && 'font-semibold border-b-[1px] pb-1 '}`} onClick={() => selectFilter('price')}>Price</span>
                        <span className={`cursor-pointer ${filter.sortby && 'font-semibold border-b-[1px] pb-1 '}`} onClick={() => selectFilter('sortby')}>Sort by</span>
                        <span className={`cursor-pointer ${filter.review && 'font-semibold border-b-[1px] pb-1 '}`} onClick={() => selectFilter('review')}>Review</span>
                    </div>
                    {/* Price selected then this */}
                    {filter.price && (
                        <div className='p-4  flex flex-col space-y-4 h-20'>
                            {/* <span onClick={() => selectPrice('allprices')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${price.allprices && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>All Prices</span> */}
                            <span onClick={() => selectPrice('under500')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${price.under500 && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>Under ₹500</span>
                            <span onClick={() => selectPrice('under1000')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${price.under1000 && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>Under ₹1000</span>
                            <span onClick={() => selectPrice('under1500')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${price.under1500 && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>Under ₹1500</span>
                        </div>
                    )}
                    {/* Sort by is selected then this */}
                    {filter.sortby && (
                        <div className='p-4  flex flex-col space-y-4 h-20'>
                            <span onClick={() => selectSortby('htl')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${sortby.htl && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>Price High to low</span>
                            <span onClick={() => selectSortby('lth')} className={`px-4 py-2 bg-slate-100  rounded-lg text-sm ${sortby.lth && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>Price low to high</span>
                        </div>
                    )}
                    {/* Review is selected then this */}
                    {filter.review && (
                        <div className='p-4  flex flex-col space-y-4 h-20'>
                            <span onClick={() => selectReview('one')} className={`px-4  flex items-center py-2 bg-slate-100  rounded-lg text-sm ${review.one && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>
                                <FaStar className='text-yellow-400 text-base' />
                            </span>
                            <span onClick={() => selectReview('two')} className={`px-4 flex items-center py-2 bg-slate-100  rounded-lg text-sm ${review.two && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                            </span>
                            <span onClick={() => selectReview('three')} className={`px-4 flex items-center py-2 bg-slate-100  rounded-lg text-sm ${review.three && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                            </span>
                            <span onClick={() => selectReview('four')} className={`px-4 flex items-center py-2 bg-slate-100  rounded-lg text-sm ${review.four && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                            </span>
                            <span onClick={() => selectReview('five')} className={`px-4 flex items-center py-2 bg-slate-100  rounded-lg text-sm ${review.five && 'border-[.5px] border-blue-300 bg-blue-100'} cursor-pointer`}>
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                                <FaStar className='text-yellow-400 text-base' />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}