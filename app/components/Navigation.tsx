"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-gradient-to-r from-[#00913f] to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            
            <img
              src="/logo.png" // → ganti dengan nama file logo Anda
              alt="Logo PR SDI Khoiru Ummah Malang"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold">
              PR SDI Khoiru Ummah Malang
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg hover:bg-blue-500 transition flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    session.user.role === "admin"
                      ? "/admin/dashboard"
                      : "/teacher/dashboard"
                  }
                  className="px-4 py-2 rounded-lg hover:bg-blue-500 transition flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <span className="text-blue-100">Halo, {session.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-500">
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!session ? (
              <>
                <Link
                  href="/"
                  className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                  onClick={() => setMobileMenuOpen(false)}>
                  Beranda
                </Link>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-blue-100">
                  Halo, {session.user.name}
                </div>
                <Link
                  href={
                    session.user.role === "admin"
                      ? "/admin/dashboard"
                      : "/teacher/dashboard"
                  }
                  className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                  onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
