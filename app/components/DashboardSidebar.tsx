'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function DashboardSidebar() {
	const { user } = useUser()
	const { signOut } = useClerk()
	const router = useRouter()

	const displayName =
		user?.fullName ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ') ?? 'User'
	const initials = user?.firstName?.[0] && user?.lastName?.[0]
		? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
		: user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? 'U'

	const handleLogout = async () => {
		await signOut({ redirectUrl: '/' })
		router.push('/')
	}

	return (
		<aside className="w-64 shrink-0 border-r border-foreground/10 bg-foreground/[0.02] flex flex-col min-h-screen">
			<div className="p-6 border-b border-foreground/10">
				<div className="flex flex-col items-center text-center">
					{user?.imageUrl ? (
						<Image
							src={user.imageUrl}
							alt={displayName}
							width={64}
							height={64}
							className="rounded-full object-cover"
						/>
					) : (
						<div className="size-16 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-semibold text-foreground">
							{initials}
						</div>
					)}
					<p className="mt-3 text-sm font-medium text-foreground truncate w-full">
						{displayName}
					</p>
					{user?.primaryEmailAddress?.emailAddress && (
						<p className="mt-0.5 text-xs text-foreground/60 truncate w-full">
							{user.primaryEmailAddress.emailAddress}
						</p>
					)}
				</div>
			</div>
			<nav className="flex-1 p-4 flex flex-col gap-1">
				<Link
					href="/app"
					className="px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
				>
					Canvas
				</Link>
				<button
					type="button"
					onClick={handleLogout}
					className="w-full text-left px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-foreground/5 hover:text-foreground transition-colors"
				>
					Logout
				</button>
			</nav>
		</aside>
	)
}
