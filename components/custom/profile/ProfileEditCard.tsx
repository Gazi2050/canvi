'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ProfileEditCardProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  user: { imageUrl?: string } | null
  displayName: string
  initials: string
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  saving: boolean
  imageUploading: boolean
  nameChanged: boolean
  onSaveName: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileEditCard({
  fileInputRef,
  user,
  displayName,
  initials,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  saving,
  imageUploading,
  nameChanged,
  onSaveName,
  onImageChange,
}: ProfileEditCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Edit profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-8">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
              disabled={imageUploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="relative rounded-full ring-2 ring-transparent hover:ring-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-50"
            >
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={displayName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="size-20 rounded-full bg-muted flex items-center justify-center text-xl font-medium text-muted-foreground">
                  {initials}
                </div>
              )}
              <span
                className={cn(
                  'absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-xs font-medium text-white opacity-0 hover:opacity-100 transition-opacity',
                  imageUploading && 'opacity-100 bg-black/50'
                )}
              >
                {imageUploading ? 'Uploading…' : 'Change'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Change photo
            </button>
          </div>
          <div className="flex-1 space-y-4 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="profile-first-name"
                  className="text-muted-foreground font-normal"
                >
                  First name
                </Label>
                <Input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="profile-last-name"
                  className="text-muted-foreground font-normal"
                >
                  Last name
                </Label>
                <Input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-9"
                />
              </div>
            </div>
            {nameChanged && (
              <Button size="sm" onClick={onSaveName} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
