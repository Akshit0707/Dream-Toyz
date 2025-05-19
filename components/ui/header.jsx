import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarCheck, CarFront, Layout } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import CheckUser from '@/lib/checkUser';



const Header = async ({ isAdminPage = false }) => {
  const user = await CheckUser();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md h-18 sm:h-20 md:h-24">
    <nav className="mx-auto px-4 sm:px-8 md:px-18 lg:px-24 flex items-center justify-between h-full">
      <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center">
        <Image
          src="/logo-final.png"
          alt="Logo"
          width={240}
          height={30}
          className="object-contain sm:w-[180px] md:w-[240px] lg:w-[300px]"
        />
   

          {isAdminPage && (
            <span className="ml-2 text-sm font-light">admin</span>
          )}
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              <Link href="/saved-cars">
                <Button className="cursor-pointer hover:opacity-90 transition">
                  <CarFront size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>

              {!isAdmin ? (
                <Link href="/reservations">
                  <Button variant="outline" className="cursor-pointer hover:opacity-90 transition">
                    <CalendarCheck size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline" className="cursor-pointer hover:opacity-90 transition">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-14 h-10",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline" className="cursor-pointer hover:opacity-90 transition">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
