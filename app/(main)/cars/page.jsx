import { getCarFilters } from '@/actions/car-listing'
import React from 'react'
import CarFilters from './_components/car-filters';
import CarListings from './_components/car-listing';

export const metadata = {
    title: "Cars | DreamToyz",
    description: "Browse and search your Dream car"
};

const CarsPage = async() => {
    const filtersData= await getCarFilters();
    return (
        <div className='container mx-auto px-4 py-4'>
            <h1 className='text-6xl mb-4 gradient-title'>Browse Cars</h1>

            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='w-full lg:w-80 flex-shrink-0'>
                    <CarFilters filters={filtersData.data} />
                </div>
                <div className='flex-1'>
                    <CarListings />
                </div>
            </div>
        </div>
    );
};

export default CarsPage;
