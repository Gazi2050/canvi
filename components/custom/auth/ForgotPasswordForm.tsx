'use client'

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthButton } from './AuthButton'
import { AuthField } from './AuthField'
import { AuthFormCard } from './AuthFormCard'

const REDIRECT_AFTER_SIGN_IN = '/app/dashboard'

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
	const { signIn, errors, fetchStatus } = useSignIn()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [password, setPassword] = useState('')
	const [codeSent, setCodeSent] = useState(false)

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signIn) return
		const { error: createError } = await signIn.create({ identifier: email })
		if (createError) return
		const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode()
		if (sendError) return
		setCodeSent(true)
	}

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signIn) return
		const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code })
		if (error) return
	}

	const handleSubmitPassword = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signIn) return
		const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password })
		if (error) return
		if (signIn.status === 'complete') {
			await signIn.finalize({
				navigate: ({ decorateUrl }) => {
					const url = decorateUrl(REDIRECT_AFTER_SIGN_IN)
					if (url.startsWith('http')) window.location.href = url
					else router.push(url)
				},
			})
		}
	}

	if (!codeSent) {
		return (
			<AuthFormCard siteName="Freespace" title="Forgot password?">
				<p className="mb-5 text-sm text-muted-foreground">
					Enter your email and we&apos;ll send you a code to reset your password.
				</p>
				<form onSubmit={handleSendCode} className="space-y-5">
					<AuthField
						label="Email"
						type="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						error={errors?.fields?.identifier?.message}
					/>
					<AuthButton loading={fetchStatus === 'fetching'}>Send reset code</AuthButton>
				</form>
				<button type="button" className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={onBack}>
					Back to sign in
				</button>
			</AuthFormCard>
		)
	}

	if (signIn.status !== 'needs_new_password') {
		return (
			<AuthFormCard siteName="Freespace" title="Check your email">
				<form onSubmit={handleVerifyCode} className="space-y-5">
					<AuthField
						label="Verification code"
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						required
						error={errors?.fields?.code?.message}
					/>
					<AuthButton loading={fetchStatus === 'fetching'}>Verify code</AuthButton>
				</form>
				<button type="button" className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={onBack}>
					Back to sign in
				</button>
			</AuthFormCard>
		)
	}

	return (
		<AuthFormCard siteName="Freespace" title="Set new password">
			<form onSubmit={handleSubmitPassword} className="space-y-5">
				<AuthField
					label="New password"
					type="password"
					autoComplete="new-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					error={errors?.fields?.password?.message}
				/>
				<AuthButton loading={fetchStatus === 'fetching'}>Set password</AuthButton>
			</form>
		</AuthFormCard>
	)
}
