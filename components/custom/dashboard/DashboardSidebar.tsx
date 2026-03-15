'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DashboardSidebar() {
	const { user } = useUser()
	const { signOut } = useClerk()
	const router = useRouter()
	const pathname = usePathname()

	const displayName =
		user?.fullName ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ') ?? 'User'
	const initials = user?.firstName?.[0] && user?.lastName?.[0]
		? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
		: user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? 'U'

	const handleLogout = async () => {
		await signOut({ redirectUrl: '/' })
		router.push('/')
	}

	const isActive = (path: string) => pathname === path

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
				<Button
					variant="ghost"
					className={cn('w-full justify-start', isActive('/app/dashboard') && 'bg-foreground/5')}
					asChild
				>
					<Link href="/app/dashboard" aria-current={isActive('/app/dashboard') ? 'page' : undefined}>
						Home
					</Link>
				</Button>
				<Button
					variant="ghost"
					className={cn('w-full justify-start', isActive('/app/profile') && 'bg-foreground/5')}
					asChild
				>
					<Link href="/app/profile" aria-current={isActive('/app/profile') ? 'page' : undefined}>
						Profile
					</Link>
				</Button>
			</nav>
			<div className="border-t border-foreground/10 p-4 mt-auto">
				<Button
					type="button"
					variant="outline"
					className="w-full justify-center gap-2 text-foreground/70 hover:text-foreground"
					onClick={handleLogout}
				>
					Logout
					<LogOut className="size-4" />
				</Button>
			</div>
		</aside>
	)
}
