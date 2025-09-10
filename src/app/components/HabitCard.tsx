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
            case 'Health': return 'bg-green-100 text-green-800 border-green-200'
            case 'Work': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'Personal': return 'bg-purple-100 text-purple-800 border-purple-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-50 text-green-700 border-green-200'
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'Hard': return 'bg-red-50 text-red-700 border-red-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
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
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(habit.category)} flex items-center gap-1`}>
                                {getCategoryIcon(habit.category)} {habit.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(habit.difficulty)} flex items-center gap-1`}>
                                {getDifficultyStars(habit.difficulty)} {habit.difficulty}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                        {currentStreak > 0 && (
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                🔥 {currentStreak} day{currentStreak === 1 ? '' : 's'}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Created: {habit.createdAt}</p>
                        <p>Total completions: {habit.completions.length}</p>
                    </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onToggleCompletion(habit.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${isCompletedToday
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                    >
                        {isCompletedToday ? '✓ Completed Today' : 'Mark Complete Today'}
                    </button>
                    <button
                        onClick={() => onDelete(habit.id, habit.name)}
                        className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}