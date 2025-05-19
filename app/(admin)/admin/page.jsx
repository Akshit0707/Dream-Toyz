import { getDashboardData } from '@/actions/admin'
import React from 'react'
import Dasboard from './_components/dasboard';

export const metadata={
  title:"Dashboard | Dream Toyz Admin",
  description: "Admin Dashboard",
}

const AdminPage = async() => {
  const dashboardData= await getDashboardData();
  return (
    <div className='pl-65 p-6 mt-6'>
      <h1 className='text-4xl font-bold mb-6'>Dashboard</h1>
      <Dasboard initialData={dashboardData} />
    </div>
  )
}

export default AdminPage
