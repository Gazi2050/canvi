'use client'

import { ButtonHTMLAttributes } from 'react'
import { GoogleIcon } from './GoogleIcon'

type AuthGoogleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	children: string
}

export function AuthGoogleButton({
	children,
	loading = false,
	disabled,
	className = '',
	...props
}: AuthGoogleButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled ?? loading}
			className={`w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg border border-foreground/15 bg-background text-foreground hover:bg-foreground/[0.04] focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none transition-colors ${className}`}
			{...props}
		>
			<GoogleIcon />
			{loading ? 'Please wait…' : children}
		</button>
	)
}
