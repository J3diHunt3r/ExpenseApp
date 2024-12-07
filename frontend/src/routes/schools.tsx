import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import CsvUploadTable from '@/components/CsvUploadTableComponent'

export const Route = createFileRoute('/schools')({
  component: RouteComponent,
})
// this page should initialize with all schools data combined and always update based on new schools added etc
function RouteComponent() {
  return <div> <CsvUploadTable /></div>
}
