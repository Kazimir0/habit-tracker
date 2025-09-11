'use client'

import { useHabits } from '../hooks/useHabits'
import HeatMapCalendar from '../components/HeatMapCalendar'

export default function AnalyticsPage() {
    const { habits } = useHabits()

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Track your habit patterns and progress over time</p>
            </div>

            {/* Analytics Content - We'll build this step by step */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Heat Map Calendar */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Activity Heat Map</h2>
                    <HeatMapCalendar habits={habits} />
                </div>

                {/* Category Performance - Coming next */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
                    <p className="text-gray-500">Category charts coming soon...</p>
                </div>
            </div>

            {/* Debug: Show current habits data */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Current Habits Data:</h3>
                <pre className="text-sm text-gray-600 overflow-auto">
                    {JSON.stringify(habits, null, 2)}
                </pre>
            </div>
        </div>
    )
}