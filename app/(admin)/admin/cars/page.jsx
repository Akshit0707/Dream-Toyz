import React from 'react';
import CarsList from './components/car-list';

export const metadata = {
  title: "Cars - Admin",
  description: "Manage Cars",
};

const CarsPage = () => {
  return (
    <div className="pt-6 pl-65 pr-6 mb-2">
      <h1 className="text-5xl font-bold  flex items-center justify-between mb-6">
        Cars Management
      </h1>
      <CarsList />
    </div>
  );
};

export default CarsPage;
