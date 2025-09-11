'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import HabitForm from './components/HabitForm'
import HabitCard from './components/HabitCard'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import HabitAnalytics from './components/HabitAnalytics'

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
    getMonthlyProgress,
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
            <div className="flex gap-3">
              {habits.length > 0 && (
                <button
                  onClick={exportHabitsData}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  📤 Export Data
                </button>
              )}
              {!isAddingHabit && (
                <button
                  onClick={() => setIsAddingHabit(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Habit
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Analytics */}
          {habits.length > 0 && (
            <HabitAnalytics
              habits={habits}
              isCompletedToday={isCompletedToday}
              calculateStreak={calculateStreak}
              getWeeklyProgress={getWeeklyProgress}
              getMonthlyProgress={getMonthlyProgress}
            />
          )}

          {isAddingHabit && (
            <HabitForm
              onAddHabit={handleAddHabit}
              onCancel={() => setIsAddingHabit(false)}
            />
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