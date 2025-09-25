# 🏆 HabitTracker - Complete Habit Management Application

A modern, full-stack habit tracking application built with Next.js, TypeScript, and PostgreSQL. Track your daily habits, visualize your progress, and build better routines with smart notifications and detailed analytics.

## ✨ Features

### 🎯 **Core Functionality**
- **Smart Habit Management** - Create, edit, and track daily habits
- **Real-time Progress Tracking** - Mark habits as complete with instant feedback
- **Streak Tracking** - Monitor your consistency with streak counters
- **Smart Notifications** - Celebratory messages for achievements

### 📊 **Analytics & Insights**
- **Interactive Dashboard** - Visual analytics with heat maps and charts
- **Progress Visualization** - Track completion rates and trends over time
- **Category Performance** - Analyze habits by categories (Health, Work, Personal)
- **Personal Records** - View your best streaks and achievements

### 👤 **User Management**
- **Secure Authentication** - Powered by Clerk with GitHub/Google login
- **Custom Profiles** - Upload avatars and manage personal information
- **Phone Verification** - SMS verification for Romanian phone numbers (+40) (local in terminal)
- **Multi-language Support** - English and Romanian interface

### 🎨 **Modern UI/UX**
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works perfectly on desktop
- **Smooth Animations** - Professional transitions and loading states
- **Accessibility** - Built with accessibility best practices

## 🚀 Quick Start

## 📖 User Guide

### Getting Started as a User

1. **Sign Up/Login** - Use GitHub, Google, or email to create your account
2. **Complete Your Profile** - Add your nickname, bio, and verify your phone number
3. **Create Your First Habit** - Click "Add Habit" and start tracking
4. **Mark Completions** - Check off habits as you complete them daily
5. **View Analytics** - Visit the Analytics page to see your progress

### Creating Habits

- **Name**: Choose a clear, specific habit name (e.g., "Drink 8 glasses of water")
- **Category**: Organize habits by type (Health, Work, Personal)
- **Frequency**: Track daily progress and build streaks

### Phone Verification (Romanian Users)

For Romanian phone numbers:
- Enter your number in any format: `0757636167` or `+40757636167`
- Click "Send Code" and check your terminal for the verification code
- Enter the 6-digit code to verify your number

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **Docker** (for PostgreSQL database)
- **Git** (for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker

2. Install Dependencies

npm install

3. Environment Setup

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/habittracker"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# App Settings
NODE_ENV=development

4. Database Setup
Start PostgreSQL with Docker:

# Start PostgreSQL container
docker run --name habit-tracker-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=habittracker \
  -p 5432:5432 \
  -d postgres:15

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init


5. Run the application

npm run dev

!!!!
📱 SMS Verification (Development)
During development, SMS codes are logged to the terminal instead of being sent via SMS
📱 SMS VERIFICATION CODE: 123456
📞 Phone Number: +40757636167
⏰ Expires in 10 minutes
!!!


# View your data
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy

## 🛠️ Technical Stack

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client

### Infrastructure
- **Docker** - Containerized database

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Clerk** for seamless authentication
- **Prisma** for the excellent ORM
- **Tailwind CSS** for beautiful styling

---

**Built with ❤️ for habit building enthusiasts**

*Start building better habits today! 🌟*