'use client'

import { useProfilePage } from '@/lib/hooks'
import { ProfileEditCard } from '@/components/custom/profile/ProfileEditCard'
import { ProfileAccountInfoCard } from '@/components/custom/profile/ProfileAccountInfoCard'
import { ProfilePasswordCard } from '@/components/custom/profile/ProfilePasswordCard'

export default function ProfilePage() {
  const profile = useProfilePage()

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details
        </p>
      </div>

      <ProfileEditCard
        fileInputRef={profile.fileInputRef}
        user={profile.user ?? null}
        displayName={profile.displayName}
        initials={profile.initials}
        firstName={profile.firstName}
        setFirstName={profile.setFirstName}
        lastName={profile.lastName}
        setLastName={profile.setLastName}
        saving={profile.saving}
        imageUploading={profile.imageUploading}
        nameChanged={profile.nameChanged}
        onSaveName={profile.handleSaveName}
        onImageChange={profile.handleImageChange}
      />

      <ProfileAccountInfoCard
        externalAccountLabel={profile.externalAccountLabel}
        lastSignInAt={profile.lastSignInAt}
        createdAt={profile.createdAt}
      />

      <ProfilePasswordCard
        passwordEnabled={profile.passwordEnabled}
        currentPassword={profile.currentPassword}
        setCurrentPassword={profile.setCurrentPassword}
        newPassword={profile.newPassword}
        setNewPassword={profile.setNewPassword}
        confirmPassword={profile.confirmPassword}
        setConfirmPassword={profile.setConfirmPassword}
        passwordSaving={profile.passwordSaving}
        passwordError={profile.passwordError}
        passwordSuccess={profile.passwordSuccess}
        onSubmit={profile.handleUpdatePassword}
      />
    </div>
  )
}
