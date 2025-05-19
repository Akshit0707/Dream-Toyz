import React from 'react'
import TestDrivesList from './_components/test-drive-list';

export const metadata={
    title:"Test-Drives | Dream Toyz Admin",
    description:"Manage test-drive bookings",
};

const TestDrivePage = () => {
  return (
    <div className='p-6 mt-2' style={{ marginLeft: '250px' }}>
      <h1 className='text-4xl font-bold mb-6'>Test-Drive Management</h1>
      <TestDrivesList />
    </div>
  )
}

export default TestDrivePage
