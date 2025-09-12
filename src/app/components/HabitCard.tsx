'use client'

import { Habit } from '../types/habit'

interface HabitCardProps {
    habit: Habit
    isCompletedToday: boolean
    currentStreak: number
    onToggleCompletion: (habitId: string) => void
    onDelete: (habitId: string, habitName: string) => void
}

export default function HabitCard({
    habit,
    isCompletedToday,
    currentStreak,
    onToggleCompletion,
    onDelete
}: HabitCardProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Health': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
            case 'Work': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            case 'Personal': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
            case 'Medium': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
            case 'Hard': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
            default: return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700'
        }
    }

    const getDifficultyStars = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return '⭐'
            case 'Medium': return '⭐⭐'
            case 'Hard': return '⭐⭐⭐'
            default: return '⭐'
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Health': return '🏃‍♂️'
            case 'Work': return '💼'
            case 'Personal': return '🎯'
            default: return '📝'
        }
    }
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm dark:shadow-gray-900/20 transition-colors duration-300">
            <div className="space-y-4">
                {/* Header with title and badges */}
                <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 min-w-0 flex-1">{habit.name}</h3>
                    <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(habit.category)} flex items-center gap-1 transition-colors duration-300`}>
                            {getCategoryIcon(habit.category)} {habit.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(habit.difficulty)} flex items-center gap-1 transition-colors duration-300`}>
                            {getDifficultyStars(habit.difficulty)} {habit.difficulty}
                        </span>
                    </div>
                </div>
                
                {/* Streak info */}
                {currentStreak > 0 && (
                    <div className="flex items-center">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-orange-200 dark:border-orange-800 transition-colors duration-300">
                            🔥 {currentStreak} day{currentStreak === 1 ? '' : 's'}
                        </span>
                    </div>
                )}
                
                {/* Metadata */}
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Created: {habit.createdAt}</p>
                    <p>Total completions: {habit.completions.length}</p>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => onToggleCompletion(habit.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-1 transition-all duration-300 ${isCompletedToday
                                ? 'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800'
                            }`}
                    >
                        {isCompletedToday ? '✓ Completed Today' : 'Mark Complete Today'}
                    </button>
                    <button
                        onClick={() => onDelete(habit.id, habit.name)}
                        className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium whitespace-nowrap flex-shrink-0 border border-red-200 dark:border-red-800 transition-all duration-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}