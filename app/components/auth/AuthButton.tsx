'use client'

import { ButtonHTMLAttributes } from 'react'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	variant?: 'primary' | 'secondary'
}

export function AuthButton({
	children,
	loading = false,
	variant = 'primary',
	disabled,
	className = '',
	type = 'submit',
	...props
}: AuthButtonProps) {
	const base =
		'w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none transition-colors'
	const styles =
		variant === 'primary'
			? 'bg-foreground text-background hover:opacity-90'
			: 'border border-foreground/15 text-foreground bg-foreground/[0.02] hover:bg-foreground/[0.05]'
	return (
		<button
			type={type}
			disabled={disabled ?? loading}
			className={`${base} ${styles} ${className}`}
			{...props}
		>
			{loading ? 'Please wait…' : children}
		</button>
	)
}
