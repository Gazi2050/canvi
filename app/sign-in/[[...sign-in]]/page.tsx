'use client'

import { useState } from 'react'
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm'
import { SignInForm } from '../../components/auth/SignInForm'

export default function SignInPage() {
	const [showForgotPassword, setShowForgotPassword] = useState(false)
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4">
			{showForgotPassword ? (
				<ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
			) : (
				<SignInForm onForgotPassword={() => setShowForgotPassword(true)} />
			)}
		</div>
	)
}
