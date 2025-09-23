'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useNotifications } from '@/contexts/NotificationContext'
import Image from 'next/image'

interface UserProfile {
  id?: string
  nickname?: string
  bio?: string
  phoneNumber?: string
  phoneVerified?: boolean
  timezone?: string
  theme?: string
  language?: string
  avatar?: string
}

export default function ProfilePage() {
  const { user } = useUser()
  const { showSuccess, showError } = useNotifications()
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          console.log('Profile data loaded:', data)
          setProfile(data.profile || {})
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Save profile changes
  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        showSuccess('Profile updated successfully! 🎉')
      } else {
        showError('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Profile save error:', error)
      showError('Failed to update profile. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be smaller than 5MB.')
      return
    }

    setUploading(true)
    try {
      // Convert image to base64 for now (simple approach)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        // Update profile with new avatar
        const updatedProfile = { ...profile, avatar: base64 }
        setProfile(updatedProfile)

        // Auto-save the avatar
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile)
        })

        if (response.ok) {
          // Update Clerk avatar if user exists
          if (user) {
            try {
              await user.setProfileImage({ file: file })
              showSuccess('Avatar updated everywhere! 📸')
            } catch (clerkError) {
              console.warn('Could not update Clerk avatar:', clerkError)
              showSuccess('Avatar updated successfully! 📸')
            }
          } else {
            showSuccess('Avatar updated successfully! 📸')
          }
        } else {
          showError('Failed to update avatar. Please try again.')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Avatar upload error:', error)
      showError('Failed to upload avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Profile Settings
          </h1>

          {/* Profile Photo Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden relative">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  profile.nickname?.charAt(0)?.toUpperCase() || user?.firstName?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block"
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </label>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Nickname</label>
              <input
                type="text"
                value={profile.nickname || ''}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                placeholder="Enter your nickname"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="flex">
                <input
                  type="tel"
                  value={profile.phoneNumber || ''}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  placeholder="+40 123 456 789"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors">
                  {profile.phoneVerified ? '✅' : 'Verify'}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={profile.timezone || 'Europe/Bucharest'}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Europe/Bucharest">🇷🇴 Romania (Bucharest)</option>
                <option value="Europe/London">🇬🇧 London</option>
                <option value="Europe/Berlin">🇩🇪 Berlin</option>
                <option value="America/New_York">🇺🇸 New York</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={profile.language || 'en'}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">🇺🇸 English</option>
                <option value="ro">🇷🇴 Română</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}