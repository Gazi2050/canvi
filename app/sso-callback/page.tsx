'use client'

import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const REDIRECT_AFTER_AUTH = '/app'

export default function SSOCallbackPage() {
	const clerk = useClerk()
	const { signIn } = useSignIn()
	const { signUp } = useSignUp()
	const router = useRouter()
	const hasRun = useRef(false)

	const navigate = (url: string) => {
		if (url.startsWith('http')) window.location.href = url
		else router.push(url)
	}

	useEffect(() => {
		;(async () => {
			if (!clerk.loaded || hasRun.current || !signIn || !signUp) return
			hasRun.current = true

			if (signIn.status === 'complete') {
				await signIn.finalize({
					navigate: async ({ session, decorateUrl }) => {
						if (session?.currentTask) return
						navigate(decorateUrl(REDIRECT_AFTER_AUTH))
					},
				})
				return
			}

			if (signUp.isTransferable) {
				await signIn.create({ transfer: true })
				if (signIn.status === 'complete') {
					await signIn.finalize({
						navigate: async ({ session, decorateUrl }) => {
							if (session?.currentTask) return
							navigate(decorateUrl(REDIRECT_AFTER_AUTH))
						},
					})
					return
				}
				router.push('/sign-in')
				return
			}

			if (
				signIn.status === 'needs_first_factor' &&
				!signIn.supportedFirstFactors?.every((f) => f.strategy === 'enterprise_sso')
			) {
				router.push('/sign-in')
				return
			}

			if (signIn.isTransferable) {
				await signUp.create({ transfer: true })
				if (signUp.status === 'complete') {
					await signUp.finalize({
						navigate: async ({ session, decorateUrl }) => {
							if (session?.currentTask) return
							navigate(decorateUrl(REDIRECT_AFTER_AUTH))
						},
					})
					return
				}
				router.push('/sign-up')
				return
			}

			if (signUp.status === 'complete') {
				await signUp.finalize({
					navigate: async ({ session, decorateUrl }) => {
						if (session?.currentTask) return
						navigate(decorateUrl(REDIRECT_AFTER_AUTH))
					},
				})
				return
			}

			if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_new_password') {
				router.push('/sign-in')
				return
			}

			const sessionId = signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId
			if (sessionId) {
				await clerk.setActive({
					session: sessionId,
					navigate: async ({ session, decorateUrl }) => {
						if (session?.currentTask) return
						navigate(decorateUrl(REDIRECT_AFTER_AUTH))
					},
				})
				return
			}
		})()
	}, [clerk, signIn, signUp, router])

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<p className="text-foreground/70">Completing sign in…</p>
			<div id="clerk-captcha" />
		</div>
	)
}
