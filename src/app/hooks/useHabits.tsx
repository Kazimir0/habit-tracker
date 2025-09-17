'use client'

import { useState, useEffect } from 'react'
import { Habit, HabitCompletion } from '../types/habit'
import { useNotifications } from '../../contexts/NotificationContext'

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { showSuccess, showError, showCelebration } = useNotifications()

    // Load habits from database when hook is used
    useEffect(() => {
        fetchHabits()
    }, [])

    const fetchHabits = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/habits')
            if (response.ok) {
                const data = await response.json()
                setHabits(data)
            } else {
                console.error('Failed to fetch habits')
            }
        } catch (error) {
            console.error('Error fetching habits:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0]
    }

    const addHabit = async (habitName: string, category: 'Health' | 'Work' | 'Personal' = 'Personal', difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium') => {
        if (habitName.trim()) {
            try {
                const response = await fetch('/api/habits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: habitName.trim(),
                        category,
                        difficulty
                    })
                })

                if (response.ok) {
                    const newHabit = await response.json()
                    setHabits([newHabit, ...habits])
                    showSuccess(`✨ "${habitName.trim()}" habit created successfully! Let's build this habit together!`)
                } else {
                    console.error('Failed to create habit')
                    showError('Failed to create habit. Please try again.')
                }
            } catch (error) {
                console.error('Error creating habit:', error)
                showError('Failed to create habit. Please check your connection and try again.')
            }
        }
    }

    const toggleHabitCompletion = async (habitId: string) => {
        const today = getTodayString()
        
        // Find the habit to get its name for notifications
        const habit = habits.find(h => h.id === habitId)
        const habitName = habit?.name || 'Habit'
        
        // Check if it's currently completed
        const isCurrentlyCompleted = habit?.completions.some(c => c.date === today) || false
        
        // Optimistic update - update UI immediately
        setHabits(prevHabits => 
            prevHabits.map(habit => {
                if (habit.id === habitId) {
                    const isCurrentlyCompleted = habit.completions.some(c => c.date === today)
                    
                    if (isCurrentlyCompleted) {
                        // Remove completion
                        return {
                            ...habit,
                            completions: habit.completions.filter(c => c.date !== today)
                        }
                    } else {
                        // Add completion
                        return {
                            ...habit,
                            completions: [
                                ...habit.completions,
                                {
                                    id: `temp-${Date.now()}`, // Temporary ID
                                    date: today,
                                    completedAt: new Date().toISOString()
                                }
                            ]
                        }
                    }
                }
                return habit
            })
        )

        // Show immediate feedback
        if (isCurrentlyCompleted) {
            showSuccess('Habit uncompleted', `${habitName} marked as incomplete`)
        } else {
            // Calculate streak for celebration
            const currentStreak = calculateStreak(habit!)
            if (currentStreak >= 7) {
                showCelebration('🔥 Amazing streak!', `${habitName} - ${currentStreak + 1} days in a row!`)
            } else if (currentStreak >= 3) {
                showSuccess('🎯 Great job!', `${habitName} completed! Keep the streak going!`)
            } else {
                showSuccess('✅ Habit completed!', `${habitName} - Well done!`)
            }
        }

        // Then sync with server in background
        try {
            const response = await fetch(`/api/habits/${habitId}`, {
                method: 'POST'
            })

            if (!response.ok) {
                // If server request fails, revert the optimistic update
                showError('Sync failed', 'Could not save to server. Please try again.')
                await fetchHabits() // Reload from server to get correct state
            }
        } catch (error) {
            console.error('Error toggling habit completion:', error)
            showError('Connection error', 'Could not connect to server. Please check your internet.')
            // Revert optimistic update on error
            await fetchHabits()
        }
    }

    const deleteHabit = async (habitId: string) => {
        try {
            const response = await fetch(`/api/habits/${habitId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setHabits(habits.filter(habit => habit.id !== habitId))
            } else {
                console.error('Failed to delete habit')
            }
        } catch (error) {
            console.error('Error deleting habit:', error)
        }
    }

    const isCompletedToday = (habit: Habit) => {
        const today = getTodayString()
        return habit.completions.some(completion => completion.date === today)
    }

    const calculateStreak = (habit: Habit) => {
        if (habit.completions.length === 0) return 0

        const sortedCompletions = [...habit.completions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        const today = getTodayString()
        let streak = 0
        let currentDate = new Date(today)

        const todayString = currentDate.toISOString().split('T')[0]
        const yesterdayString = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        if (!sortedCompletions.some(c => c.date === todayString) && 
            !sortedCompletions.some(c => c.date === yesterdayString)) {
            return 0
        }

        for (let i = 0; i < sortedCompletions.length; i++) {
            const dateString = currentDate.toISOString().split('T')[0]

            if (sortedCompletions.some(c => c.date === dateString)) {
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
            if (habit.completions.some(c => c.date === dateString)) {
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
            if (habit.completions.some(c => c.date === dateString)) {
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