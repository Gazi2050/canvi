import { DashboardSidebar } from '@/components/custom/dashboard/DashboardSidebar'

export default function AppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen bg-background">
			<DashboardSidebar />
			<main className="flex-1 overflow-auto p-8">
				{children}
			</main>
		</div>
	)
}
