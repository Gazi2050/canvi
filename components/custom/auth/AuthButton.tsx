'use client'

import { ButtonHTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	variant?: 'primary' | 'secondary'
}

export function AuthButton({
	children,
	loading = false,
	variant = 'primary',
	disabled,
	className,
	type = 'submit',
	...props
}: AuthButtonProps) {
	const buttonVariant = variant === 'primary' ? 'default' : 'outline'
	return (
		<Button
			type={type}
			variant={buttonVariant}
			size="lg"
			disabled={disabled ?? loading}
			className={cn('w-full', className)}
			{...props}
		>
			{loading ? 'Please wait…' : children}
		</Button>
	)
}
