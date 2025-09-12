'use client'

import { Habit } from '../types/habit'
import { useState } from 'react'
import HeatMapTooltip from './HeatMapTooltip'
interface HeatMapCalendarProps {
    habits: Habit[]
}

export default function HeatMapCalendar({ habits }: HeatMapCalendarProps) {
    // Generate the last 12 weeks (84 days) for the heat map
    const generateCalendarData = () => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 83) // 12 weeks back

        const days = []
        const currentDate = new Date(startDate)

        while (currentDate <= today) {
            const dateString = currentDate.toISOString().split('T')[0]

            // Count completions for this date across all habits
            const completionsCount = habits.reduce((count, habit) => {
                return count + (habit.completions?.filter(completion =>
                    completion.startsWith(dateString)
                ).length || 0)
            }, 0)

            days.push({
                date: dateString,
                completions: completionsCount,
                displayDate: new Date(currentDate)
            })

            currentDate.setDate(currentDate.getDate() + 1)
        }

        return days
    }

    const calendarData = generateCalendarData()
    // hoveredDay stores info about the currently hovered day | null when no hover -> no tooltip present
    const [hoveredDay, setHoveredDay] = useState<{
        date: string
        completions: number
        displayDate: Date
        x: number
        y: number
    } | null>(null)

    // Get color intensity based on completions
    const getIntensityColor = (completions: number) => {
        if (completions === 0) return 'bg-gray-200 border border-gray-300'
        if (completions === 1) return 'bg-green-300 border border-green-400'
        if (completions === 2) return 'bg-green-500 border border-green-600'
        if (completions >= 3) return 'bg-green-700 border border-green-800'
        return 'bg-gray-200 border border-gray-300'
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Activity in the last 12 weeks</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {/* Github style */}
                    <span>Less</span>
                    <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div>
                        <div className="w-3 h-3 bg-green-300 border border-green-400 rounded"></div>
                        <div className="w-3 h-3 bg-green-500 border border-green-600 rounded"></div>
                        <div className="w-3 h-3 bg-green-700 border border-green-800 rounded"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-12 gap-1 text-xs relative">
                {calendarData.map((day) => (
                    <div
                        key={day.date}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(day.completions)}
                hover:ring-2 hover:ring-gray-400 cursor-pointer transition-all duration-200`}
                    // onMouseEnter react event when moouse enter the square
                    onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect() // get the exact position of the square on screen
                            setHoveredDay({
                                date: day.date,
                                completions: day.completions,
                                displayDate: day.displayDate,
                                x: rect.left + rect.width / 2, // Center horizontally
                                y: rect.top - 10 // Position above square
                            })
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                    />
                ))}

                {/* Custom Tooltip */}
                {hoveredDay && (
                    <div
                        className="fixed z-50 pointer-events-none"
                        style={{
                            left: hoveredDay.x - 150, // Center the tooltip
                            top: hoveredDay.y - 120,  // Position above the square
                        }}
                    >
                        <HeatMapTooltip
                            date={hoveredDay.date}
                            completions={hoveredDay.completions}
                            habits={habits}
                            displayDate={hoveredDay.displayDate}
                        />
                    </div>
                )}
            </div>

            {/* Month labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>3 months ago</span>
                <span>2 months ago</span>
                <span>1 month ago</span>
                <span>Today</span>
            </div>
        </div>
    )
}