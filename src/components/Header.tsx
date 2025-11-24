"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b bg-[#1A3D63] text-white dark:bg-white dark:text-[#1A3D63]">
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            TheStoryJar
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`hover:text-gray-600 ${isActive("/") ? "font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`hover:text-gray-600 ${isActive("/explore") ? "font-semibold" : ""}`}
            >
              Explore
            </Link>

            {status === "authenticated" ? (
              <>
                <Link
                  href="/write"
                  className={`hover:text-gray-600 ${isActive("/write") ? "font-semibold" : ""}`}
                >
                  Write
                </Link>
                <Link
                  href="/profile"
                  className={`hover:text-gray-600 ${isActive("/profile") ? "font-semibold" : ""}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hover:text-gray-600 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-600">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#1A3D63] dark:bg-white text-white dark:text-[#1A3D63] px-4 py-2 rounded-full hover:opacity-80"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/" className={`hover:text-gray-300 ${isActive("/") ? "font-semibold" : ""}`} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/explore" className={`hover:text-gray-300 ${isActive("/explore") ? "font-semibold" : ""}`} onClick={() => setIsMenuOpen(false)}>
                Explore
              </Link>
              {status === "authenticated" ? (
                <>
                  <Link href="/write" className={`hover:text-gray-300 ${isActive("/write") ? "font-semibold" : ""}`} onClick={() => setIsMenuOpen(false)}>
                    Write
                  </Link>
                  <Link href="/profile" className={`hover:text-gray-300 ${isActive("/profile") ? "font-semibold" : ""}`} onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-left hover:text-gray-300">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
