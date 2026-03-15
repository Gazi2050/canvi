'use client'

import { useSignIn } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthButton } from './AuthButton'
import { AuthField } from './AuthField'
import { AuthFormCard } from './AuthFormCard'
import { AuthGoogleButton } from './AuthGoogleButton'

const REDIRECT_AFTER_SIGN_IN = '/app/dashboard'

export function SignInForm({ onForgotPassword }: { onForgotPassword?: () => void } = {}) {
	const { signIn, errors, fetchStatus } = useSignIn()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [code, setCode] = useState('')
	const [showCodeStep, setShowCodeStep] = useState(false)
	const [identifierNotFound, setIdentifierNotFound] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIdentifierNotFound(false)
		if (!signIn) return

		const { error } = await signIn.password({ emailAddress: email, password })
		if (error) {
			const code = error.errors?.[0]?.code
			if (code === 'form_identifier_not_found') {
				setIdentifierNotFound(true)
				return
			}
			return
		}

		if (signIn.status === 'complete') {
			await signIn.finalize({
				navigate: ({ decorateUrl }) => {
					const url = decorateUrl(REDIRECT_AFTER_SIGN_IN)
					if (url.startsWith('http')) window.location.href = url
					else router.push(url)
				},
			})
			return
		}

		if (signIn.status === 'needs_client_trust') {
			const emailFactor = signIn.supportedSecondFactors?.find((f) => f.strategy === 'email_code')
			if (emailFactor) {
				await signIn.mfa.sendEmailCode()
				setShowCodeStep(true)
			}
		}
	}

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signIn) return
		const { error } = await signIn.mfa.verifyEmailCode({ code })
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

	const signInWithOAuth = async (strategy: OAuthStrategy) => {
		if (!signIn) return
		await signIn.sso({
			strategy,
			redirectCallbackUrl: '/sso-callback',
			redirectUrl: REDIRECT_AFTER_SIGN_IN,
		})
	}

	if (showCodeStep) {
		return (
			<AuthFormCard siteName="Freespace" title="Verify your email">
				<form onSubmit={handleVerifyCode} className="space-y-5">
					<AuthField
						label="Verification code"
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						error={errors?.fields?.code?.message}
					/>
					<AuthButton loading={fetchStatus === 'fetching'}>Verify</AuthButton>
				</form>
				<button
					type="button"
					className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => signIn?.reset()}
				>
					Start over
				</button>
			</AuthFormCard>
		)
	}

	return (
		<AuthFormCard siteName="Freespace" title="Welcome back">
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
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					error={errors?.fields?.password?.message}
				/>
				{onForgotPassword && (
					<div className="flex justify-end -mt-1">
						<button
							type="button"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							onClick={onForgotPassword}
						>
							Forgot password?
						</button>
					</div>
				)}
				{identifierNotFound && (
					<p className="text-sm text-muted-foreground">
						No account with this email.{' '}
						<Link href="/sign-up" className="font-medium text-foreground hover:underline">
							Sign up
						</Link>
					</p>
				)}
				<AuthButton loading={fetchStatus === 'fetching'}>Sign in</AuthButton>
			</form>
			<div className="mt-8 pt-6 border-t border-border">
				<div className="relative mb-5 flex items-center gap-3">
					<span className="flex-1 border-t border-border" />
					<span className="text-xs font-medium text-muted-foreground">or</span>
					<span className="flex-1 border-t border-border" />
				</div>
				<AuthGoogleButton
					loading={fetchStatus === 'fetching'}
					onClick={() => signInWithOAuth('oauth_google')}
				>
					Sign in with Google
				</AuthGoogleButton>
			</div>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{' '}
				<Link href="/sign-up" className="font-medium text-foreground hover:underline underline-offset-2">
					Sign up
				</Link>
			</p>
		</AuthFormCard>
	)
}
