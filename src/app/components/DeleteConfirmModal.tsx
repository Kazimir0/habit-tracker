'use client'

interface DeleteConfirmModalProps {
    isOpen: boolean
    habitName: string
    onConfirm: () => void
    onCancel: () => void
}

export default function DeleteConfirmModal({
    isOpen,
    habitName,
    onConfirm,
    onCancel
}: DeleteConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure about this?</h3>
                        <p className="text-gray-600 mb-2">
                            You are about to delete the habit:
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            `{habitName}`
                        </p>
                        <p className="text-sm text-gray-500">
                            This action cannot be undone and you will lose all progress data.
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                            Yes, Delete It
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}