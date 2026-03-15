'use client'

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export function AuthHeader() {
	const pathname = usePathname()
	if (pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
		return null
	}
	return (
		<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end gap-3 px-4 py-2 bg-background/80 backdrop-blur border-b border-foreground/10">
			<Show when="signed-out">
				<SignInButton mode="redirect" forceRedirectUrl="/sign-in">
					<button
						type="button"
						className="px-3 py-1.5 text-sm font-medium text-foreground hover:opacity-80"
					>
						Sign in
					</button>
				</SignInButton>
				<SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
					<button
						type="button"
						className="px-3 py-1.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90"
					>
						Sign up
					</button>
				</SignUpButton>
			</Show>
			<Show when="signed-in">
				<UserButton afterSignOutUrl="/" />
			</Show>
		</header>
	)
}
