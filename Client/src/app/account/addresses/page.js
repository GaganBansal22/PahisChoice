'use client';
import LoginDetailsContext from '@/Context/LoginDetailsContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import MessageBox from '@/components/MessageBox';
import Error from 'next/error';

const Page = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    const [showMessage, setShowMessage] = useState(false)
    const [addresses, setAddresses] = useState([])
    const [editAddress, setEditAddress] = useState(false)
    const [newAddressForm, setNewAddress] = useState(false)
    useEffect(() => {
        if (!loginDetails.user)
            return router.replace("/login?returnTo=/account/addresses")
        async function func() {
            try {
                let res = await axios.get(`/api/account/addresses`, { withCredentials: true })
                if (res.data.status == "success")
                    setAddresses(res.data.addresses)
                else
                    throw new Error("Error")
            } catch (error) {
                setShowMessage({ error: true, message: "Something went Wrong!" })
                setTimeout(() => {
                    router.back()
                }, 1000);
            }
        }
        func()
    }, [loginDetails.user, router])
    async function removeAddress(index) {
        try {
            if (addresses.length == 1) return setShowMessage({ error: true, message: "You cannot delete all the addresses", dismissable: true })
            setShowMessage({ loading: true, message: "Loading..." })
            let res = await axios.post(`/api/account/addresses/delete`, { index }, { withCredentials: true })
            if (res.data.status == "success") {
                setAddresses((curr) => {
                    curr.splice(index, 1)
                    return ([...curr])
                })
                setShowMessage(false)
            }
            else
                throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something Went wrong!", dismissable: true })
        }
    }
    if (newAddressForm)
        return <NewForm setNewAddress={setNewAddress} setAddresses={setAddresses} />
    if (editAddress)
        return <EditForm addr={editAddress.addr} index={editAddress.index} setEditAddress={setEditAddress} setAddresses={setAddresses} />
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[5rem] md:mt-[6rem] p-4 md:w-2/5 md:mx-auto'>
                <h1 className='text-xl md:text-4xl font-bold text-center'>Your Addresses</h1>
                {addresses.map((addr, index) => {
                    return (
                        <div key={index} className='p-4 border-[1px] rounded-lg mt-5 border-slate-200'>
                            <span className='block mb-1 font-semibold'>{addr.name}</span>
                            <span className='block'>{addr.address}</span>
                            <span className='block'>Pincode: {addr.pincode}</span>
                            <span className='block'><strong>Ph:</strong> {addr.phone}</span>
                            <span className='block'>{addr.city},{addr.state}</span>
                            <span className='block'>{addr.country}</span>
                            <div className='mt-4 space-x-3'>
                                <button onClick={() => { setEditAddress({ addr, index }) }} className='border-[1px] text-sm rounded-md px-5 border-slate-200 p-1 shadow-md hover:bg-blue-500 hover:text-white'>Edit</button>
                                <button onClick={() => { removeAddress(index) }} className='border-[1px] text-sm rounded-md px-5 border-slate-200 p-1 shadow-md hover:bg-red-500 hover:text-white'>Remove</button>
                            </div>
                        </div>)
                })}
                {addresses.length < 3 &&
                    <div onClick={() => { setNewAddress(true) }} className='border-y-[1px] text-slate-600 py-3 w-full mt-4 px-2 cursor-pointer  hover:bg-slate-50 '>
                        <span className='text-xl'>+</span>  Add a new address
                    </div>
                }
            </div>
        </>
    )
}

export default Page

const EditForm = ({ addr, index, setEditAddress, setAddresses }) => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const [showMessage, setShowMessage] = useState(false)
    const [address, setAddress] = useState({ ...addr, index })
    function updateAddressForm(evt) {
        setAddress((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function submitForm(evt) {
        evt.preventDefault();
        if (!address.address) return setShowMessage({ error: true, message: "Address Cannot be empty!", dismissable: true })
        if (!address.name) return setShowMessage({ error: true, message: "Name Cannot be empty!", dismissable: true })
        if (!address.phone) return setShowMessage({ error: true, message: "Phone number Cannot be empty!", dismissable: true })
        if (!address.pincode) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        if (!address.state) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        if (!address.city) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        try {
            setShowMessage({ loading: true })
            let res = await axios.post(`/api/account/addresses/edit`, address, { withCredentials: true })
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Details Updated" })
                setAddresses(res.data.addresses)
                setEditAddress(false)
            }
            else throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something Went wrong", dismissable: true })
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[5rem] p-4 md:w-2/5 md:mx-auto'>
                <h1 className='text-xl md:text-2xl font-bold border-b-[1px] mb-5 pb-2'>Edit your address</h1>
                <form onSubmit={submitForm} className='flex flex-col'>
                    <label className='font-semibold'>Full Name</label>
                    <input onChange={updateAddressForm} value={address.name} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='name'></input>
                    <label className='mt-3 font-semibold' >Phone Number</label>
                    <input onChange={updateAddressForm} value={address.phone} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='phone'></input>
                    <label className='mt-3 font-semibold'>Address</label>
                    <textarea onChange={updateAddressForm} value={address.address} name='address' className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md resize-none' rows='4' ></textarea>
                    <label className='font-semibold'>City</label>
                    <input onChange={updateAddressForm} value={address.city} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='city'></input>
                    <label className='font-semibold'>State</label>
                    <input onChange={updateAddressForm} value={address.state} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='state'></input>
                    <label className='mt-3 font-semibold'>Pincode</label>
                    <input onChange={updateAddressForm} value={address.pincode} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type='number' name='pincode'></input>
                    <div className='flex space-x-3 mt-6'>
                        <button className='rounded-lg px-4 py-2 text-white shadow-md hover:bg-green-400 bg-green-500' type='submit'>Submit</button>
                        <button onClick={() => { setEditAddress(false) }} className='rounded-lg px-4 py-2 text-white shadow-md hover:bg-red-400 bg-red-500'>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )
}

const NewForm = ({ setNewAddress, setAddresses }) => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const [showMessage, setShowMessage] = useState(false)
    const [address, setAddress] = useState({ name: "", phone: "", pincode: "", address: "",country:"India" })
    function updateAddressForm(evt) {
        setAddress((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function submitForm(evt) {
        evt.preventDefault();
        if (!address.address) return setShowMessage({ error: true, message: "Address Cannot be empty!", dismissable: true })
        if (!address.name) return setShowMessage({ error: true, message: "Name Cannot be empty!", dismissable: true })
        if (!address.phone) return setShowMessage({ error: true, message: "Phone number Cannot be empty!", dismissable: true })
        if (!address.pincode) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        if (!address.state) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        if (!address.city) return setShowMessage({ error: true, message: "Pincode Cannot be empty!", dismissable: true })
        try {
            setShowMessage({ loading: true })
            let res = await axios.post(`/api/account/addresses/new`, address, { withCredentials: true })
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Details Updated" })
                setAddresses(res.data.addresses)
                setNewAddress(false)
            }
            else throw new Error("Error")
        } catch (error) {
            setShowMessage({ error: true, message: "Something Went wrong", dismissable: true })
        }
    }
    return (
        <>
            {showMessage ? <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} /> : <></>}
            <div className='mt-[5rem] p-4 md:w-2/5 md:mx-auto'>
                <h1 className='text-xl md:text-2xl font-bold border-b-[1px] mb-5 pb-2'>Add address</h1>
                <form onSubmit={submitForm} className='flex flex-col'>
                    <label className='font-semibold'>Full Name</label>
                    <input onChange={updateAddressForm} value={address.name} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='name'></input>
                    <label className='mt-3 font-semibold' >Phone Number</label>
                    <input onChange={updateAddressForm} value={address.phone} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='phone'></input>
                    <label className='mt-3 font-semibold'>Address</label>
                    <textarea onChange={updateAddressForm} value={address.address} name='address' className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md resize-none' rows='4' ></textarea>
                    <label className='mt-3 font-semibold'>City</label>
                    <input onChange={updateAddressForm} value={address.city} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='city'></input>
                    <label className='mt-3 font-semibold'>State</label>
                    <input onChange={updateAddressForm} value={address.state} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md' type='text' name='state'></input>
                    <label className='mt-3 font-semibold'>Pincode</label>
                    <input onChange={updateAddressForm} value={address.pincode} className='p-1 border-[1px] border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:opacity-75 focus:ring-blue-500 focus:shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type='number' name='pincode'></input>
                    <div className='flex space-x-3 mt-6'>
                        <button className='rounded-lg px-4 py-2 text-white shadow-md hover:bg-green-400 bg-green-500' type='submit'>Submit</button>
                        <button onClick={() => { setNewAddress(false) }} className='rounded-lg px-4 py-2 text-white shadow-md hover:bg-red-400 bg-red-500'>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )
}