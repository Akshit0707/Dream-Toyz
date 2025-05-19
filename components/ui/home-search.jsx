"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera,  Upload } from 'lucide-react';
import { toast } from 'sonner';
import useFetch from '@/hooks/use-fetch';
import { processImageSearch } from '@/actions/home';
import { useRouter } from 'next/navigation';

const onDrop = (acceptedFiles) => {
  const file = acceptedFiles[0];
  if (file.size > 20 * 1024 * 1024) {
    toast.error("File size exceeds 20MB");
    return;
  }
  setIsUploading(true);
  setSearchImage(file);
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
    setIsUploading(false);
    toast.success("Image uploaded successfully");
  };
  reader.onerror = () => {
    setIsUploading(false);
    toast.error("Error uploading image");
  }
  reader.readAsDataURL(file);
};

const HomeSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [searchImage, setSearchImage] = useState(null);


  const{
    loading: isProcessing,
    fn: processImageFn,
    data:processResult,
    error:processError,
  }=useFetch(processImageSearch)

  const handleTextSubmit = (e) => {
    e.preventDefault();
    console.log("Text Search:", searchTerm);
    // Add logic here
  };

  const handleImageSearch = async(e) => {
    e.preventDefault();
    if(!searchImage){
      toast.error("Please upload Image First");
      return;
    }
    await processImageFn(searchImage);
  };

  useEffect(()=>{
    if(processError){
      toast.error("Failed to analyze image: "+ (processError.message || "Unknown Error"));
    }
  },[processError]);

  useEffect(()=>{
    if(processResult?.success){
      const params= new URLSearchParams();

      if(processResult.data.make)params.set("make", processResult.data.make); 
      if(processResult.data.bodyType)params.set("bodyType", processResult.data.bodyType); 
      if(processResult.data.color)params.set("color", processResult.data.color); 

      router.push(`/cars?${params.toString()}`);
    }
  },[processResult]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSearchImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    maxFiles: 1,
  });

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Enter the details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-20 py-4 sm:py-5 md:py-6 w-full h-14 sm:h-16 text-base sm:text-lg md:text-xl bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg"
          />
          <Camera
            size={35}
            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
            className="absolute right-25 cursor-pointer p-1.5 rounded-xl"
            style={{
              background: isImageSearchActive ? "black" : "",
              color: isImageSearchActive ? "white" : "",
            }}
          />
          <Button type="submit" className="absolute right-2 h-10 px-4 rounded-full cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition duration-200">
            Search
          </Button>
        </div>
      </form>

      {isImageSearchActive && (
        <div className=" mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer ">
          <form onSubmit={handleImageSearch}>
            {imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                <img src={imagePreview} alt="Car Preview" className="h-40 items-center object-contain mb-4" />
                <Button variant="outline" className="cursor-pointer"
                  onClick={() => {
                    setSearchImage(null);
                    setImagePreview("");
                    toast.info("Image removed");
                  }}
                >
                  Remove Image</Button>
              </div>
            ) : (
              <div {...getRootProps()} className="mt-4 ">
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
                <p className='text-gray-500 mb-2'>
                  {isDragActive && !isDragReject
                    ? "Drop the image here..."
                    : "Drag and drop a car image here, or click to select one"}
                </p>
                {isDragReject && (
                  <p className="text-red-500">Unsupported file type...</p>
                )}
                <p className="text-gray-500 mt-1">Supports: JPG, PNG (max 20MB)</p>
              </div>
            )}
            {imagePreview && (
              <Button
                type="submit"
                className="mt-4 w-full h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
                disabled={isUploading || isProcessing}>
                {isUploading ? "Uploading......":isProcessing?"Analyzing Image..." : "Search with this Image"}</Button>)}
          </form>

        </div>
      )}
    </div>
  );
};

export default HomeSearch;
