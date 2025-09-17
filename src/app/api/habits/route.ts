import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user in database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: '' } // We'll update email later if needed
    })

    // Get all habits for this user with their completions
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        completions: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, category, difficulty } = await request.json()

    // Get or create user in database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: '' }
    })

    // Create new habit
    const habit = await prisma.habit.create({
      data: {
        name,
        category: category.toUpperCase(),
        difficulty: difficulty.toUpperCase(),
        userId: user.id
      },
      include: {
        completions: true
      }
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}