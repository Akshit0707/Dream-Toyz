 // Conversion helpers
const convertPriceToINR = (priceInUSD) => priceInUSD * 83;

const formatMileage = (mileage) => {
  if (typeof mileage === "number") {
    return `${mileage} km`;
  }
  if (typeof mileage === "string") {
    return mileage.replace(/kilometers?/i, "").trim() + " km";
  }
  return mileage;
};

// Price formatting helper (for INR or USD)
const displayPrice = (priceInUSD, isInINR = false) => {
  const price = isInINR ? convertPriceToINR(priceInUSD) : priceInUSD;
  return `₹${price.toLocaleString()}`; // format as INR and include commas
};

// Featured cars
export const featuredCars = [
  {
    id: 1,
    make: "Hyundai",
    model: "Elantra N Line",
    year: 2023,
    price: 50000, // Store as a number
    images: ["/1.png"],
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "Sedan",
    mileage: 15000,
    color: "White",
    wishlisted: false,
  },
  {
    id: 2,
    make: "Range Rover",
    model: "Voque",
    year: 2023,
    price: 400000, // Store as a number
    images: ["/2.webp"],
    transmission: "Manual",
    fuelType: "Petrol",
    bodyType: "Suv",
    mileage: 12000,
    color: "Shampange",
    wishlisted: true,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 30000, // Store as a number
    images: ["/3.jpg"],
    transmission: "Automatic",
    fuelType: "Electric",
    bodyType: "Sedan",
    mileage: 8000,
    color: "Red",
    wishlisted: false,
  },
  {
    id: 4,
    make: "BMW",
    model: "530I",
    year: 2023,
    price: 95000, // Store as a number
    images: ["/4.jpg.avif"],
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "Sedan",
    mileage: 3000,
    color: "Blue",
    wishlisted: true,
  },
];

// Car brands
export const carMakes = [
  { id: 1, name: "Hyundai", image: "/make/hyundai.webp" },
  { id: 2, name: "Honda", image: "/make/honda.webp" },
  { id: 3, name: "BMW", image: "/make/bmw.webp" },
  { id: 4, name: "Tata", image: "/make/tata.webp" },
  { id: 5, name: "Mahindra", image: "/make/mahindra.webp" },
  { id: 6, name: "Ford", image: "/make/ford.webp" },
];

// Body types
export const bodyTypes = [
  { id: 1, name: "SUV", image: "/body/suv.webp" },
  { id: 2, name: "Sedan", image: "/body/sedan.webp" },
  { id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
  { id: 4, name: "Convertible", image: "/body/convertible.webp" },
];

// FAQs
export const faqItems = [
  {
    question: "How does the test drive booking work?",
    answer:
      "Find a car you're interested in, click the 'Test Drive' button, and select an available time slot. Our system will confirm your booking and provide all necessary details.",
  },
  {
    question: "Can I search for cars using an image?",
    answer:
      "Yes! Our AI-powered image search lets you upload a photo of a car you like, and we'll find similar models in our inventory.",
  },
  {
    question: "Are all cars certified and verified?",
    answer:
      "All cars listed on our platform undergo a strict verification process. We collaborate with trusted dealerships and verified private sellers.",
  },
  {
    question: "What happens after I book a test drive?",
    answer:
      "After booking, you'll receive a confirmation email with all the details. Our team will also contact you to confirm and assist with any questions.",
  },
];

// Example usage for displaying prices in INR
featuredCars.forEach(car => {
  console.log(displayPrice(car.price)); // Display the price in INR
});
