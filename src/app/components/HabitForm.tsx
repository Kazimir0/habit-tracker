'use client'

import { useState } from 'react'

interface HabitFormProps {
    onAddHabit: (habitName: string) => void
    onCancel: () => void
}

export default function HabitForm({ onAddHabit, onCancel }: HabitFormProps) {
    const [habitName, setHabitName] = useState('')

    const handleSubmit = () => {
        if (habitName.trim()) {
            onAddHabit(habitName.trim())
            setHabitName('')
        }
    }

    return (
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 text-black">Add New Habit</h3>
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Enter habit name"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                    Add
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}