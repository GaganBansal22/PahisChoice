"use client";
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MessageBox from '@/Components/MessageBox';
import axios from 'axios';
import Error from 'next/error';

let subcategories = {
    Jewellery: ["Assamese Jewellery", "Oxidised Jewellery", "Kundan Jewellery", "Bracelet Jewellery", "Pendant", "Handmade", "Other"],
    Bags: ["Mini bag", "Sling bag", "Hand bag", "Tote bag", "Purse", "Other"],
    Clothes: ["Men", "Women"],
    Women: ["Jacket/Coat", "Tops", "Cardigan", "Lower", "Co-ordset", "Dresses", "Mekhela Chador", "Others"],
    Men: ["T-shirts", "Shirts", "Hoodies", "Others"]
}

const removeNumberChangeButtonClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const [formDetails, setFormDetails] = useState({ name: "", weight: "", length: "", breadth: "", height: "", fixedDeliveryFee: "", deliveryFeeIncrement: "", size: "", color: "", qtyAvailable: "", category: "Jewellery", subCategory: "Assamese Jewellery", sub2Category: "", price: "", mrp: "", description: "" })
    const [subCategoryRequired, setsubCategoryRequired] = useState(true)
    const [sub2CategoryRequired, setsub2CategoryRequired] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const { pid } = useParams()
    function setCategory(evt) {
        if (evt.target.value in subcategories) {
            setsubCategoryRequired(true)
            if (subcategories[evt.target.value][0] in subcategories) {
                setsub2CategoryRequired(true)
                setFormDetails((curr) => {
                    curr.sub2Category = subcategories[subcategories[evt.target.value][0]][0]
                    return ({ ...curr })
                })
            }
            else
                setsub2CategoryRequired(false)
        }
        else {
            setsubCategoryRequired(false)
            setsub2CategoryRequired(false)
        }
        setFormDetails((curr) => {
            if (evt.target.value in subcategories)
                curr.subCategory = subcategories[evt.target.value][0]
            curr.category = evt.target.value
            return ({ ...curr })
        })
    }
    function setsubCategory(evt) {
        setFormDetails((curr) => {
            curr.subCategory = evt.target.value
            if (evt.target.value in subcategories)
                curr.sub2Category = subcategories[evt.target.value][0]
            return ({ ...curr })
        })
        if (evt.target.value in subcategories)
            setsub2CategoryRequired(true)
        else
            setsub2CategoryRequired(false)
    }
    function setsub2Category(evt) {
        setFormDetails((curr) => {
            curr.sub2Category = evt.target.value
            return ({ ...curr })
        })
    }
    async function handleSubmit(evt) {
        evt.preventDefault()
        const formData = new FormData(document.querySelector(".FormDetails"));
        let deleteImg = formData.getAll('deleteImg')
        deleteImg = deleteImg.length
        let imgsAdded = formData.getAll('image')
        if (!imgsAdded[0].name)
            imgsAdded = 0
        else
            imgsAdded = imgsAdded.length
        if (formDetails.images.length + imgsAdded - deleteImg <= 0) {
            setShowMessage({ error: true, message: "A product must have atleast 1 image", dismissable: true })
            return;
        }
        if (parseInt(formDetails.mrp) < 0) {
            setShowMessage({ error: true, dismissable: true, message: "MRP cannot be less than 0" })
            return;
        }
        if (parseInt(formDetails.price) < 0) {
            setShowMessage({ error: true, dismissable: true, message: "Selling price cannot be less than 0" })
            return;
        }
        if (parseInt(formDetails.mrp) < parseInt(formDetails.price)) {
            setShowMessage({ error: true, dismissable: true, message: "MRP cannot be less than Selling Price" })
            return;
        }
        try {
            setShowMessage({ loading: true, message: "Editing Product...Please wait" })
            let res = await axios.post(`/api/admin/product/edit/${pid}`, formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
            setShowMessage(false)
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Edited Successfully..." })
                setTimeout(() => {
                    router.replace(`/product/${pid}`)
                }, 1000);
            }
            else
                throw new Error("Error")
        }
        catch (error) {
            console.log(error)
            setShowMessage({ error: true, message: "Something Went Wrong!", dismissable: true })
        }
    }
    function handleChange(evt) {
        setFormDetails((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    useEffect(() => {
        setShowMessage({ loading: true, message: "Loading Product Details..." })
        async function func() {
            try {
                let res = await axios.get(`/api/admin/product/${pid}/edit`, { withCredentials: true })
                setShowMessage(false)
                if (res.data.status == "success") {
                    setFormDetails({ ...res.data.product })
                    if (res.data.product.subCategory) {
                        setsubCategoryRequired(true)
                        if (res.data.product.sub2Category)
                            setsub2CategoryRequired(true)
                        else
                            setsub2CategoryRequired(false)
                    }
                    else {
                        setsubCategoryRequired(false)
                        setsub2CategoryRequired(false)
                    }
                }
                else
                    throw new Error("Error fetching product details")
            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        }
        func()
    }, [])
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className="flex mt-[33%] md:mt-[5rem] min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* <img className="mx-auto h-[6rem] w-auto" src="https://t3.ftcdn.net/jpg/05/53/79/60/240_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="Your Company" /> */}
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Edit Product
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto FormDetails">
                        <div className="relative z-0 w-full mb-5 group">
                            <input onChange={handleChange} value={formDetails.name} type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product Name</label>
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>
                            <label htmlFor="category" className="block mb-2 text-sm  text-gray-900 dark:text-white">Category</label>
                            <select onChange={setCategory} value={formDetails.category} name='category' id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="Jewellery">Jewellery</option>
                                <option value="Bags">Bags</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {subCategoryRequired &&
                            <div className='relative z-0 w-full mb-5 group'>
                                <label htmlFor="subcategory" className="block mb-2 text-sm  text-gray-900 dark:text-white">Sub-category</label>
                                <select onChange={setsubCategory} value={formDetails.subCategory} name='subCategory' id="subcategory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {subcategories[formDetails.category].map((cat) => {
                                        return <option key={cat} value={cat}>{cat}</option>
                                    })}
                                </select>
                            </div>}
                        {sub2CategoryRequired &&
                            <div className='relative z-0 w-full mb-5 group'>
                                <label htmlFor="subSubcategory" className="block mb-2 text-sm  text-gray-900 dark:text-white">Sub-category</label>
                                <select onChange={setsub2Category} value={formDetails.sub2Category} name='sub2Category' id="subSubcategory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {subcategories[formDetails.subCategory].map((cat) => {
                                        return <option key={cat} value={cat}>{cat}</option>
                                    })}
                                </select>
                            </div>}
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.mrp} type="number" name="mrp" id="mrp" className={`${removeNumberChangeButtonClass} block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="mrp" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">MRP</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.price} type="number" name="price" id="price" className={`${removeNumberChangeButtonClass} block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="price" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Selling Price</label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.color} type="text" name="color" id="color" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="color" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Color</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.size} type="text" name="size" id="size" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="size" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Size</label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.fixedDeliveryFee} type="text" name="fixedDeliveryFee" id="fixedDeliveryFee" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="fixedDeliveryFee" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Fixed Delivery Fee</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.deliveryFeeIncrement} type="text" name="deliveryFeeIncrement" id="deliveryFeeIncrement" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="deliveryFeeIncrement" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Delivery Fee Increment</label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.length} type="text" name="length" id="length" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="length" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Length</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.breadth} type="text" name="breadth" id="breadth" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="breadth" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Breadth</label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.height} type="text" name="height" id="height" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="height" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Height</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={handleChange} value={formDetails.weight} type="text" name="weight" id="weight" className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                                <label htmlFor="weight" className={`${removeNumberChangeButtonClass} peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>Weight</label>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input onChange={handleChange} value={formDetails.qtyAvailable} type="number" name="qtyAvailable" id="qtyAvailable" className={`${removeNumberChangeButtonClass} block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required />
                            <label htmlFor="qtyAvailable" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Quantity Available</label>
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea onChange={handleChange} defaultValue={formDetails.description} id="description" name='description' rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe the product..."></textarea>
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="image">Upload Image(s)...</label>
                            <input className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="images" name='image' id="image" type="file" multiple />
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>
                            <span className='block'>Select Images to be deleted</span>
                            <div className='flex flex-wrap w-full '>
                                {formDetails.images && formDetails.images.map((image) => {
                                    return (
                                        <span className='w-1/5' key={image._id}>
                                            <input className="inline" type="checkbox" value={image.filename} name="deleteImg" id={image._id} />
                                            <label htmlFor={image._id}><img src={image.url} alt="" /></label>
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Page