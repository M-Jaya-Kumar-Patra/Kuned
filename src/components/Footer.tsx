import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white backdrop-blur-xl border-t border-white/40">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Logo + About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/images/logo_light.png"
                alt="Kuned logo"
                className=" h-12 object-contain"
              />
            </div>

            <p className="text-sm text-gray-500">
  Buy, sell & discover great deals near you.
  A fast and reliable marketplace for everyone.
</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-indigo-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-indigo-500 transition">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/post" className="hover:text-indigo-500 transition">
                  Post Listing
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-indigo-500 transition">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Categories
            </h3>

            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-indigo-500 transition cursor-pointer">
                Electronics
              </li>
              <li className="hover:text-indigo-500 transition cursor-pointer">
                Furniture
              </li>
              <li className="hover:text-indigo-500 transition cursor-pointer">
                Books
              </li>
              <li className="hover:text-indigo-500 transition cursor-pointer">
                Fashion
              </li>
            </ul>
          </div>

          

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Connect
            </h3>

            {/* Social Icons */}
            <div className="flex gap-4 mb-3">

              <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer transition" />

              <Instagram className="w-5 h-5 text-gray-500 hover:text-pink-500 cursor-pointer transition" />

              <Twitter className="w-5 h-5 text-gray-500 hover:text-sky-500 cursor-pointer transition" />

            </div>

            {/* Email */}
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              kunedhq@gmail.com
            </p>
          </div>

        </div>

      </div>

      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
  🚧 This platform is currently in beta.{" "}
  <Link
    href="/feedback"
    className="text-indigo-600 font-medium hover:underline"
  >
    Give Feedback
  </Link>
</div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        © {new Date().getFullYear()} Kuned. All rights reserved.
      </div>

    </footer>
  );
}