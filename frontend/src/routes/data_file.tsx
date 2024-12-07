import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/data_file')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/data_file"!</div>
}
