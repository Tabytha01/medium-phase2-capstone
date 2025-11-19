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
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Medium Clone
          </Link>

          <div className="flex items-center gap-6">
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
                  className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:opacity-80"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
