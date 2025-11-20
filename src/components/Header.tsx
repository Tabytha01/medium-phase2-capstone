"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

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
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/write" className="text-sm px-3 py-1 bg-white/20 rounded">
              Write
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
