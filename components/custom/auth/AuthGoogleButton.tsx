'use client'

import { ButtonHTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from './GoogleIcon'
import { cn } from '@/lib/utils'

type AuthGoogleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	children: string
}

export function AuthGoogleButton({
	children,
	loading = false,
	disabled,
	className,
	...props
}: AuthGoogleButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			className={cn('w-full', className)}
			disabled={disabled ?? loading}
			{...props}
		>
			<GoogleIcon />
			{loading ? 'Please wait…' : children}
		</Button>
	)
}
