'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	error?: string
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
	({ label, error, id, className, ...props }, ref) => {
		const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
		return (
			<div className="space-y-1.5">
				<Label htmlFor={inputId}>{label}</Label>
				<Input
					ref={ref}
					id={inputId}
					className={cn(className)}
					{...props}
				/>
				{error && (
					<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
				)}
			</div>
		)
	}
)
AuthField.displayName = 'AuthField'
