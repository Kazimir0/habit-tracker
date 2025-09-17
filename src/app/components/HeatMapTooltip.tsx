'use client'

import { Habit } from '../types/habit'

interface HeatMapTooltipProps {
    date: string
    completions: number
    habits: Habit[]
    displayDate: Date
}

export default function HeatMapTooltip({ date, completions, habits, displayDate }: HeatMapTooltipProps) {
    // Find which specific habits were completed on this date
    const completedHabitsOnDate = habits.filter(habit =>
        habit.completions?.some(completion => completion.date === date)
    )

    // Get motivational message based on completion count
    const getMotivationalMessage = (count: number) => {
        if (count === 0) return "🎯 No habits completed"
        if (count === 1) return "✨ Good start!"
        if (count === 2) return "🔥 Great momentum!"
        if (count >= 3) return "🚀 Crushing it!"
        return "💪 Keep going!"
    }

    // Format date nicely
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border max-w-xs">
            {/* Date header */}
            <div className="text-sm font-medium text-gray-800 mb-2">
                📅 {formatDate(displayDate)}
            </div>

            {/* Completion summary */}
            <div className="text-lg font-semibold text-blue-600 mb-3">
                {getMotivationalMessage(completions)}
            </div>

            {/* List of completed habits */}
            {completedHabitsOnDate.length > 0 && (
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Completed Habits:
                    </div>
                    {completedHabitsOnDate.map((habit) => (
                        <div key={habit.id} className="flex items-center text-sm text-gray-700">
                            <span className="text-green-500 mr-2">✅</span>
                            {habit.name}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {completions === 0 && (
                <div className="text-sm text-gray-500 italic">
                    Take a step towards your goals today!
                </div>
            )}
        </div>
    )
}