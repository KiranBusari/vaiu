import dynamic from 'next/dynamic'
import { DashboardSkeleton } from './analytics-client-page';

const AnalyticsDashboard = dynamic(
  () => import('./analytics-client-page'),
  { ssr: false, loading: () => <DashboardSkeleton /> }
)

export default function Page() {
  return <AnalyticsDashboard />
}