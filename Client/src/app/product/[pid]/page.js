'use client'
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import MessageBox from '@/components/MessageBox';
import { StarIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Error from 'next/error';
import { useParams, useRouter } from 'next/navigation';
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import React, { useContext, useEffect, useState } from 'react'
import { GoDot, GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import "./starability.css"
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { MdOutlineAccountCircle } from 'react-icons/md';
import Link from 'next/link';
import StarRating from '@/components/StartRatings';

const Page = () => {
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  const router = useRouter()
  const loginDetails = useContext(LoginDetailsContext)
  const { pid } = useParams()
  const [showMessage, setShowMessage] = useState(false)
  const [product, setProduct] = useState(false)
  const [colors, setColors] = useState({})
  const [sizes, setsizes] = useState({})
  const [userReview, SetUserReview] = useState(false)
  const [allReviews, SetAllReviews] = useState(false)
  const [reviewSummary, setReviewSummary] = useState(false)
  const [currentImg, setCurrImg] = useState("")
  const [reviewRatingPercentage, setReviewRatingPercentage] = useState(false)
  const [isWishList, setWishList] = useState(false)

  useEffect(() => {
    if (!userReview && !allReviews) return;
    let ratingSum = 0;
    let percentage = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let numReview = 0, average;
    for (let r of allReviews) {
      ratingSum += r.rating
      percentage[r.rating] += 1
      numReview++;
    }
    if (userReview) {
      ratingSum += userReview.rating
      percentage[userReview.rating] += 1
      numReview++;
    }
    average = (ratingSum / numReview)
    setReviewSummary({ average: average, totalReviews: numReview })
    percentage[5] = percentage[5] / numReview * 100;
    percentage[4] = percentage[4] / numReview * 100;
    percentage[3] = percentage[3] / numReview * 100;
    percentage[2] = percentage[2] / numReview * 100;
    percentage[1] = percentage[1] / numReview * 100;
    setReviewRatingPercentage(percentage)
  }, [userReview])

  useEffect(() => {
    async function func() {
      try {
        let res = await axios.get(`/api/product/${pid}`, { withCredentials: true })
        if (res.data.error) {
          if (res.data.productNotFound) {
            setProduct({ productNotFound: true })
            return;
          }
          else
            throw new Error("Error")
        }
        let p = { ...res.data.product }
        console.log(p)
        let colors = {}
        let sizes = {}
        colors[p.color] = { current: true, name: p.color, url: `/product/${p._id}`, name: p.color, qtyAvailable: p.qtyAvailable }
        sizes[p.size] = { current: true, url: `/product/${p._id}`, name: p.size, qtyAvailable: p.qtyAvailable }
        for (let item of res.data.variants) {
          if (item._id != p._id && item.color == p.color && item.size != p.size) {
            if (!Object.keys(sizes).includes(item.size) || sizes[item.size].qtyAvailable <= 0)
              sizes[item.size] = { url: `/product/${item._id}`, name: item.size, qtyAvailable: item.qtyAvailable }
          }
          if (item._id != p._id && item.color != p.color) {
            if (!Object.keys(colors).includes(item.color) || colors[item.color].qtyAvailable <= 0)
              colors[item.color] = { url: `/product/${item._id}`, name: item.color, qtyAvailable: item.qtyAvailable }
          }
        }
        setProduct(p)
        setCurrImg(p.images[0].url)
        setColors(colors)
        setsizes(sizes)
        SetAllReviews(res.data.allReviews)
        SetUserReview(res.data.userReview)
        setWishList(res.data.includedInWishList)
      } catch (error) {
        setShowMessage({ error: true, message: "Something went Wrong!" })
        setTimeout(() => {
          return router.back();
        }, 1000);
      }
    }
    func()
  }, [])
  async function buyNow() {
    router.push(`/buyNow/${product._id}?qty=${document.querySelector(".productQty").value}`)
  }
  async function addToCart() {
    try {
      let productQty = document.querySelector(".productQty").value
      let res = await axios.get(`/api/cart/add/${product._id}?qty=${productQty}`, { withCredentials: true })
      if (res.data.status == "success") {
        setShowMessage({ success: true, message: "Product added to cart!" })
        loginDetails.setloginDetails((curr) => {
          curr.numCartItems = res.data.numCartItems
          return ({ ...curr })
        })
        setTimeout(() => {
          setShowMessage(false)
        }, 1000);
      }
      else
        throw new Error("Error")
    } catch (error) {
      setShowMessage({ error: true, message: "Something went Wrong!", dismissable: true })
    }
  }
  async function setItemToWishList() {
    try {
      let res;
      if (isWishList)
        res = await axios.delete(`/api/account/wishlist/${pid}`, { withCredentials: true })
      else
        res = await axios.post(`/api/account/wishlist/${pid}`, undefined, { withCredentials: true })
      if (res.data.status == "success")
        setWishList(!isWishList)
      else
        throw new Error("Error")
    } catch (error) {
      console.log(error)
      setShowMessage({ error: true, message: "Error in adding to wishlist", dismissable: true })
    }
  }
  return (
    <>
      {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
      <section className="text-gray-600 body-font  md:mt-[2rem] overflow-hidden">
        {product && !product.productNotFound &&
          <div className="container px-5 pb-24 pt-16 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap md:flex-nowrap">
              <ImagesSection product={product} setCurrImg={setCurrImg} currentImg={currentImg} isWishList={isWishList} setItemToWishList={setItemToWishList} />
              <div className="lg:w-1/2 w-full  lg:pl-10 lg:py-6 lg:mt-0">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                </div>
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-lg md:font-medium font-semibold md:text-2xl tracking-tight text-gray-900">₹ {product.price}
                    {product.price != product.mrp &&
                      <span className='text-base font-medium'><span className='text-red-600'> -{product.discount >= 1 ? `${product.discount}%` : product.mrp - product.price}</span>
                        <span> <s> ₹ {product.mrp}</s></span></span>
                    }
                  </p>
                  {reviewSummary.totalReviews > 0 && <ReviewSummary summary={reviewSummary} />}
                  <div className="mt-10">
                    <Colors colors={colors} pColor={product.color} />
                    <Sizes sizes={sizes} psize={product.size} />
                    <div className='mt-5'>
                      <label htmlFor='qty' className='text-lg font-normal'>Select quantity</label>
                      <select id='qty' name='qty' className='productQty ms-2 border-2 p-1'>
                        {[...Array(product.qtyAvailable>=5?5:product.qtyAvailable)].map((_, index) => (
                          <option key={index} value={index+1}>{index + 1}</option>
                        ))}
  
                        {/* <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option> */}
                      </select>
                      <button onClick={buyNow} className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Buy Now
                      </button>
                      <button onClick={addToCart} className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Add to bag
                      </button>
                    </div>
                  </div>
                </div>
                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
                  <div>
                    <h3 className="md:text-xl font-semibold mt-4 mb-2">Description</h3>
                    <div className="space-y-6">
                      <p className="text-base text-gray-900">{product.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Reviews summary={reviewSummary} reviewRatingPercentage={reviewRatingPercentage} pid={product._id} productTitle={product.name} SetUserReview={SetUserReview} userReview={userReview} allReviews={allReviews} ></Reviews>
          </div>
        }
        {product && product.productNotFound &&
          <div className="container px-5 py-24 mx-auto">
            Product Not Found
          </div>
        }
      </section>
    </>
  )
}

export default Page

function ImagesSection({ product, setCurrImg, currentImg, isWishList, setItemToWishList }) {

  let [index, setIndex] = useState(0)

  const changeImage = (direction) => {
    let newIndex;

    if (direction === 'right') {
      newIndex = (index + 1) % product.images.length;
    } else {
      newIndex = (index - 1 + product.images.length) % product.images.length;
    }

    setIndex(newIndex);
    setCurrImg(product.images[newIndex].url);
  };


  useEffect(() => {
    const Hammer = require('hammerjs')
    const mainImage = document.getElementById('mainImage')
    const hammer = new Hammer(mainImage)

    const handleSwipe = (event) => {
      if (event.direction === Hammer.DIRECTION_LEFT) {
        changeImage('right')
      } else if (event.direction === Hammer.DIRECTION_RIGHT) {
        changeImage('left');
      }
    }

    hammer.on("swipe", handleSwipe);

    return () => {
      hammer.off("swipe", handleSwipe);
    };
  }, [changeImage])

  return (
    <>
      {product.images.length > 1 &&
        // <div className='md:flex absolute hidden flex-col justify-around h-[75vh] items-start translate-x-[-8%] py-5'>
        <div className='md:flex absolute hidden flex-col justify-around h-[75vh] w-[10vw] items-start translate-x-[-70%] py-5'>
          {product.images && product.images.map((image) => {
            return <img
              onClick={() => { setCurrImg(image.url) }}
              key={image._id} alt="ecommerce"
              // className="w-[6%] h-auto border-2 p-1 object-cover object-center rounded hover:border-indigo-400  hover:shadow-xl cursor-pointer"
              className="w-[50%] h-auto border-2 p-1 object-cover object-center rounded hover:border-indigo-400  hover:shadow-xl cursor-pointer"
              src={image.url} />
          })}
          {product.images.length == 2 &&
            <img alt="ecommerce" className="w-[6%] invisible h-auto border-2 p-1 object-cover object-center rounded hover:border-indigo-400  hover:shadow-xl cursor-pointer" src="https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg" />
          }
        </div>
      }
      <div className='relative lg:pr-4 lg:w-1/2 w-full '>
        <img alt="productImage" id='mainImage' className="lg:border-r lg:border-gray-200 h-auto mt-2 w-full border-[1px] lg:border-0 lg:h-[80vh]  object-cover object-center rounded" src={currentImg} />
        <div className='absolute right-5 bottom-5 md:bottom-28 md:right-10 cursor-pointer' onClick={setItemToWishList}>
          {isWishList ?
            <IoHeartSharp className=' text-red-500 w-auto h-8 md:w-10 md:h-auto ' />
            :
            <IoHeartOutline className='  w-auto h-8 md:w-10 md:h-auto ' />
          }
        </div>
      </div>
      <div className='flex md:hidden py-2 w-full justify-center'>
        {product.images.map((image) => {
          return (currentImg == image.url ? <GoDotFill className='text-xl' key={image.url} /> : <GoDot className='text-xl' key={image.url} />)
        })}
      </div>
    </>
  )
}

function ReviewSummary({ summary }) {
  return (
    <div className="mt-6">
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {/* {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon key={rating}
              className={`${summary.average > rating ? 'text-gray-900' : 'text-gray-200'} h-5 w-5 flex-shrink-0`}
              aria-hidden="true"
            />
          ))} */}
          <StarRating className="h-5 w-5 flex-shrink-0" rating={summary.average} fillColor={'text-gray-900'} emptyColor={"text-gray-200"} />
        </div>
        <p className="sr-only">{summary.average} out of 5 stars</p>
        <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          {summary.totalReviews} review(s)
        </p>
      </div>
    </div>
  )
}

function Colors({ colors, pColor }) {
  const router = useRouter();
  function handleClick(color) {
    if (color.name != pColor)
      router.push(color.url, undefined, { shallow: true, scroll: false })
  }
  return (
    <>
      <h3 className="text-sm font-medium text-gray-900">Color</h3>
      <div className='mt-4 flex items-center space-x-3'>
        {Object.values(colors).map((color) => {
          return (
            <button onClick={() => { handleClick(color) }} key={color.name}
              className={`${color.name == pColor ? "ring ring-offset-1" : "ring-2"} -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none`}>
              <span style={{ backgroundColor: color.name }} className={`h-8 w-8 rounded-full border border-black border-opacity-10`} />
            </button>)
        })}
      </div>
    </>
  )
}

function Sizes({ sizes, psize }) {
  const router = useRouter();
  function handleClick(size) {
    if (size.name != psize)
      router.push(size.url, undefined, { shallow: true, scroll: false })
  }
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
      </div>
      <div className="mt-4  grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
        {Object.values(sizes).map((size) => {
          return (
            <button key={size.name} onClick={() => { handleClick(size) }}
              className={`${size.qtyAvailable > 0 ? "cursor-pointer bg-white text-gray-900 shadow-sm" : "cursor-not-allowed bg-gray-50 text-gray-400"} ${size.name == psize ? "ring-2 ring-indigo-500" : ""} group relative flex items-center justify-center rounded-md border py-3 px-5 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6`}>
              {size.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Reviews({ summary, reviewRatingPercentage, pid, productTitle, SetUserReview, userReview, allReviews }) {
  const loginDetails = useContext(LoginDetailsContext)
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  let [showMessage, setShowMessage] = useState(false)
  let [showReviewInputField, setShowReviewInputField] = useState(false)
  let [image, setImage] = useState([])
  let [formImages, setFormImages] = useState([])
  let [warning, setWarning] = useState(false)
  let [viewImage, setViewImage] = useState(false)
  let [openImage, setOpenImage] = useState(null)
  async function submitReview(evt) {
    evt.preventDefault();
    try {
      const formData = new FormData(document.querySelector(".reviewForm"))
      if (formData.get("rating") == "0")
        return;
      for (let f of formImages) {
        formData.append("image", f)
      }
      setShowMessage({ loading: true, message: "Loading Please wait!" })
      formData.append("ptl", productTitle)
      let res = await axios.post(`/api/review/new`, formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
      if (res.data.status == "success") {
        setShowMessage({ success: true, message: "Thank you for your Review!" })
        setTimeout(() => {
          setShowMessage(false)
          SetUserReview(res.data.userReview)
          setShowReviewInputField(false)
          setShowMessage(false)
        }, 1000);
      }
      else
        throw new Error("Error")
    } catch (error) {
      setShowMessage({ error: true, message: "Something Went Wrong!", dismissable: true })
    }
  }
  const enterReview = () => {
    setImage([])
    setShowReviewInputField(!showReviewInputField)
  }
  const showImage = (src) => {
    setOpenImage(src)
    setViewImage(true)
  }
  const closeImage = () => {
    setViewImage(false)
  }
  const removeImage = (index) => {
    const updatedImages = [...image];
    updatedImages.splice(index, 1);
    setImage(updatedImages);
    setFormImages((curr) => {
      curr.splice(index, 1)
      return ([...curr])
    })
    setWarning(false)
  };
  const handleChange = (evt) => {
    if (image.length < 5) {
      setImage([...image, { url: URL.createObjectURL(evt.target.files[0]) }])
      setFormImages([...formImages, evt.target.files[0]])
    }
    else
      setWarning(true)
    evt.target.value = null;
  }
  return (
    <>
      {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
      <div className='md:flex md:px-5'>
        <div className='md:w-1/3 md:border-r-2 md:border-r-slate-100 md:pr-10'>
          {summary.totalReviews > 0 &&
            <>
              <h1 className='text-xl font-semibold text-slate-900'>Customer Reviews</h1>
              <div className='flex items-center text-sm mt-1'>
                {/* <FaStar className={`text-yellow-400 mx-[]`} /> */}
                {/* <FaStar className={`${summary.average >= 2 ? "text-yellow-400" : "text-slate-300"}  mr-[.1rem]`} /> */}
                {/* <FaStar className={`${summary.average >= 3 ? "text-yellow-400" : "text-slate-300"} mr-[.1rem]`} /> */}
                {/* <FaStar className={`${summary.average >= 4 ? "text-yellow-400" : "text-slate-300"}  mr-[.1rem]`} /> */}
                {/* <FaStar className={`${summary.average >= 5 ? "text-yellow-400" : "text-slate-300"}  mr-[.1rem]`} /> */}
                <StarRating rating={summary.average} fillColor={"text-yellow-400"} emptyColor={"text-slate-300"} />
                <span className='mx-2'>Based on {summary.totalReviews} review(s)</span>
              </div>
              <div className='flex flex-col mt-1'>
                <div className='flex items-center w-full'>
                  <span className='flex-none w-2 mr-2'>5</span>
                  <FaStar className='text-yellow-400 flex-none mr-2' />
                  <div className={`w-[90%] mr-3`}>
                    <span className='overflow-hidden h-3 rounded-2xl border-2 block'></span>
                    <span className={`w-${reviewRatingPercentage[5] == 100 ? "full" : `[${reviewRatingPercentage[5]}%]`} h-3 -mt-3 bg-yellow-400 rounded-2xl float-left `}></span>
                  </div>
                  <span className='w-14 md:w-10 text-right'>{reviewRatingPercentage[5]}%</span>
                </div>
                <div className='flex items-center  w-full'>
                  <span className='flex-none w-2 mr-2'>4</span>
                  <FaStar className='text-yellow-400 flex-none mr-2 ' />
                  <div className='w-[90%] mr-3'>
                    <span className='overflow-hidden h-3 rounded-2xl border-2 block'></span>
                    <span className={`w-${reviewRatingPercentage[4] == 100 ? "full" : `[${reviewRatingPercentage[4]}%]`} h-3 -mt-3 bg-yellow-400 rounded-2xl float-left`}></span>
                  </div>
                  <span className='w-14 md:w-10 text-right'>{reviewRatingPercentage[4]}%</span>
                </div>
                <div className='flex items-center w-full'>
                  <span className='flex-none w-2 mr-2'>3</span>
                  <FaStar className='text-yellow-400 flex-none mr-2 ' />
                  <div className='w-[90%] mr-3'>
                    <span className='overflow-hidden h-3 rounded-2xl border-2 block'></span>
                    <span className={`w-${reviewRatingPercentage[3] == 100 ? "full" : `[${reviewRatingPercentage[3]}%]`} h-3 -mt-3 bg-yellow-400 rounded-2xl float-left `}></span>
                  </div>
                  <span className='w-14 md:w-10  text-right'>{reviewRatingPercentage[3]}%</span>
                </div>
                <div className='flex items-center  w-full'>
                  <span className='flex-none w-2 mr-2'>2</span>
                  <FaStar className='text-yellow-400 flex-none mr-2' />
                  <div className='w-[90%] mr-3'>
                    <span className='overflow-hidden h-3 rounded-2xl border-2 block'></span>
                    <span className={`w-${reviewRatingPercentage[2] == 100 ? "full" : `[${reviewRatingPercentage[2]}%]`} h-3 -mt-3 bg-yellow-400 rounded-2xl float-left`}></span>
                  </div>
                  <span className='w-14 md:w-10  text-right'>{reviewRatingPercentage[2]}%</span>
                </div>
                <div className='flex items-center  w-full'>
                  <span className='flex-none w-2 mr-2'>1</span>
                  <FaStar className='text-yellow-400 flex-none mr-2' />
                  <div className='w-[90%] mr-3'>
                    <span className='overflow-hidden h-3 rounded-2xl border-2 block'></span>
                    <span className={`w-${reviewRatingPercentage[1] == 100 ? "full" : `[${reviewRatingPercentage[1]}%]`} h-3 -mt-3 bg-yellow-400 rounded-2xl float-left`}></span>
                  </div>
                  <span className='w-14 md:w-10 text-right'>{reviewRatingPercentage[1]}%</span>
                </div>
              </div>
            </>
          }
          <div className='mt-5'>
            <p className='text-black text-lg'>Share your thoughts</p>
            <p className='text-slate-600 text-sm'>If you&apos;ve used this product, share your thoughts with other customers</p>
          </div>
          {!showReviewInputField && loginDetails.user ?
            <button onClick={enterReview} className='mt-3 w-full h-9 rounded text-slate-700 text-sm hover:bg-slate-100 border-2 m-auto'>
              Write a Review
            </button>
            : !showReviewInputField && !loginDetails.user &&
            <Link href={`/login?returnTo=/product/${pid}`} className='mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              Sign in to Write Review
            </Link>
          }
          {(showReviewInputField &&
            <form className='reviewForm mt-3 flex flex-col'>
              <textarea name='comment' placeholder='write your review...' className='w-full border-2 rounded resize-none overflow-hidden p-2 focus:outline-none '></textarea>
              <div className='mt-2 mb-2'>
                <fieldset className="starability-heartbeat">
                  <legend className='mb-1'>Give your ratings:</legend>
                  <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="0" defaultChecked={true} aria-label="No rating." />
                  <input type="radio" id="first-rate1" name="rating" value="1" />
                  <label htmlFor="first-rate1" title="Terrible">1 star</label>
                  <input type="radio" id="first-rate2" name="rating" value="2" />
                  <label htmlFor="first-rate2" title="Not good">2 stars</label>
                  <input type="radio" id="first-rate3" name="rating" value="3" />
                  <label htmlFor="first-rate3" title="Average">3 stars</label>
                  <input type="radio" id="first-rate4" name="rating" value="4" />
                  <label htmlFor="first-rate4" title="Very good">4 stars</label>
                  <input type="radio" id="first-rate5" name="rating" value="5" />
                  <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                </fieldset>
              </div>
              <label onClick={() => document.querySelector('.input-field').click()}>Add image:</label>
              <div className='flex flex-wrap md:w-full mt-1'>
                {image && image.map((item, index) =>
                  <div key={index} className='relative flex flex-col'>
                    <div onClick={() => removeImage(index)} className=' absolute z-10 top-0 right-0 p-2 md:mt-1 md:mr-1 md:p-3 '>
                      <IoIosClose className='text-red-500 bg-white shadow-lg rounded-full md:text-xl cursor-pointer' />
                    </div>
                    <img src={item.url} className='w-20 h-20 md:w-28 md:h-28 p-1 md:mr-2 md:my-1 rounded-xl'></img>
                  </div>
                )}
                {image && image.length < 5 &&
                  <div className='w-20 md:mr-2 md:my-1 p-1 h-20 md:w-28 md:h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-100 flex justify-center items-center' onClick={() => document.querySelector('.input-field').click()}>
                    <IoIosAdd className='text-slate-300 font-bold w-2/3 h-2/3 cursor-pointer' />
                    <input type='file' accept='image/*' className='hidden input-field' onChange={handleChange} />
                  </div>
                }
                {warning && <h1 className='text-red-500'>Maximum limit reached.</h1>}
              </div>
              <div>
                <button onClick={submitReview} className="mt-3 w-14  mb-2 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-1 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Post
                </button>
                <button onClick={enterReview} className="mt-3 w-16 ml-2 mb-2 items-center justify-center rounded-md border border-transparent bg-red-500 py-1 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        <div className='mt-2 md:mt-0 md:w-2/3 md:px-20'>
          {userReview && <DisplaySingleReview review={userReview} showImage={showImage} closeImage={closeImage} openImage={openImage} viewImage={viewImage} />}
          {allReviews &&
            allReviews.map((review) => {
              return (
                <DisplaySingleReview key={review._id} review={review} showImage={showImage} closeImage={closeImage} openImage={openImage} viewImage={viewImage} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}

function DisplaySingleReview({ review, openImage, closeImage, viewImage, showImage }) {
  return (
    <div className='flex mt-8 flex-col'>
      <div className='flex my-3'>
        <MdOutlineAccountCircle className='text-5xl' />
        <div className='ml-3 flex flex-col justify-center'>
          <span className='text-slate-900 font-semibold'>{review.author.fname} {review.author.lname}</span>
          <div className='flex items-center text-sm '>
            <FaStar className={`text-yellow-400  mx-[]`} />
            <FaStar className={`${review.rating >= 2 ? "text-yellow-400" : "text-slate-300"} mr-[.1rem]`} />
            <FaStar className={`${review.rating >= 3 ? "text-yellow-400" : "text-slate-300"} mr-[.1rem]`} />
            <FaStar className={`${review.rating >= 4 ? "text-yellow-400" : "text-slate-300"} mr-[.1rem]`} />
            <FaStar className={`${review.rating >= 5 ? "text-yellow-400" : "text-slate-300"} mr-[.1rem]`} />
          </div>
        </div>
      </div>
      {review.images &&
        <div className='flex flex-row flex-nowrap'>
          {review.images.map((i) => {
            return (
              <div key={i._id} className=' flex  items-center mb-2  w-auto h-24 cursor-pointer '>
                <img className='h-[5.5rem] hover:bg-slate-100 p-1 w-auto' src={i.url} onClick={() => showImage(i.url)}></img>
              </div>
            )
          })}
        </div>
      }
      {viewImage && (
        <div className='fixed top-0 left-0 z-30 w-[100vw] h-[100vh] bg-black bg-opacity-90 flex justify-center items-center '>
          <IoIosClose onClick={closeImage} className=' cursor-pointer fixed md:top-10 top-5 right-5 md:right-10 text-white text-5xl ' />
          <img className='border-2 border-black md:w-auto md:h-[80vh] w-[90%] h-auto' src={openImage}></img>

        </div>
      )}
      {review.comment &&
        <div className='text-sm text-slate-600 border-b-2 border-slate-100 pb-10'>
          {review.comment}
        </div>
      }
    </div>
  )
}