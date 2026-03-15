'use client'

import { Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AuthField } from '@/components/custom/auth/AuthField'

type ProfilePasswordCardProps = {
  passwordEnabled: boolean
  currentPassword: string
  setCurrentPassword: (v: string) => void
  newPassword: string
  setNewPassword: (v: string) => void
  confirmPassword: string
  setConfirmPassword: (v: string) => void
  passwordSaving: boolean
  passwordError: string | null
  passwordSuccess: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function ProfilePasswordCard({
  passwordEnabled,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordSaving,
  passwordError,
  passwordSuccess,
  onSubmit,
}: ProfilePasswordCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Lock className="size-4" />
          Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {passwordEnabled && (
            <AuthField
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          )}
          <AuthField
            label={passwordEnabled ? 'New password' : 'Password'}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={
              passwordEnabled
                ? 'Enter new password'
                : 'Choose a password (min 8 characters)'
            }
          />
          <AuthField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          {passwordError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Password updated.
            </p>
          )}
          <Button type="submit" size="sm" disabled={passwordSaving}>
            {passwordSaving
              ? 'Updating…'
              : passwordEnabled
                ? 'Change password'
                : 'Add password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
