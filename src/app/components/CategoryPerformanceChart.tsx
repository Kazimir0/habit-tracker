'use client'

import { Habit } from '../types/habit'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CategoryPerformanceChartProps {
    habits: Habit[]
}

export default function CategoryPerformanceChart({ habits }: CategoryPerformanceChartProps) {
    const calculateCategoryPerformance = () => {

        // Create an object to hold habits grouped by category
        const categoryGroups: { [key: string]: Habit[] } = {}


        // Group habits by their category
        habits.forEach(habit => {
            const category = habit.category || 'Uncategorized' // Get the category, default to 'Uncategorized' if missing
            if (!categoryGroups[category]) {
                categoryGroups[category] = [] // Initialize array if category not yet present
            }
            categoryGroups[category].push(habit) // Add habit to category's array
        })

        // Calculate performance for each category
        const categoryPerformance = Object.keys(categoryGroups).map(category => {
            const categoryHabits = categoryGroups[category]
            const totalHabits = categoryHabits.length // Total habits in this category

            // Calculate total possible completions (last 30 days)
            const daysToCheck = 30
            const totalPossibleCompletions = totalHabits * daysToCheck // 3 habits * 30 days = 90 possible completions

            // Count actual completions in the last 30 days
            const actualCompletions = categoryHabits.reduce((total, habit) => { // Loop through each habit in the category
                const recentCompletions = habit.completions?.filter(completion => {
                    const completionDate = new Date(completion.date)
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - daysToCheck)
                    return completionDate >= thirtyDaysAgo
                }).length || 0
                return total + recentCompletions
            }, 0)

            // Calculate completion rate as a percentage
            // Calculates percentage = (Actual ÷ Possible) × 100
            const completionRate = totalPossibleCompletions > 0
                ? Math.round((actualCompletions / totalPossibleCompletions) * 100)
                : 0

            return {
                category,
                completionRate,
                totalHabits,
                actualCompletions,
                totalPossibleCompletions
            }
        })
        return categoryPerformance
    }


    const chartData = calculateCategoryPerformance()

    return (
        <div className="space-y-4">
            {/* Bar Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="category"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                                            <p className="font-medium">{label}</p>
                                            <p className="text-blue-600">
                                                Completion Rate: {data.completionRate}%
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {data.actualCompletions} of {data.totalPossibleCompletions} possible
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {data.totalHabits} habit{data.totalHabits !== 1 ? 's' : ''} in category
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="completionRate"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            className="hover:opacity-80 transition-opacity"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {chartData.map((category) => (
                    <div key={category.category} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm">{category.category}</h4>
                        <p className="text-2xl font-bold text-blue-600">{category.completionRate}%</p>
                        <p className="text-xs text-gray-600">
                            {category.actualCompletions}/{category.totalPossibleCompletions} completions
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}