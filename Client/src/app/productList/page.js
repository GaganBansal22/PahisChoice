'use client'
import { Suspense, useContext, useEffect, useState } from "react"
import Link from "next/link"
import axios from 'axios';
import Error from "next/error"
import MessageBox from '@/components/MessageBox';
import { useRouter, useSearchParams } from 'next/navigation'
import { FaStar } from "react-icons/fa";
import LoginDetailsContext from "@/Context/LoginDetailsContext";

function Page() {
    const searchParams = useSearchParams()
    const cat = searchParams.get('category')
    const sub = searchParams.get('sub')
    let [categories, setCategories] = useState(
        { Jewellery: false, Bags: false, Clothes: false, Other: false }
    )
    let [category, setCategory] = useState({ category: "", subCategory: "", sub2Category: "" })
    useEffect(() => {
        handleChange(cat)
        changeImage(sub, cat, "")
    }, [])
    const handleChange = (categoryName) => {
        setCategories((prevCategories) => {
            const updatedCategories = {};
            Object.keys(prevCategories).forEach((category) => {
                updatedCategories[category] = category === categoryName;
            });
            return updatedCategories;
        });
        if(categoryName =='Bags')
        changeImage('Mini%20bag', 'Bags', '')
    };
    const changeImage = (sub, cat, sub2) => {
        setCategory((prevCategory) => {
            return {
                ...prevCategory,
                category: cat,
                subCategory: sub,
                sub2Category: sub2
            };
        });
    };


    const Jewellery = [
        {
            name: 'Assamese',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Oxidised',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Kundan',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Bracelet',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Pendent',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Handmade',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Other',
            url: 'https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
    ]
    const Bags = [
        {
            name: 'Mini',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Sling',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Hand',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Tote',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Purse',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Other',
            url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
    ]
    const Clothes = [
        {
            Women: [
                {
                    name: "Jacket/Coat",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Tops",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Cardigan",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Co-ordset",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Lower",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Dresses",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Mekhela Chador",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Others",
                    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },


            ]
            ,
            Men: [
                {
                    name: "T-shirts",
                    url: 'https://plus.unsplash.com/premium_photo-1706108819052-cdf0c2c54fa0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Shirts",
                    url: 'https://plus.unsplash.com/premium_photo-1706108819052-cdf0c2c54fa0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Hoodies",
                    url: 'https://plus.unsplash.com/premium_photo-1706108819052-cdf0c2c54fa0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    name: "Others",
                    url: 'https://plus.unsplash.com/premium_photo-1706108819052-cdf0c2c54fa0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
            ]
        }
    ];


    return (
        <div className="px-4 mb-16">
            <div className="md:hidden flex  mt-[4.5rem] justify-between  py-2 h-11">
                <div className={`${categories.Jewellery && 'border-b-[2.5px]  text-pink-500  font-semibold'} border-pink-500 `} onClick={() => handleChange('Jewellery')}>Jewellery</div>
                <div className={`${categories.Bags && 'border-b-[2.5px]  text-pink-500 font-semibold'} border-pink-500 `} onClick={() => handleChange('Bags')}>Bags</div>
                <div className={`${categories.Clothes && 'border-b-[2.5px]  text-pink-500 font-semibold'} border-pink-500 `} onClick={() => handleChange('Clothes')}>Clothes</div>
                <div className={`${categories.Other && 'border-b-[2.5px]  text-pink-500 font-semibold'} border-pink-500 `} onClick={() => handleChange('Other')}>Other</div>
            </div>
            <div className="md:hidden">
                {(categories.Jewellery &&
                    <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar ">
                        {Jewellery.map((item, index) => (

                            <div key={index} onClick={() => changeImage(item.name + ' Jewellery', 'Jewellery', '')} className="min-w-fit flex flex-col items-center justify-center">
                                <img src={`${item.url}`} className="h-16 object-cover rounded-full w-16 mb-1"></img>
                                <span className="text-sm text-slate-600 ">{item.name}
                                </span>
                            </div>
                        ))
                        }
                    </div>)}
                {(categories.Bags &&
                    <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar ">
                        {Bags.map((item, index) => (
                            <div onClick={() => changeImage(item.name + '%20bag', 'Bags', '')} key={index} className="min-w-fit flex flex-col items-center justify-center">
                                <img src={`${item.url}`} className="h-16 object-cover rounded-full w-16 mb-1"></img>
                                <span className="text-sm ">{item.name}
                                </span>
                            </div>
                        ))
                        }
                    </div>)}
                {(categories.Clothes &&
                    <div>
                        <h1 className="font-bold mb-2">Women</h1>
                        <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar ">
                            {Clothes[0].Women.map((item, index) => (
                                <div key={index} className="min-w-fit flex flex-col items-center justify-center">
                                    <img src={`${item.url}`} className="h-16 object-cover rounded-full w-16 mb-1"></img>
                                    <span className="text-sm ">{item.name}
                                    </span>
                                </div>
                            ))
                            }
                        </div>
                        <h1 className="font-bold mt-5 mb-2">Men</h1>
                        <div className="mt-1 space-x-5 overflow-x-auto flex no-scrollbar ">
                            {Clothes[0].Men.map((item, index) => (
                                <div key={index} className="min-w-fit flex flex-col items-center justify-center">
                                    <img src={`${item.url}`} className="h-16 object-cover rounded-full w-16 mb-1"></img>
                                    <span className="text-sm ">{item.name}
                                    </span>
                                </div>
                            ))
                            }
                        </div>
                    </div>)}
            </div>
            {category.category && <Products category={category}/>}
        </div>
    )
}

function Products({ category }) {
    const loginDetails = useContext(LoginDetailsContext)
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    let [products, setProducts] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const router = useRouter()
    useEffect(() => {
        async function func() {
            try {
                console.log('Product fetch is called')
                let res = await axios.get(`/api/productList?category=${category.category}&subCategory=${category.subCategory}&sub2Category=${category.sub2Category}`)
                console.log(category)
                console.log(`/api/productList?category=${category.category}&subCategory=${category.subCategory}&sub2Category=${category.sub2Category}`)
                if (res.data.status == "success")
                    setProducts(res.data.products)
                else throw new Error("Error")
            } catch (error) {
                setShowMessage({ error: true, message: "Something went wrong!" });
                setTimeout(() => {
                    router.back()
                }, 500);
            }
        }
        func()
    }, [category])
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
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className='mt-5 md:mt-[7rem] grid grid-cols-2 md:gap-5 md:px-10 md:grid-cols-3 lg:grid lg:grid-cols-4 lg:gap-5 lg:w-4/5 lg:px-0 md:mx-auto md:mb-10'>
                {products.map((product, index) => {
                    return (
                        <div key={product._id} className={`border-t-[1px] border-slate-200 flex-col md:border-[1px]   items-center py-4 lg:w-[90%] md:rounded-lg md:shadow-md cursor-pointer hover:lg:shadow-xl ${(index % 2 == 0) && 'border-r-[1px]'}  lg:transition-shadow lg:duration-400`}>
                            <Link href={`/product/${product._id}`} className='w-full flex justify-center items-center'>
                                <img src={product.images[0].url} className='h-32 lg:h-40 w-auto'></img>
                            </Link>
                            <div className='lg:mt-2 lg:px-5 w-full text-sm  flex flex-col px-2'>
                                <Link href={`/product/${product._id}`}><span className='font-semibold lg:text-xl'>{product.name}</span></Link>
                                {product.totalReviews > 0 &&
                                    <div className='item-center'>
                                        <div className='flex items-center  text-sm mt-1'>
                                            <FaStar className={`${(product.totalRatings / product.totalReviews) >= 1 ? "text-yellow-400" : "text-slate-300"}`} />
                                            <FaStar className={`${(product.totalRatings / product.totalReviews) >= 2 ? "text-yellow-400" : "text-slate-300"}`} />
                                            <FaStar className={`${(product.totalRatings / product.totalReviews) >= 3 ? "text-yellow-400" : "text-slate-300"}`} />
                                            <FaStar className={`${(product.totalRatings / product.totalReviews) >= 4 ? "text-yellow-400" : "text-slate-300"}`} />
                                            <FaStar className={`${(product.totalRatings / product.totalReviews) >= 5 ? "text-yellow-400" : "text-slate-300"}`} />
                                            <span className='text-[.65rem] text-blue-500 ml-1'> ({product.totalReviews})</span>
                                        </div>
                                    </div>
                                }
                                <span className='md:text-xl font-medium'>
                                    ₹{product.price}
                                    {product.price != product.mrp &&
                                        <span className='text-xs md:text-sm'><span className='text-green-600'> -{product.discount >= 1 ? `${product.discount}%` : product.mrp - product.price}</span>
                                            <span> <s> ₹ {product.mrp}</s></span></span>
                                    }
                                </span>
                                <span className='text-[.6rem] lg:text-sm'>Delivery by <strong> {returnDeliverydate()}</strong></span>
                                <button onClick={() => { addToCart(product._id) }} className='bg-pink-500 text-xs md:text-sm text-white mt-2 w-24 lg:w-24 rounded-md shadow-md py-1 hover:bg-pink-400'>Add to cart</button>
                            </div>
                        </div>
                    )
                })}
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