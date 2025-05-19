import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 animate-bounce">
        404
      </h1>
      <h2 className="text-4xl font-bold mb-4 transition duration-300 hover:scale-105">
        Page Not Found
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-xl transition duration-300 hover:text-gray-800">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="text-lg px-6 py-3 transition-transform duration-300 hover:scale-105 hover:bg-primary/90 cursor-pointer">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
