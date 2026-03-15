'use client'

import { Calendar, LogIn, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

type ProfileAccountInfoCardProps = {
  externalAccountLabel: string
  lastSignInAt: number | undefined
  createdAt: number | undefined
}

export function ProfileAccountInfoCard({
  externalAccountLabel,
  lastSignInAt,
  createdAt,
}: ProfileAccountInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Account info</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Link2 className="size-4" />
              External account
            </dt>
            <dd className="text-sm text-foreground text-right truncate">
              {externalAccountLabel}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <LogIn className="size-4" />
              Last sign-in
            </dt>
            <dd className="text-sm text-foreground text-right">
              {formatDate(lastSignInAt)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Calendar className="size-4" />
              Account created
            </dt>
            <dd className="text-sm text-foreground text-right">
              {formatDate(createdAt)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
