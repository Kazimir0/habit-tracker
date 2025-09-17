'use client'

import { useNotifications, Notification } from '@/contexts/NotificationContext'

function ToastItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications()

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white'
      case 'error':
        return 'bg-red-500 border-red-600 text-white'
      case 'celebration':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-600 text-white animate-pulse'
      default:
        return 'bg-blue-500 border-blue-600 text-white'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'celebration':
        return '🎉'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`
      ${getToastStyles(notification.type)}
      p-4 rounded-lg shadow-lg border-l-4 mb-3 
      transform transition-all duration-300 ease-in-out
      hover:scale-105 cursor-pointer
      animate-slide-in
    `}
    onClick={() => removeNotification(notification.id)}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{getIcon(notification.type)}</span>
        <div className="flex-1">
          <div className="font-semibold">{notification.title}</div>
          {notification.message && (
            <div className="text-sm opacity-90 mt-1">{notification.message}</div>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            removeNotification(notification.id)
          }}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function ToastContainer() {
  const { notifications } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {notifications.map((notification) => (
        <ToastItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}