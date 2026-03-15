type ProfileUser = {
  update: (params: { firstName?: string; lastName?: string }) => Promise<void>
  setProfileImage: (params: { file: File }) => Promise<unknown>
  updatePassword: (params: {
    currentPassword?: string
    newPassword: string
    signOutOfOtherSessions?: boolean
  }) => Promise<unknown>
}

export async function updateProfileName(
  user: ProfileUser,
  payload: { firstName: string; lastName: string }
): Promise<void> {
  await user.update({
    firstName: payload.firstName.trim() || undefined,
    lastName: payload.lastName.trim() || undefined,
  })
}

export async function updateProfileImage(user: ProfileUser, file: File): Promise<void> {
  await user.setProfileImage({ file })
}

export type UpdatePasswordPayload = {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
  passwordEnabled: boolean
}

export type UpdatePasswordResult = { success: true } | { success: false; error: string }

export async function updatePassword(
  user: ProfileUser,
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResult> {
  const { currentPassword, newPassword, confirmPassword, passwordEnabled } = payload

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" }
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match" }
  }
  if (passwordEnabled && !(currentPassword ?? "").trim()) {
    return { success: false, error: "Enter your current password" }
  }

  try {
    await user.updatePassword({
      ...(passwordEnabled && { currentPassword: (currentPassword ?? "").trim() }),
      newPassword,
      signOutOfOtherSessions: false,
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update password"
    return { success: false, error: message }
  }
}
