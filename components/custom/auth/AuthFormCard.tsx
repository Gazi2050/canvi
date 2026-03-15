'use client'

import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AuthFormCardProps = {
	siteName?: string
	title: string
	children: ReactNode
	className?: string
}

export function AuthFormCard({ siteName, title, children, className }: AuthFormCardProps) {
	return (
		<Card className={cn('w-full max-w-[420px]', className)}>
			<CardHeader className="mb-8 text-center">
				{siteName && (
					<p className="text-[11px] font-semibold tracking-[0.25em] text-foreground/40 uppercase">
						{siteName}
					</p>
				)}
				<CardTitle className="mt-3 text-2xl font-medium tracking-tight text-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	)
}
