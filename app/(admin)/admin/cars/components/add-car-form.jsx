"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addCar, processCarImageWithAi } from "@/actions/cars";
import { useRouter } from "next/navigation";


const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = ["SUV", "Sedan", "Hatchback", "Convertible", "Coupe", "Wagon", "Pickup", "Sports Car", "Super Car", "Hyper Car "];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const AddCarForm = () => {
    const [activeTab, setActiveTab] = useState("ai");
    const [uploadImages, setUploadImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadAiImage, setUploadAiImage] = useState(null);
    const router=useRouter();

    const carFormSchema = z.object({
        make: z.string().min(1, "Make is required"),
        model: z.string().min(1, "Model is required"),
        year: z.string().refine(val => {
            const year = parseInt(val);
            return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
        }, "Valid year required"),
        color: z.string().min(1, "Color is required"),
        price: z.number().min(0, "Price must be a positive number"),
        mileage: z.number().min(0, "Mileage must be a positive number"),
        bodyType: z.enum(bodyTypes),
        fuelType: z.enum(fuelTypes),
        transmission: z.enum(transmissions),
        status: z.enum(carStatuses),
        seats: z.string().optional(),
        description: z.string().min(10, "Description is required"),
        featured: z.boolean().default(false),
    });

    const { register, setValue, getValues, formState: { errors }, handleSubmit, watch } = useForm({
        resolver: zodResolver(carFormSchema),
        defaultValues: {
            make: "",
            model: "",
            year: "",
            color: "",
            price: 0,
            mileage: 0,
            bodyType: "",
            fuelType: "",
            transmission: "",
            status: "AVAILABLE",
            seats: "",
            description: "",
            featured: false,
        },
    });

    const onAiDrop = (acceptedFiles) => {

        const file = acceptedFiles[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
            return;
        }
        setUploadAiImage(file);


        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            toast.success(`Image Successfuly Uploaded`);
        };
        reader.readAsDataURL(file);


    };

    const { getRootProps: getAiImageRootProps, getInputProps: getAiImageInputProps } = useDropzone({
        onDrop: onAiDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        maxFiles: 1,
        multiple: false,

    });

    const { loading: processImageLoading, fn: processImageFn, data: processImageResult, error: processImageError, } = useFetch(processCarImageWithAi);

    const processWithAi = async () => {
        if (!uploadAiImage) {
            toast.error("Please upload the image first");
            return;
        }
        await processImageFn(uploadAiImage)
    };
    useEffect(() => {
        if (processImageError) {
            toast.error(processImageError.message || "Failed to upload car");
        }

    }, [processImageError]);

    useEffect(() => {
        if (processImageResult?.success) {
            const carDetails= processImageResult.data;
            // Update form with AI results
            setValue("make", carDetails.make);
            setValue("model", carDetails.model);
            setValue("year", carDetails.year.toString());
            setValue("color", carDetails.color);
            setValue("bodyType", carDetails.bodyType);
            setValue("fuelType", carDetails.fuelType);
            setValue("price", carDetails.price);
            setValue("mileage", carDetails.mileage);
            setValue("transmission", carDetails.transmission);
            setValue("description", carDetails.description);

            const reader = new FileReader();
            reader.onload=(e)=>{
                setUploadImages((prev)=>[...prev,e.target.result]);
            };
            reader.readAsDataURL(uploadAiImage);

            toast.success("Successfully extracted car details", {
                description: `Detected ${carDetails.year} ${carDetails.make} ${
                  carDetails.model
                } with ${Math.round(carDetails.confidence * 100)}% confidence`,
              });

              setActiveTab("manual");
        }

    }, [processImageResult, uploadAiImage]);


    const { data: addCarResult, loading: addCarLoading, fn: addCarFn } = useFetch(addCar);
    useEffect(() => {
        if (addCarResult?.success) {
            toast.success("Car Added Succesfully");
            router.push("/admin/cars");
        }

    }, [addCarResult, addCarLoading]);

    const onSubmit = async (data) => {
        if (uploadImages.length === 0) {
            setImageError("Please Upload at least one Image");
            return;
        };
        const carData = {
            ...data,
            year: parseInt(data.year),
            price: parseFloat(data.price),
            mileage: parseInt(data.mileage),
            seats: data.seats ? parseInt(data.seats) : null,
        };
        await addCarFn({
            carData,
            image: uploadImages
        });

    }


    const onMultiImagesDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newImages = []
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImages.push(e.target.result);
                if (newImages.length === validFiles.length) {
                    setUploadImages((prev => [...prev, ...newImages]));
                    setImageError(" ");

                    toast.success(`Successfuly Uploaded ${validFiles.length} images`);

                }

                toast.success(`Successfuly Uploaded ${validFiles.length} images`);
            };
            reader.readAsDataURL(file);

        })
    };

    const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } = useDropzone({
        onDrop: onMultiImagesDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        multiple: true,
    });

    const removeImage = (index) => {
        setUploadImages((prev) => prev.filter((_, i) => i !== index));
    };


    return (
        <div>
            <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="ai">AI Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Car Details</CardTitle>
                            <CardDescription>Enter the details of the car to be added.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Car Data Entry Section START */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Make */}
                                    <div className="space-y-2 ">
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" {...register("make")} placeholder="e.g., Toyota" />
                                        {errors.make && <p className="text-sm text-red-500">{errors.make.message}</p>}
                                    </div>

                                    {/* Model */}
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" {...register("model")} placeholder="e.g., Corolla" />
                                        {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Input id="year" {...register("year")} placeholder="e.g., 2022" />
                                        {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
                                    </div>

                                    {/* Color */}
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <Input id="color" {...register("color")} placeholder="e.g., White" />
                                        {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" type="number" {...register("price", { valueAsNumber: true })} placeholder="e.g., 20000" />
                                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                                    </div>

                                    {/* Mileage */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mileage">Mileage</Label>
                                        <Input id="mileage" type="number" {...register("mileage", { valueAsNumber: true })} placeholder="e.g., 15000" />
                                        {errors.mileage && <p className="text-sm text-red-500">{errors.mileage.message}</p>}
                                    </div>

                                    {/* Body Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bodyType">Body Type</Label>
                                        <Select onValueChange={(value) => setValue("bodyType", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select body type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bodyTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.bodyType && <p className="text-sm text-red-500">{errors.bodyType.message}</p>}
                                    </div>

                                    {/* Fuel Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Fuel Type</Label>
                                        <Select onValueChange={(value) => setValue("fuelType", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select fuel type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fuelTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.fuelType && <p className="text-sm text-red-500">{errors.fuelType.message}</p>}
                                    </div>

                                    {/* Transmission */}
                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">Transmission</Label>
                                        <Select onValueChange={(value) => setValue("transmission", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select transmission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transmissions.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.transmission && <p className="text-sm text-red-500">{errors.transmission.message}</p>}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select onValueChange={(value) => setValue("status", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {carStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                                    </div>

                                    {/* Seats */}
                                    <div className="space-y-2">
                                        <Label htmlFor="seats">Seats</Label>
                                        <Input id="seats" {...register("seats")} placeholder="e.g., 5" />
                                    </div>

                                </div>
                                {/* Car Data Entry Section END */}

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" {...register("description")} placeholder="Car description..." className="min-h-32" />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                                </div>

                                {/* Featured */}
                                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <Checkbox
                                        id="featured"
                                        checked={watch("featured")}
                                        onCheckedChange={(checked) => {
                                            setValue("featured", checked);
                                        }}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="featured">Feature this car</Label>
                                        <p className="text-sm text-gray-500">
                                            Featured cars appear on the homepage
                                        </p>
                                    </div>
                                </div>


                                {/* Image Upload Section */}
                                <div>
                                    <Label htmlFor="images" className={imageError ? "text-red-500" : ""}>
                                        Images{" "}
                                        {imageError && <span className="text-red-500">*</span>}
                                    </Label>
                                    <div {...getMultiImageRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${imageError ? "border-red-500" : "border-gray-300 "}`}>
                                        <input {...getMultiImageInputProps()} />
                                        <div className="flex flex-col justify-center items-center">
                                            <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                            <p className='text-gray-600 text-sm'>
                                                Drag and Drop or click to upload Multiple Images
                                            </p>
                                            <p className="text-gray-500 xs mt-1"> (JPG, PNG , WEBP, max 5MB each) </p>
                                        </div>

                                    </div>
                                    {imageError && (
                                        <p className="text-xs text-red-500 mt-1">{imageError}</p>
                                    )}
                                </div>
                                {uploadImages.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">Uploaded Images ({uploadImages.length})</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {uploadImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={image}
                                                        alt={`Car image ${index + 1}`}
                                                        height={50}
                                                        width={50}
                                                        className="h-28 w-full object-cover rounded-md"
                                                        priority
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                <Button type="submit" className="w-full md:w-auto" disabled={addCarLoading}>{addCarLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Car.... </> : "Add Car"}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI-Powered Car Details Extraction</CardTitle>
                            <CardDescription>Upload an image of a car and let AI do its magic</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="border-2 border-dashed p-6 rounded-lg text-center">
                                    {imagePreview ? (<div className="flex flex-col items-center">
                                        <img src={imagePreview}
                                            alt="car preview"
                                            className="max-h-56 max-w-full object-contain mb-4"
                                        />
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setImagePreview(null);
                                                setUploadAiImage(null);
                                            }}>
                                                Remove
                                            </Button>

                                            <Button size="sm" onClick={processWithAi} disabled={processImageLoading}>
                                                {processImageLoading ? (<>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing.....
                                                </>
                                                ) : (
                                                    <>
                                                        <Camera className="mr-2 h-4 w-4" />
                                                        Extract Details
                                                    </>

                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    ) : (
                                        <div {...getAiImageRootProps()} className="hover:bg-gray-50 transition cursor-pointer ">
                                            <input {...getAiImageInputProps()} />
                                            <div className="flex flex-col items-center justify-center">
                                                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                                                <p className='text-gray-500 text-sm'>

                                                    "Drag and drop a car image here"
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">Supports: JPG, PNG, WebP (max 5MB)</p>

                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="font-medium mb-2">How it works</h3>
                                    <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                                        <li>Upload a clear image of the car</li>
                                        <li>Click "Extract Details" to analyze with Gemini AI</li>
                                        <li>Review the extracted information</li>
                                        <li>Fill in any missing details manually</li>
                                        <li>Add the car to your inventory</li>
                                    </ol>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-md">
                                    <h3 className="font-medium text-amber-800 mb-1">
                                        Tips for best results
                                    </h3>
                                    <ul className="space-y-1 text-sm text-amber-700">
                                        <li>• Use clear, well-lit images</li>
                                        <li>• Try to capture the entire vehicle</li>
                                        <li>• For difficult models, use multiple views</li>
                                        <li>• Always verify AI-extracted information</li>
                                    </ul>
                                </div>

                            </div>
                        </CardContent>

                    </Card>

                </TabsContent>

            </Tabs>
        </div >
    );
};

export default AddCarForm;
