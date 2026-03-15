'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	error?: string
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
	({ label, error, id, className = '', ...props }, ref) => {
		const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
		return (
			<div className="space-y-1.5">
				<label htmlFor={inputId} className="block text-sm font-medium text-foreground/90">
					{label}
				</label>
				<input
					ref={ref}
					id={inputId}
					className={`w-full px-3.5 py-2.5 text-[15px] rounded-lg border border-foreground/15 bg-foreground/[0.02] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 transition-colors ${className}`}
					{...props}
				/>
				{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
			</div>
		)
	}
)
AuthField.displayName = 'AuthField'
