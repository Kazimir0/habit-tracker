import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Simple database connection test
    await prisma.$connect()
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful' 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}