'use client'

import { useState } from 'react'

interface HabitFormProps {
    onAddHabit: (habitName: string, category: 'Health' | 'Work' | 'Personal', difficulty: 'Easy' | 'Medium' | 'Hard') => void
    onCancel: () => void
}

export default function HabitForm({ onAddHabit, onCancel }: HabitFormProps) {
    const [habitName, setHabitName] = useState('')
    const [category, setCategory] = useState<'Health' | 'Work' | 'Personal'>('Personal')
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')

    const handleSubmit = () => {
        if (habitName.trim()) {
            onAddHabit(habitName.trim(), category, difficulty)
            setHabitName('')
            setCategory('Personal')
            setDifficulty('Medium')
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg mb-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Add New Habit</h3>
            
            <div className="space-y-4">
                {/* Habit Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Habit Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter habit name"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as 'Health' | 'Work' | 'Personal')}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-white bg-white dark:bg-gray-800 transition-colors duration-300"
                    >
                        <option value="Personal">🟣 Personal</option>
                        <option value="Health">🟢 Health</option>
                        <option value="Work">🔵 Work</option>
                    </select>
                </div>

                {/* Difficulty Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-white bg-white dark:bg-gray-800 transition-colors duration-300"
                    >
                        <option value="Easy">⭐ Easy</option>
                        <option value="Medium">⭐⭐ Medium</option>
                        <option value="Hard">⭐⭐⭐ Hard</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 flex-1 transition-colors duration-300"
                    >
                        Add Habit
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 flex-1 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}