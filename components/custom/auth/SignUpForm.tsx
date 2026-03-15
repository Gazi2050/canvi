'use client'

import { useSignUp } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthButton } from './AuthButton'
import { AuthField } from './AuthField'
import { AuthFormCard } from './AuthFormCard'
import { AuthGoogleButton } from './AuthGoogleButton'

const REDIRECT_AFTER_SIGN_UP = '/app/dashboard'

export function SignUpForm() {
	const { signUp, errors, fetchStatus } = useSignUp()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [code, setCode] = useState('')
	const [showCodeStep, setShowCodeStep] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signUp) return
		const { error } = await signUp.password({ emailAddress: email, password })
		if (error) return
		if (
			signUp.status === 'missing_requirements' &&
			signUp.unverifiedFields?.includes('email_address') &&
			signUp.missingFields?.length === 0
		) {
			await signUp.verifications.sendEmailCode()
			setShowCodeStep(true)
		}
	}

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signUp) return
		const { error } = await signUp.verifications.verifyEmailCode({ code })
		if (error) return
		if (signUp.status === 'complete') {
			await signUp.finalize({
				navigate: ({ decorateUrl }) => {
					const url = decorateUrl(REDIRECT_AFTER_SIGN_UP)
					if (url.startsWith('http')) window.location.href = url
					else router.push(url)
				},
			})
		}
	}

	const signUpWithOAuth = async (strategy: OAuthStrategy) => {
		if (!signUp) return
		await signUp.sso({
			strategy,
			redirectCallbackUrl: '/sso-callback',
			redirectUrl: REDIRECT_AFTER_SIGN_UP,
		})
	}

	if (showCodeStep) {
		return (
			<AuthFormCard siteName="Freespace" title="Verify your email">
				<p className="mb-5 text-sm text-muted-foreground">
					We sent a verification code to {email}. Enter it below.
				</p>
				<form onSubmit={handleVerifyCode} className="space-y-5">
					<AuthField
						label="Verification code"
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						required
						error={errors?.fields?.code?.message}
					/>
					<AuthButton loading={fetchStatus === 'fetching'}>Verify</AuthButton>
				</form>
				<button
					type="button"
					className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => signUp?.reset()}
				>
					Start over
				</button>
			</AuthFormCard>
		)
	}

	return (
		<AuthFormCard siteName="Freespace" title="Create an account">
			<form onSubmit={handleSubmit} className="space-y-5">
				<AuthField
					label="Email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					error={errors?.fields?.identifier?.message}
				/>
				<AuthField
					label="Password"
					type="password"
					autoComplete="new-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					error={errors?.fields?.password?.message}
				/>
				<div id="clerk-captcha" />
				<AuthButton loading={fetchStatus === 'fetching'}>Sign up</AuthButton>
			</form>
			<div className="mt-8 pt-6 border-t border-border">
				<div className="relative mb-5 flex items-center gap-3">
					<span className="flex-1 border-t border-border" />
					<span className="text-xs font-medium text-muted-foreground">or</span>
					<span className="flex-1 border-t border-border" />
				</div>
				<AuthGoogleButton
					loading={fetchStatus === 'fetching'}
					onClick={() => signUpWithOAuth('oauth_google')}
				>
					Sign up with Google
				</AuthGoogleButton>
			</div>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Link href="/sign-in" className="font-medium text-foreground hover:underline underline-offset-2">
					Sign in
				</Link>
			</p>
		</AuthFormCard>
	)
}
