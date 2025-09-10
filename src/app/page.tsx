'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

interface Habit {
  id: string
  name: string
  createdAt: string
  completions: string[] // Array of dates when completed (e.g., ['2024-01-15', '2024-01-16'])
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null)
  const [habitNameToDelete, setHabitNameToDelete] = useState('')

  // Load habits from localStorage when component mounts
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
    return new Date().toISOString().split('T')[0] // Returns format: '2024-01-15'
  }

  const addHabit = () => {
    if (habitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName.trim(),
        createdAt: new Date().toLocaleDateString(),
        completions: []
      }
      setHabits([...habits, newHabit])
      setHabitName('')
      setIsAddingHabit(false)
    }
  }

  const toggleHabitCompletion = (habitId: string) => {
    const today = getTodayString()
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completions.includes(today)
        
        if (isCompletedToday) {
          // Remove today's completion
          return {
            ...habit,
            completions: habit.completions.filter(date => date !== today)
          }
        } else {
          // Add today's completion
          return {
            ...habit,
            completions: [...habit.completions, today]
          }
        }
      }
      return habit
    }))
  }

  const isCompletedToday = (habit: Habit) => {
    const today = getTodayString()
    return habit.completions.includes(today)
  }

  const calculateStreak = (habit: Habit) => {
  if (habit.completions.length === 0) return 0
  
  // Sort completions from newest to oldest
  const sortedCompletions = [...habit.completions].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  const today = getTodayString()
  let streak = 0
  let currentDate = new Date(today)
  
  // Check if habit was completed today or yesterday to start streak
  const todayString = currentDate.toISOString().split('T')[0]
  const yesterdayString = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  if (!sortedCompletions.includes(todayString) && !sortedCompletions.includes(yesterdayString)) {
    return 0 // No recent activity
  }
  
  // Count consecutive days working backwards
  for (let i = 0; i < sortedCompletions.length; i++) {
    const dateString = currentDate.toISOString().split('T')[0]
    
    if (sortedCompletions.includes(dateString)) {
      streak++
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // Go back one day
    } else {
      break // Streak is broken
    }
  }
  
  return streak
}

  const openDeleteConfirm = (habitId: string, habitName: string) => {
    setHabitToDelete(habitId)
    setHabitNameToDelete(habitName)
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setHabitToDelete(null)
    setHabitNameToDelete('')
  }

  const confirmDelete = () => {
    if (habitToDelete) {
      setHabits(habits.filter(habit => habit.id !== habitToDelete))
    }
    // Reset confirmation state
    setShowDeleteConfirm(false)
    setHabitToDelete(null)
    setHabitNameToDelete('')
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p>Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SignedOut>
        <div className="text-center py-20">
          <h2 className="text-4xl font-bold mb-4">Welcome to Habit Tracker</h2>
          <p className="text-lg text-gray-600 mb-8">
            Build better habits, track your progress, and achieve your goals.
          </p>
          <p className="text-gray-500">
            Please sign in to start tracking your habits.
          </p>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Your Habits</h2>
            {!isAddingHabit && (
              <button 
                onClick={() => setIsAddingHabit(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Habit
              </button>
            )}
          </div>

          {isAddingHabit && (
            <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Add New Habit</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter habit name"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                />
                <button
                  onClick={addHabit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingHabit(false)
                    setHabitName('')
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {habits.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">You do not have any habits yet.</p>
              {!isAddingHabit && (
                <button 
                  onClick={() => setIsAddingHabit(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Habit
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => {
                const completedToday = isCompletedToday(habit)
                const currentStreak = calculateStreak(habit)
                return (
                  <div key={habit.id} className="bg-white border border-gray-200 p-6 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                          {currentStreak > 0 && (
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              🔥 {currentStreak} day{currentStreak === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">Created: {habit.createdAt}</p>
                        <p className="text-gray-500 text-sm">
                          Total completions: {habit.completions.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            completedToday 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {completedToday ? '✓ Completed Today' : 'Mark Complete Today'}
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(habit.id, habit.name)}
                          className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SignedIn>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure about this?</h3>
                <p className="text-gray-600 mb-2">
                  You are about to delete the habit:
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  `{habitNameToDelete}`
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone and you will lose all progress data.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Yes, Delete It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}