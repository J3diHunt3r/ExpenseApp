import { createFileRoute } from '@tanstack/react-router'

//tanStack autosaves the correct route
export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return <div className="p-2">Dont know what ima put here yet</div>
}