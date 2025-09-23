'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
    useClerk
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const pathname = usePathname()
    const { signOut } = useClerk()

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Profile', href: '/profile' },
    ]

    const handleSignOut = () => {
        signOut({ redirectUrl: '/' })
    }

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="font-semibold text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">HabitTracker</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Only show when signed in */}
                    <SignedIn>
                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pathname === item.href
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </SignedIn>

                    {/* Right side - Profile and Sign Out */}
                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <div className="flex items-center space-x-3">
                                {/* Theme Toggle for signed out users */}
                                <ThemeToggle />
                                <SignInButton>
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center space-x-3">
                                {/* Theme Toggle for signed in users */}
                                <ThemeToggle />
                                
                                {/* Sign Out Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 transition-colors duration-300"
                                >
                                    Sign Out
                                </Button>

                                {/* Profile Picture */}
                                <div className="flex items-center">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8"
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </SignedIn>
                    </div>

                    {/* Mobile menu button - for future mobile navigation */}
                    <SignedIn>
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Hamburger icon */}
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    )
}
