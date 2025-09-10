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
    return (
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
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
                        onClick={() => onToggleCompletion(habit.id)}
                        className={`px-4 py-2 rounded-lg font-medium ${isCompletedToday
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