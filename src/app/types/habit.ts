export interface Habit {
  id: string
  name: string
  category: 'HEALTH' | 'WORK' | 'PERSONAL'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  createdAt: string
  updatedAt: string
  completions: HabitCompletion[]
  weeklyGoal?: number // Optional: target completions per week
  monthlyGoal?: number // Optional: target completions per month
}

export interface HabitCompletion {
  id: string
  date: string // YYYY-MM-DD format
  completedAt: string
}