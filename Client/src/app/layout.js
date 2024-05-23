'use client';
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import LoginDetailsContext from "../Context/LoginDetailsContext"
import axios from 'axios';
import MessageBox from '@/components/MessageBox';
import FooterNavbar from '@/components/FooterNavbar';
const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  const [loginDetails, setloginDetails] = useState({ user: false, admin: false, numCartItems: 0 })
  const [showMessage, setShowMessage] = useState(false)
  useEffect(() => {
    async function func() {
      try {
        // setShowMessage({ loading: "true", message: "Loading....Please wait!!" })
        let res = await axios.get(`/api/loginStatus`, { withCredentials: true })
        // setShowMessage(false)
        if (res.data.authenticated && res.data.user)
            setloginDetails({ user: true, numCartItems: res.data.numCartItems })
        else
          setloginDetails({ user: false, numCartItems: res.data.numCartItems })
      }
      catch (e) {
        ;
      }
    }
    func()
  }, [])
  return (
    <LoginDetailsContext.Provider value={{ ...loginDetails, setloginDetails }}>
      <html lang="en">
        <head>
          <title>Pahi&apos;s Choice</title>
          
        </head>
        <body className={inter.className}>
          <Navbar />
          {showMessage && <MessageBox success={showMessage.success} error={showMessage.error} loading={showMessage.loading} message={showMessage.message} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
          <div className="min-h-screen">
          {children}

          </div>
          <Footer/>
          <FooterNavbar/>
        </body>
      </html>
    </LoginDetailsContext.Provider>
  )
}
