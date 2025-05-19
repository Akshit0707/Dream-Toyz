"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { CarIcon, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { Badge } from './badge';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/use-fetch';
import { toogleSavedCars } from '@/actions/car-listing';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

// Helper to safely convert price
const getINRPrice = (price) => {
  if (price === undefined || price === null) {
    return null;
  }

  const priceNumber = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(priceNumber)) {
    return null;
  }

  const inrPrice = priceNumber * 83;
  return inrPrice;
};

const CarCard = ({ car }) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const {
    loading: isToogling,
    fn: toogleSavedCarFn,
    data: toogleResult,
    error: toogleError,
  } = useFetch(toogleSavedCars);

  useEffect(() => {
    if (toogleResult?.success && toogleResult.saved !== isSaved) {
      setIsSaved(toogleResult.saved);
      toast.success(toogleResult.message);
    }
  }, [toogleResult, isSaved]);

  useEffect(() => {
    if (toogleError) {
      toast.error("Failed to upload favourites")
    }
  }, [toogleError])

  const handleToggleSave = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please Sign-In to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToogling) return;

    await toogleSavedCarFn(car.id);
  };

  const inrPrice = getINRPrice(car.price);

  return (
    <Card className="relative w-full group overflow-hidden hover:shadow-lg transition duration-300 py-0">

      {/* Image Section */}
      {car.images && car.images.length > 0 ? (
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
          <CarIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}

      {/* Save button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 z-10 ${isSaved ? "text-red-500 hover:text-red-700" : "text-gray-500 hover:text-gray-700"}`}
        onClick={handleToggleSave}
      >
        {isToogling ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Heart className={isSaved ? "fill-current" : ""} size={20} />)}
      </Button>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="flex flex-col mb-2">
          <h3 className="text-lg font-bold line-clamp-1">
            {car.make} {car.model}
          </h3>
          <span className="text-xl font-bold text-blue-600">
            {inrPrice !== null ? `₹${inrPrice.toLocaleString('en-IN')}` : "Price Not Available"}
          </span>
        </div>

        <div className="text-gray-600 mb-2 flex items-center text-sm">
          <span>{car.year}</span>
          <span className="mx-2">•</span>
          <span>{car.transmission}</span>
          <span className="mx-2">•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="bg-gray-50">{car.bodyType}</Badge>
          <Badge variant="outline" className="bg-gray-50">{car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"}</Badge>
          <Badge variant="outline" className="bg-gray-50">{car.color}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <Button className="flex-1" onClick={() => router.push(`/cars/${car.id}`)}>
            View Cars
          </Button>
        </div>
      </CardContent>

    </Card>
  );
};

export default CarCard;
