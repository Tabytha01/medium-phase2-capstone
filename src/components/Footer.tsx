import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12 bg-[#1A3D63] text-white dark:bg-white dark:text-[#1A3D63]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-[#BDC4D4]">Medium Clone</h3>
            <p className="text-sm text-[#D1CFC9]">
              A publishing platform for sharing ideas and stories.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#BDC4D4]">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="hover:underline">Explore</Link></li>
              <li><Link href="/write" className="hover:underline">Write</Link></li>
              <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#BDC4D4]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#BDC4D4]">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-white dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Medium Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
