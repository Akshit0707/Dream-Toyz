import { getCarById } from '@/actions/car-listing';
import { notFound } from 'next/navigation';
import React from 'react'
import TestDriveForm from './_components/test-drive-form';


export async function generateMetadata() {
    return{
        title: `Book a Test Drive | Dream Toyz`,
        description:`Schedule in few seconds`,
    };
} 

const TestDrivePage = async({params}) => {
    const {id}=params;
    const result = await getCarById(id);

    if(!result.success){
        notFound();
    }
  return (
    <div className='container mx-auto py-12 px-4'>
        <h1 className='text-6xl mb-6 gradient-title'>Book a Test-Drive</h1>
        <TestDriveForm
            car={result.data}
            testDriveInfo={result.data.testDriveInfo}
        />

    </div>
  )
}

export default TestDrivePage;
