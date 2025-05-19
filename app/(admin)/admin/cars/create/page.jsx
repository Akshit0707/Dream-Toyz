import React from 'react'
import AddCarForm from '../components/add-car-form';

export const metadata = {
  title: "Add New Car - Admin",
  description: "Add a new car to the inventory",
};

const AddCarPage = () => {
  return  <div className="pt-6 pl-56 pr-6">
        <h1 className="text-4xl font-bold flex items-center justify-between mb-6">
        Cars Management
      </h1>
      <AddCarForm />
    </div>
  
}

export default AddCarPage
