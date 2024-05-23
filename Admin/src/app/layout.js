'use client';
import { Inter } from 'next/font/google'
import './globals.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import LoginDetailsContext from '@/Context/LoginDetailsContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/Components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  const [loginDetails, setloginDetails] = useState({ admin: false })
  const router = useRouter()
  useEffect(() => {
    async function func() {
      try {
        let res = await axios.get(`/api/loginStatus`, { withCredentials: true })
        if (res.data.authenticated && res.data.admin)
          setloginDetails({ admin: true })
        else
          router.push("/login")
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
          <div className='md:ml-[21%] md:mt-[4rem] mt-[4rem]'>
            {children}
          </div>
        </body>
      </html>
    </LoginDetailsContext.Provider>
  )
}
