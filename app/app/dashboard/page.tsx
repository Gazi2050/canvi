import { DashboardSidebar } from '../../components/DashboardSidebar'
import { ProjectsList } from '../../components/ProjectsList'

export default function DashboardPage() {
	return (
		<div className="flex min-h-screen bg-background">
			<DashboardSidebar />
			<main className="flex-1 overflow-auto p-8">
				<ProjectsList />
			</main>
		</div>
	)
}
