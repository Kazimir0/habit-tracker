'use client'

import { useHabits } from '../hooks/useHabits'
import HeatMapCalendar from '../components/HeatMapCalendar'
import CategoryPerformanceChart from '../components/CategoryPerformanceChart'

export default function AnalyticsPage() {
    const { habits } = useHabits()

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Track your habit patterns and progress over time</p>
            </div>

            {/* Analytics Content - We'll build this step by step */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Heat Map Calendar */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Activity Heat Map</h2>
                    <HeatMapCalendar habits={habits} />
                </div>

                {/* Category Performance */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Category Performance</h2>
                    <CategoryPerformanceChart habits={habits} />
                </div>
            </div>
        </div>
    )
}