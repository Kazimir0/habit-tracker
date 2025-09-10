'use client'

import { useState, useEffect } from 'react'
import { Habit } from '../types/habit'

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load habits from localStorage when hook is used
    useEffect(() => {
        const savedHabits = localStorage.getItem('habits')
        if (savedHabits) {
            const parsedHabits = JSON.parse(savedHabits)
            // Migrate old habits to new format
            const migratedHabits = parsedHabits.map((habit: Habit & { category?: string; difficulty?: string }) => ({
                ...habit,
                category: (habit.category as 'Health' | 'Work' | 'Personal') || 'Personal',
                difficulty: (habit.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
                completions: Array.isArray(habit.completions) ? habit.completions : []
            }))
            setHabits(migratedHabits)
        }
        setIsLoading(false)
    }, [])

    // Save habits to localStorage whenever habits change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('habits', JSON.stringify(habits))
        }
    }, [habits, isLoading])

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0]
    }

    const addHabit = (habitName: string, category: 'Health' | 'Work' | 'Personal' = 'Personal', difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium') => {
        if (habitName.trim()) {
            const newHabit: Habit = {
                id: Date.now().toString(),
                name: habitName.trim(),
                category,
                difficulty,
                createdAt: new Date().toLocaleDateString(),
                completions: []
            }
            setHabits([...habits, newHabit])
        }
    }

    const toggleHabitCompletion = (habitId: string) => {
        const today = getTodayString()

        setHabits(habits.map(habit => {
            if (habit.id === habitId) {
                const isCompletedToday = habit.completions.includes(today)

                if (isCompletedToday) {
                    return {
                        ...habit,
                        completions: habit.completions.filter(date => date !== today)
                    }
                } else {
                    return {
                        ...habit,
                        completions: [...habit.completions, today]
                    }
                }
            }
            return habit
        }))
    }

    const deleteHabit = (habitId: string) => {
        setHabits(habits.filter(habit => habit.id !== habitId))
    }

    const isCompletedToday = (habit: Habit) => {
        const today = getTodayString()
        return habit.completions.includes(today)
    }

    const calculateStreak = (habit: Habit) => {
        if (habit.completions.length === 0) return 0

        const sortedCompletions = [...habit.completions].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        const today = getTodayString()
        let streak = 0
        let currentDate = new Date(today)

        const todayString = currentDate.toISOString().split('T')[0]
        const yesterdayString = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        if (!sortedCompletions.includes(todayString) && !sortedCompletions.includes(yesterdayString)) {
            return 0
        }

        for (let i = 0; i < sortedCompletions.length; i++) {
            const dateString = currentDate.toISOString().split('T')[0]

            if (sortedCompletions.includes(dateString)) {
                streak++
                currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
            } else {
                break
            }
        }

        return streak
    }

    const getWeeklyProgress = (habit: Habit) => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        
        let weekCompletions = 0
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + i)
            const dateString = date.toISOString().split('T')[0]
            if (habit.completions.includes(dateString)) {
                weekCompletions++
            }
        }
        return weekCompletions
    }

    const getMonthlyProgress = (habit: Habit) => {
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        let monthCompletions = 0
        for (let d = startOfMonth; d <= endOfMonth; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0]
            if (habit.completions.includes(dateString)) {
                monthCompletions++
            }
        }
        return monthCompletions
    }

    const exportHabitsData = () => {
        const dataStr = JSON.stringify(habits, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        
        const exportFileDefaultName = `habits_export_${new Date().toISOString().split('T')[0]}.json`
        
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    return {
        habits,
        isLoading,
        addHabit,
        deleteHabit,
        toggleHabitCompletion,
        isCompletedToday,
        calculateStreak,
        getWeeklyProgress,
        getMonthlyProgress,
        exportHabitsData
    }
}