'use client';
import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Error from 'next/error';
import MessageBox from '@/Components/MessageBox';
import LoginDetailsContext from '@/Context/LoginDetailsContext';

const Login = () => {
    let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
    const router = useRouter()
    const loginDetails = useContext(LoginDetailsContext)
    useEffect(() => {
        if (loginDetails.admin) {
                router.back()
        }
    }, [loginDetails, router])
    const [formDetails, setFormDetails] = useState({ email: "", password: "" })
    const [showPassword, setshowPassword] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    function handleChange(evt) {
        setFormDetails((curr) => {
            curr[evt.target.name] = evt.target.value
            return ({ ...curr })
        })
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            setShowMessage({ loading: true, message: "Logging you in...Please Wait!" })
            let res = await axios.post(`/api/admin/login`, formDetails, { withCredentials: true })
            setShowMessage(false)
            if (res.data.status == "success") {
                setShowMessage({ success: true, message: "Login Successful" })
                loginDetails.setloginDetails((curr) => {
                    curr.admin = true
                    return ({ ...curr })
                })
                setTimeout(() => {
                    setShowMessage(false);
                        return router.replace("/")
                }, 1000);
            }
            else {
                if (res.data.incorectCredentials == "true") {
                    setShowMessage({ error: true, message: "Incorrect Credentials!", dismissable: true })
                    setFormDetails((curr) => {
                        curr.password = "";
                        return ({ ...curr })
                    })
                }
                else {
                    throw new Error("Something went Wrong!")
                }
            }
        }
        catch {
            setShowMessage({ error: true, message: "Something went wrong!" })
            setTimeout(() => {
                setShowMessage(false)
            }, 2000);
        }
    }
    return (
        <>
            {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
            <div className="flex mt-[33%] md:mt-[5rem] min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-[6rem] w-auto" src="https://t3.ftcdn.net/jpg/05/53/79/60/240_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="Your Company" />
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Login to your account
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <input value={formDetails.email} onChange={handleChange} id="email" name="email" type="email" autoComplete="email" required
                                className="block mt-2 px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <input value={formDetails.password} onChange={handleChange} id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                                className="mt-2 block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <div className="mt-2">
                                <input id='showPass' defaultChecked={showPassword} onClick={() => { setshowPassword(!showPassword) }} type='checkBox' /> <label htmlFor='showPass'>Show Password</label>
                            </div>
                        </div>
                        <div>
                            <button type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;