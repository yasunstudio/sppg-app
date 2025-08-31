import { Metadata } from 'next'
import PerformanceDashboard from '@/components/dashboard/performance-dashboard'

export const metadata: Metadata = {
  title: 'Performance Dashboard',
  description: 'Real-time system performance monitoring and analytics',
}

export default function PerformancePage() {
  return <PerformanceDashboard />
}
