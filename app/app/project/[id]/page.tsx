import { TldrawCanvas } from '@/components/custom/canvas/TldrawCanvas'

type ProjectCanvasPageProps = {
  params: {
    id: string
  }
}

export default function ProjectCanvasPage({ params }: ProjectCanvasPageProps) {
  // params.id is the publicId, e.g. d7fa0dad247842c
  // For now we just render the canvas; loading and persisting content will be added later.
  return <TldrawCanvas />
}

