import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Auth check successful',
      userId: userId ? 'User is authenticated' : 'No user found',
      hasUserId: !!userId
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Auth check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}