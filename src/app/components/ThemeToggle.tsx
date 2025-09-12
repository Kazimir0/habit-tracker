'use client'

import { useTheme } from '../../contexts/ThemeContext'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { actualTheme, toggleTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative overflow-hidden
        w-10 h-10 rounded-lg
        bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700
        border border-gray-200 dark:border-gray-600
        shadow-sm hover:shadow-md dark:shadow-gray-900/20
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        group
    `}
            aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
        >
            {/* Background gradient that changes on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-100/50 dark:to-gray-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon container with animation */}
            <div className="relative flex items-center justify-center w-full h-full">
                {/* Sun Icon */}
                <svg
                    className={`
            absolute w-5 h-5 text-amber-500 transition-all duration-500 ease-in-out
            ${actualTheme === 'light'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 rotate-180 scale-75'
                        }
          `}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                    />
                </svg>

                {/* Moon Icon */}
                <svg
                    className={`
            absolute w-5 h-5 text-slate-200 transition-all duration-500 ease-in-out
            ${actualTheme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-180 scale-75'
                        }
          `}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                    />
                </svg>
            </div>

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-30 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 transition-opacity duration-150" />
        </button>
    )
}