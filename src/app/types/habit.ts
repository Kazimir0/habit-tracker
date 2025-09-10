export interface Habit {
id: string
name: string
category: 'Health' | 'Work' | 'Personal'
difficulty: 'Easy' | 'Medium' | 'Hard'
createdAt: string
completions: string[] // Array of dates when completed
weeklyGoal?: number // Optional: target completions per week
monthlyGoal?: number // Optional: target completions per month
}