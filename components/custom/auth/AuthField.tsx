'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	error?: string
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
	({ label, error, id, className, type, ...props }, ref) => {
		const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
		const isPassword = type === 'password'
		const [showPassword, setShowPassword] = useState(false)
		const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

		return (
			<div className="space-y-1.5">
				<Label htmlFor={inputId}>{label}</Label>
				{isPassword ? (
					<div className="relative">
						<Input
							ref={ref}
							id={inputId}
							type={inputType}
							className={cn('pr-10 h-10', className)}
							{...props}
						/>
						<button
							type="button"
							tabIndex={-1}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							onClick={() => setShowPassword((s) => !s)}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
						>
							{showPassword ? (
								<EyeOff className="size-4" />
							) : (
								<Eye className="size-4" />
							)}
						</button>
					</div>
				) : (
					<Input
						ref={ref}
						id={inputId}
						type={type}
						className={cn('h-10', className)}
						{...props}
					/>
				)}
				{error && (
					<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
				)}
			</div>
		)
	}
)
AuthField.displayName = 'AuthField'
