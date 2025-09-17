import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: habitId } = await params
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Check if habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { 
        id: habitId,
        user: { clerkId: userId }
      }
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Check if already completed today
    const existingCompletion = await prisma.habitCompletion.findUnique({
      where: {
        habitId_date: {
          habitId: habitId,
          date: today
        }
      }
    })

    if (existingCompletion) {
      // Remove completion (uncomplete)
      await prisma.habitCompletion.delete({
        where: { id: existingCompletion.id }
      })
      return NextResponse.json({ completed: false })
    } else {
      // Add completion
      await prisma.habitCompletion.create({
        data: {
          habitId: habitId,
          date: today
        }
      })
      return NextResponse.json({ completed: true })
    }
  } catch (error) {
    console.error('Error toggling habit completion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: habitId } = await params

    // Check if habit belongs to user and delete
    const deletedHabit = await prisma.habit.deleteMany({
      where: { 
        id: habitId,
        user: { clerkId: userId }
      }
    })

    if (deletedHabit.count === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}