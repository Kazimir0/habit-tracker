'use client'

import { Habit } from '../types/habit'

interface HabitAnalyticsProps {
    habits: Habit[]
    isCompletedToday: (habit: Habit) => boolean
    calculateStreak: (habit: Habit) => number
    getWeeklyProgress: (habit: Habit) => number
    getMonthlyProgress: (habit: Habit) => number
}

export default function HabitAnalytics({
    habits,
    isCompletedToday,
    calculateStreak,
    getWeeklyProgress,
    getMonthlyProgress
}: HabitAnalyticsProps) {
    if (habits.length === 0) return null

    // Calculate overall stats
    const totalHabits = habits.length
    const completedToday = habits.filter(habit => isCompletedToday(habit)).length
    const activeStreaks = habits.filter(habit => calculateStreak(habit) > 0).length
    const totalWeeklyCompletions = habits.reduce((total, habit) => total + getWeeklyProgress(habit), 0)
    const totalMonthlyCompletions = habits.reduce((total, habit) => total + getMonthlyProgress(habit), 0)
    const longestStreak = Math.max(...habits.map(habit => calculateStreak(habit)), 0)

    // Calculate completion rates
    const todayCompletionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
    const weeklyGoal = totalHabits * 7 // Assuming daily habits
    const weeklyCompletionRate = weeklyGoal > 0 ? Math.round((totalWeeklyCompletions / weeklyGoal) * 100) : 0

    return (
        <div className="space-y-6">
            {/* Enhanced Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Habits */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-800 text-sm">Total Habits</h3>
                            <p className="text-2xl font-bold text-blue-600">{totalHabits}</p>
                        </div>
                        <div className="text-2xl">📋</div>
                    </div>
                </div>

                {/* Today's Progress */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-green-800 text-sm">Today</h3>
                            <p className="text-2xl font-bold text-green-600">{completedToday}/{totalHabits}</p>
                            <p className="text-xs text-green-600">{todayCompletionRate}% complete</p>
                        </div>
                        <div className="text-2xl">✅</div>
                    </div>
                </div>

                {/* Active Streaks */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-orange-800 text-sm">Active Streaks</h3>
                            <p className="text-2xl font-bold text-orange-600">{activeStreaks}</p>
                            <p className="text-xs text-orange-600">Longest: {longestStreak} days</p>
                        </div>
                        <div className="text-2xl">🔥</div>
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-purple-800 text-sm">This Week</h3>
                            <p className="text-2xl font-bold text-purple-600">{totalWeeklyCompletions}</p>
                            <p className="text-xs text-purple-600">{weeklyCompletionRate}% of goal</p>
                        </div>
                        <div className="text-2xl">📈</div>
                    </div>
                </div>

                {/* Monthly Progress */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-indigo-800 text-sm">This Month</h3>
                            <p className="text-2xl font-bold text-indigo-600">{totalMonthlyCompletions}</p>
                            <p className="text-xs text-indigo-600">Total completions</p>
                        </div>
                        <div className="text-2xl">📅</div>
                    </div>
                </div>
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Today's Progress Bar */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Today&apos;s Progress</h3>
                        <span className="text-sm text-gray-600">{completedToday}/{totalHabits}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${todayCompletionRate}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{todayCompletionRate}% complete</p>
                </div>

                {/* Weekly Progress Bar */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Weekly Progress</h3>
                        <span className="text-sm text-gray-600">{totalWeeklyCompletions}/{weeklyGoal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(weeklyCompletionRate, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{weeklyCompletionRate}% of weekly goal</p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                    {['Health', 'Work', 'Personal'].map(category => {
                        const categoryHabits = habits.filter(habit => habit.category === category)
                        const categoryCompleted = categoryHabits.filter(habit => isCompletedToday(habit)).length
                        const categoryRate = categoryHabits.length > 0 ? Math.round((categoryCompleted / categoryHabits.length) * 100) : 0

                        const getColor = (cat: string) => {
                            switch (cat) {
                                case 'Health': return 'text-green-600 bg-green-100'
                                case 'Work': return 'text-blue-600 bg-blue-100'
                                case 'Personal': return 'text-purple-600 bg-purple-100'
                                default: return 'text-gray-600 bg-gray-100'
                            }
                        }

                        const getIcon = (cat: string) => {
                            switch (cat) {
                                case 'Health': return '🏃‍♂️'
                                case 'Work': return '💼'
                                case 'Personal': return '🎯'
                                default: return '📝'
                            }
                        }

                        return (
                            <div key={category} className={`p-3 rounded-lg ${getColor(category)}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span>{getIcon(category)}</span>
                                    <span className="font-medium text-sm">{category}</span>
                                </div>
                                <p className="text-lg font-bold">{categoryCompleted}/{categoryHabits.length}</p>
                                <p className="text-xs opacity-80">{categoryRate}% today</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
