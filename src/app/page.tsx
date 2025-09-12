'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import HabitForm from './components/HabitForm'
import HabitCard from './components/HabitCard'
import DeleteConfirmModal from './components/DeleteConfirmModal'

export default function Home() {
  const {
    habits,
    isLoading,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isCompletedToday,
    calculateStreak,
    getWeeklyProgress,
    exportHabitsData
  } = useHabits()

  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null)
  const [habitNameToDelete, setHabitNameToDelete] = useState('')

  const handleAddHabit = (habitName: string, category: 'Health' | 'Work' | 'Personal', difficulty: 'Easy' | 'Medium' | 'Hard') => {
    addHabit(habitName, category, difficulty)
    setIsAddingHabit(false)
  }

  const handleDeleteClick = (habitId: string, habitName: string) => {
    setHabitToDelete(habitId)
    setHabitNameToDelete(habitName)
    setShowDeleteConfirm(true)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setHabitToDelete(null)
    setHabitNameToDelete('')
  }

  const handleDeleteConfirm = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete)
    }
    setShowDeleteConfirm(false)
    setHabitToDelete(null)
    setHabitNameToDelete('')
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SignedOut>
        <div className="text-center py-20">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Habit Tracker</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Build better habits, track your progress, and achieve your goals.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Please sign in to start tracking your habits.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Habits</h2>
            <div className="flex gap-3">
              {habits.length > 0 && (
                <button
                  onClick={exportHabitsData}
                  className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
                >
                  📤 Export Data
                </button>
              )}
              {!isAddingHabit && (
                <button
                  onClick={() => setIsAddingHabit(true)}
                  className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                >
                  Add New Habit
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Row */}
          {habits.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-300">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{habits.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Habits</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 transition-colors duration-300">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {habits.filter(habit => isCompletedToday(habit)).length}/{habits.length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Today Complete</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 transition-colors duration-300">
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {Math.max(...habits.map(habit => calculateStreak(habit)))}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Best Streak</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors duration-300">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {habits.length > 0 ? Math.round((habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / (habits.length * 7)) * 100) : 0}%
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">This Week</div>
              </div>
            </div>
          )}

          {/* Add Habit Form */}
          {isAddingHabit && (
            <div className="mb-8">
              <HabitForm
                onAddHabit={handleAddHabit}
                onCancel={() => setIsAddingHabit(false)}
              />
            </div>
          )}

          {/* Main Dashboard Layout */}
          {habits.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center border dark:border-gray-700 transition-colors duration-300">
              <p className="text-gray-600 dark:text-gray-400 mb-4">You do not have any habits yet.</p>
              {!isAddingHabit && (
                <button
                  onClick={() => setIsAddingHabit(true)}
                  className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                >
                  Add Your First Habit
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Today's Habits */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Today&apos;s Habits</h3>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={isCompletedToday(habit)}
                      currentStreak={calculateStreak(habit)}
                      onToggleCompletion={toggleHabitCompletion}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar - Progress Overview */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-4 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Progress Overview</h3>
                  
                  {/* Today's Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                      <span>Today&apos;s Progress</span>
                      <span>{habits.filter(habit => isCompletedToday(habit)).length}/{habits.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(habits.filter(habit => isCompletedToday(habit)).length / habits.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                      <span>Weekly Progress</span>
                      <span>{habits.length > 0 ? Math.round((habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / (habits.length * 7)) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${habits.length > 0 ? (habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0) / (habits.length * 7)) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        habitName={habitNameToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}