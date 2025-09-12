'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    actualTheme: 'light' | 'dark' // The actual applied theme (resolved from system)
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme)
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    // Get system theme preference
    const getSystemTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' // detect user system theme
        }
        return 'light'
    }

    // Apply theme to document
    const applyTheme = React.useCallback((newTheme: 'light' | 'dark', themeToStore: Theme) => {
        const root = document.documentElement

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Add new theme class with animation
        root.classList.add(newTheme)

        // Add transition class for smooth switching
        root.style.setProperty('--theme-transition', 'all 0.3s ease-in-out')

        // Store in localStorage for persistence
        localStorage.setItem('theme-preference', themeToStore) // The app remembers your choice

        setActualTheme(newTheme)
    }, [])

    // Resolve actual theme based on current setting
    const resolveTheme = React.useCallback((themeValue: Theme): 'light' | 'dark' => {
        if (themeValue === 'system') {
            return getSystemTheme() // Ask the OS
        }
        return themeValue
    }, [])

    // Set theme with all side effects
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme) // Update React state
        const resolved = resolveTheme(newTheme) // Figure out actual theme
        applyTheme(resolved, newTheme)   // Apply it!
    }

    // Toggle between light and dark (skipping system)
    const toggleTheme = () => {
        const newTheme = actualTheme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    // Initialize theme on mount
    useEffect(() => {
        // Get saved preference or use default
        const savedTheme = localStorage.getItem('theme-preference') as Theme || defaultTheme

        // Set initial theme
        setThemeState(savedTheme)
        const resolved = resolveTheme(savedTheme)
        applyTheme(resolved, savedTheme)

        setMounted(true)
    }, [defaultTheme, applyTheme, resolveTheme])

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted) return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            if (theme === 'system') {
                const newActualTheme = getSystemTheme()
                applyTheme(newActualTheme, 'system')
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted, applyTheme])

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>
    }

    const value: ThemeContextType = {
        theme,
        actualTheme,
        setTheme,
        toggleTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook to use theme
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

// Export types for external use
export type { Theme, ThemeContextType }