'use client'
import React, { useEffect } from 'react'
import Link from 'next/link';
import { FaAngleDown } from "react-icons/fa6";
import { useState } from 'react';
import axios from 'axios';

function ProductList() {
  let [categories, setCategories] = useState([false, false, false, false])
  let [subCategories, setSubCategories] = useState([false, false])
  const handleChange = (index) => {
    let newCategories = [...categories]
    newCategories[index] = !newCategories[index]
    setCategories(newCategories)
  }
  const handleSubCategory = (index) => {
    let newSubCategories = [...subCategories]
    newSubCategories[index] = !newSubCategories[index]
    setSubCategories(newSubCategories)
  }
  let [currCategory, setCurrCategory] = useState({
    category: 'Jewellery',
    subCategory: 'Assamese Jewellery',
    sub2Category: ''
  })
  const changeCategory = (cat, sub, sub2) => {
    let newCurrCategory = { ...currCategory }
    newCurrCategory.category = cat;
    newCurrCategory.subCategory = sub;
    newCurrCategory.sub2Category = sub2;
    setCurrCategory(newCurrCategory)
    console.log(newCurrCategory)
  }
  return (
    <div>
      <nav className='mt-16 border-[1px] shadow-lg rounded-xl mr-8 cursor-pointer font-semibold text-lg flex justify-between px-20 py-4'>
        <div className='flex hover:text-pink-500 space-x-1 items-center relative'>
          <div className='flex items-center' onClick={() => handleChange(0)}>
            <span className=''>Jewellery</span>
            <FaAngleDown className='text-base' />
          </div>
          {(categories[0] && (
            <div className='absolute top-8 left-5 border-[1px] bg-white font-medium  py-2 rounded-md flex flex-col text-black space-y-2 z-10'>
              <span onClick={() => changeCategory('Jewellery', 'Assamese Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Assamese</span>
              <span onClick={() => changeCategory('Jewellery', 'Oxidised Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Oxidised</span>
              <span onClick={() => changeCategory('Jewellery', 'Kundan Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Kundan</span>
              <span onClick={() => changeCategory('Jewellery', 'Bracelet Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Bracelet</span>
              <span onClick={() => changeCategory('Jewellery', 'Pendent Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Pendent</span>
              <span onClick={() => changeCategory('Jewellery', 'Handmade Jewellery', '')} className='hover:bg-slate-100 px-4 py-1'>Handmade</span>
              <span onClick={() => changeCategory('', '', '')} className='hover:bg-slate-100 px-4 py-1'>Other</span>
            </div>
          ))}
        </div>
        <div className='flex hover:text-pink-500 space-x-1 items-center relative'>
          <div onClick={() => handleChange(1)} className='flex items-center'>
            <span className=''>Bags</span>
            <FaAngleDown className='text-base' />
          </div>
          {(categories[1] && (
            <div className='absolute top-8 left-5 border-[1px] bg-white font-medium  py-2 rounded-md flex flex-col text-black space-y-1'>
              <span onClick={() => changeCategory('Bags', 'Mini bag', '')} className='hover:bg-slate-100 px-5 py-1'>Mini</span>
              <span onClick={() => changeCategory('Bags', 'Sling bag', '')} className='hover:bg-slate-100 px-5 py-1'>Sling</span>
              <span onClick={() => changeCategory('Bags', 'Hand bag', '')} className='hover:bg-slate-100 px-5 py-1'>Hand</span>
              <span onClick={() => changeCategory('Bags', 'Tote bag', '')} className='hover:bg-slate-100 px-5 py-1'>Tote</span>
              <span onClick={() => changeCategory('Bags', 'Purse bag', '')} className='hover:bg-slate-100 px-5 py-1'>Purse</span>
              <span onClick={() => changeCategory('', '', '')} className='hover:bg-slate-100 px-5 py-1'>Other</span>
            </div>
          ))}
        </div>
        <div className='flex hover:text-pink-500 space-x-1 items-center relative'>
          <div onClick={() => handleChange(2)} className='flex items-center'>
            <span className=''>Clothes</span>
            <FaAngleDown className='text-base' />
          </div>
          {(categories[2] && (
            <div className='z-10 absolute top-8 left-5 border-[1px] bg-white font-medium  py-3 rounded-md flex flex-col text-black space-y-1'>
              <span onClick={() => { handleSubCategory(0) }} className='font-bold px-5'>Women</span>
              {(subCategories[0] && (
                <div className='flex flex-col'>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Jacket/Coat')} className='hover:bg-slate-100 px-6 py-1'>Jacket/Coat</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Tops')} className='hover:bg-slate-100 px-6 py-1'>Tops</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Cardigan')} className='hover:bg-slate-100 px-6 py-1'>Cardigan</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Co-ordset')} className='hover:bg-slate-100 px-6 py-1'>Co-ordset</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Lower')} className='hover:bg-slate-100 px-6 py-1'>Lower</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Dresses')} className='hover:bg-slate-100 px-6 py-1'>Dresses</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Mekhela')} className='hover:bg-slate-100 px-6 py-1'>Mekhela</span>
                  <span onClick={() => changeCategory('Clothes', 'Women', 'Others')} className='hover:bg-slate-100 px-6 py-1'>Others</span>
                </div>
              ))}
              <span onClick={() => { handleSubCategory(1) }} className='font-bold px-5'>Men</span>
              {(subCategories[1] && (
                <div className='flex flex-col '>
                  <span onClick={() => changeCategory('Clothes', 'Men', 'T-shirt')} className='hover:bg-slate-100 px-6 py-1'>T-shirt</span>
                  <span onClick={() => changeCategory('Clothes', 'Men', 'Shirts')} className='hover:bg-slate-100 px-6 py-1'>Shirts</span>
                  <span onClick={() => changeCategory('Clothes', 'Men', 'Hoodies')} className='hover:bg-slate-100 px-6 py-1'>Hoodies</span>
                  <span onClick={() => changeCategory('Clothes', 'Men', 'Others')} className='hover:bg-slate-100 px-6 py-1'>Others</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div onClick={() => handleChange(3)} className='flex hover:text-pink-500 space-x-1 
          items-center relative'>
          <span className=''>Other</span>
          <FaAngleDown className='text-base' />
          {(categories[3] && (
            <div className='absolute top-8 left-5 border-[1px] bg-white font-medium px-4 py-3 rounded-md flex flex-col text-black space-y-2'>
              <span>Assamese</span>
              <span>Assamese</span>
              <span>Assamese</span>
              <span>Oxidised</span>
            </div>
          ))}
        </div>
      </nav>
      <Products category={currCategory} />
    </div>
  )
}

export default ProductList

function Products({ category }) {
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  let [products, setProducts] = useState([])
  useEffect(() => {
    async function func() {
      try {
        let res = await axios.get(`${serverAddress}/productList?category=${category.category}&subCategory=${category.subCategory}`)
        if (res.data.status == 'success') {
          setProducts(res.data.products)
        }
        else throw new Error('Error')
      } catch (error) {
        console.log("Error while fetching products : " + error)
      }
    }
    func()
  }, [category])
  return (
    <div className='mt-5 grid grid-cols-2 md:grid-cols-4 pr-5 gap-5 '>
      {products.map((product, index) => (
        <div key={index} className='border-[1px] p-4'>
          <img src={product.images[0].url} className='w-auto h-auto' />
          <div className='flex flex-col mt-4 relative'>
            <span className='font-semibold text-lg'>{product.name}</span>
            <span className='font-medium '>₹{product.price}</span>
            <span>Quantity: <span className='font-normal'>{product.qty}</span>  </span>
            <div className='absolute right-0 flex items-center space-x-1 bottom-0'>
              <Link href={`/admin/product/edit/${product._id}`}>
                <div className='text-white text-base font-medium cursor-pointer bg-indigo-600 hover:bg-indigo-400 px-6 py-1'>
                  Edit
                </div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}