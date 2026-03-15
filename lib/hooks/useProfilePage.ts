'use client'

import { useUser } from '@clerk/nextjs'
import { useRef, useState, useEffect } from 'react'
import {
  updateProfileName,
  updateProfileImage,
  updatePassword,
  providerLabel,
} from '@/lib/services'

export function useProfilePage() {
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
  }, [user?.firstName, user?.lastName])

  const displayName =
    user?.fullName ??
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ??
    'User'
  const initials =
    user?.firstName?.[0] && user?.lastName?.[0]
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? 'U'

  const passwordEnabled = user?.passwordEnabled ?? false
  const externalAccounts = user?.externalAccounts ?? []
  const hasExternalAccount = externalAccounts.length > 0
  const externalAccountLabel = hasExternalAccount
    ? externalAccounts.map((a) => providerLabel(a.provider)).join(', ')
    : 'None'
  const createdAt =
    user?.createdAt != null ? Number(user.createdAt) : undefined
  const lastSignInAt =
    user?.lastSignInAt != null ? Number(user.lastSignInAt) : undefined

  const nameChanged =
    firstName !== (user?.firstName ?? '') ||
    lastName !== (user?.lastName ?? '')

  const handleSaveName = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateProfileName(user, { firstName, lastName })
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setImageUploading(true)
    try {
      await updateProfileImage(user, file)
    } finally {
      setImageUploading(false)
      e.target.value = ''
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    if (!user) return
    setPasswordSaving(true)
    const result = await updatePassword(user, {
      currentPassword,
      newPassword,
      confirmPassword,
      passwordEnabled,
    })
    setPasswordSaving(false)
    if (result.success) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
    } else {
      setPasswordError(result.error)
    }
  }

  return {
    user,
    fileInputRef,
    displayName,
    initials,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    saving,
    imageUploading,
    nameChanged,
    handleSaveName,
    handleImageChange,
    handleUpdatePassword,
    passwordEnabled,
    externalAccountLabel,
    createdAt,
    lastSignInAt,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordSaving,
    passwordError,
    passwordSuccess,
  }
}
