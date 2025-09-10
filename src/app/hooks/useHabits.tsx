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
            setHabits(JSON.parse(savedHabits))
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

    const addHabit = (habitName: string) => {
        if (habitName.trim()) {
            const newHabit: Habit = {
                id: Date.now().toString(),
                name: habitName.trim(),
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

    return {
        habits,
        isLoading,
        addHabit,
        deleteHabit,
        toggleHabitCompletion,
        isCompletedToday,
        calculateStreak
    }
}