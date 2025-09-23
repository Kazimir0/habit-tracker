import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()


// POST /api/verify-phone - Handle SMS verification
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber, code, action } = body

    // find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Send verification code

    if (action === 'send') {
      // Validate Romanian phone number

      const romanianPhoneRegex = /^(\+40|0040|40)?[27][0-9]{8}$/
      const cleanPhone = phoneNumber.replace(/\s/g, '')

      if (!romanianPhoneRegex.test(cleanPhone)) {
        return NextResponse.json({ error: 'Please enter a valid Romanian phone number (+40 format)' }, { status: 400 })
      }

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      // format phone number
      const formattedPhone = cleanPhone.replace(/^(0040|\+40|40)/, '+40')

      // delete old codes for current user
      await prisma.verificationCode.deleteMany({
        where: {
          userId: user.id,
          type: 'phone'
        }
      })

      // store new verification code in DB
      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code: verificationCode,
          type: 'phone',
          phoneNumber: formattedPhone,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
        }
      })

      // ONLY FOR LOCAL DEVELOPMENT - Log the code to the console
      console.log('SMS verification code:', verificationCode)
      console.log('Phone number:', formattedPhone)
      console.log('Expires in 10 minutes')

      return NextResponse.json({
        message: 'Verification code sent! Check your terminal for the code.',
        success: true
      })
    }

    // Verify the code
    if (action === 'verify') {
      // Find valid verification code
      const verification = await prisma.verificationCode.findFirst({
        where: {
          userId: user.id,
          code,
          type: 'phone',
          verified: false,
          expiresAt: { gt: new Date() } // not expired
        }
      })

      if (!verification) {
        return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
      }

      // Mark the code as verified
      await prisma.verificationCode.update({
        where: { id: verification.id },
        data: { verified: true }
      })

      // Update user's phone number and mark as verified
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          phoneVerified: true,
          phoneNumber: verification.phoneNumber
        },
        create: {
          userId: user.id,
          phoneVerified: true,
          phoneNumber: verification.phoneNumber
        }
      })

      return NextResponse.json({
        message: 'Phone number verified successfully!',
        success: true
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}