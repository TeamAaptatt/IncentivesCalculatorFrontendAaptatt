import React from 'react'
import { Outlet } from 'react-router-dom'
import Head from '../components/Head'
import {  useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { Toaster } from 'react-hot-toast'

const Layout = () => {
  const load = useSelector((state)=> state.loader.loading)

  return (
    <div>
      {load && <Loader/>}
      <Toaster/>
        <Head/>
        <Outlet/>
    </div>
  )
}

export default Layout