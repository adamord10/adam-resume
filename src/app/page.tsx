import PortfolioApp from '@/components/PortfolioApp'
import { currentYm } from '@/lib/timeline'

export default function Home() {
  return <PortfolioApp nowYm={currentYm()} />
}
