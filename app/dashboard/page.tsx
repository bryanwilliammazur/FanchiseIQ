import { Suspense } from 'react'
import { getTotalKPIs, getPortfolioSummary, getActiveAlerts, getDailyTrend, getAIInsights } from '@/lib/queries'
import Sidebar from '@/components/Sidebar'
import KPICard from '@/components/KPICard'
import BrandTable from '@/components/BrandTable'
import AIInsightsFeed from '@/components/AIInsightsFeed'
import AlertList from '@/components/AlertList'
import LiveTransactionFeed from '@/components/LiveTransactionFeed'
import RevenueChart from '@/components/RevenueChart'
import TopBar from '@/components/TopBar'
import Ticker from '@/components/Ticker'

export const revalidate = 300 // revalidate every 5 minutes

export default async function DashboardPage() {
  // Fetch all data in parallel — all from local Neon DB, fast
  const [kpis, portfolio, alerts, trend, insights] = await Promise.all([
    getTotalKPIs(30),
    getPortfolioSummary(30),
    getActiveAlerts(10),
    getDailyTrend(30),
    getAIInsights(5),
  ])

  const kpi = kpis as any
  const totalRevenue    = Number(kpi.total_revenue)
  const totalTxns       = Number(kpi.total_transactions)
  const avgCheck        = Number(kpi.avg_check)
  const foodCostPct     = Number(kpi.avg_food_cost_pct)
  const laborPct        = Number(kpi.avg_labor_pct)
  const vsPrior         = kpi.vs_last_period_pct

  const criticalAlerts  = (alerts as any[]).filter(a => a.severity === 'critical').length

  return (
    <div className="flex h-screen overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
      <Sidebar activePage="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title="Executive Dashboard"
          breadcrumb="Overview"
          alertCount={criticalAlerts}
        />

        <Ticker portfolio={portfolio as any[]} kpi={kpi} />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Primary KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <KPICard
              label="Total Revenue (30D)"
              value={`$${(totalRevenue / 1_000_000).toFixed(1)}M`}
              change={vsPrior}
              sub={`Across ${kpi.active_locations} locations`}
              accent="#ffb800"
              sparkType="up"
            />
            <KPICard
              label="Net Operating Profit"
              value={`$${((totalRevenue * 0.143) / 1_000_000).toFixed(1)}M`}
              change="+12.1"
              sub="14.3% margin · Target: 15%"
              accent="#00e096"
              sparkType="up"
            />
            <KPICard
              label="Avg Check Size"
              value={`$${avgCheck.toFixed(2)}`}
              change="+3.4"
              sub={`${(totalTxns / 1_000_000).toFixed(2)}M transactions`}
              accent="#00e5ff"
              sparkType="up"
            />
            <KPICard
              label="Food Cost %"
              value={`${foodCostPct.toFixed(1)}%`}
              change={foodCostPct > 31 ? `+${(foodCostPct - 30.5).toFixed(1)}` : undefined}
              changeDir={foodCostPct > 31 ? 'down' : 'up'}
              sub="Target: 30.5% · AI monitoring"
              accent="#ff4560"
              sparkType="volatile"
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-6 gap-2">
            {[
              { label: 'Labor %',         value: `${laborPct.toFixed(1)}%`,   warn: laborPct > 30 },
              { label: 'Drive-Thru Avg',  value: '3m 42s',                    warn: false },
              { label: 'Guest Score',     value: '4.1★',                       warn: false },
              { label: 'Waste %',         value: '2.8%',                       warn: false },
              { label: 'Open Positions',  value: '184',                        warn: true },
              { label: 'Catering Rev',    value: '$318K',                      warn: false },
            ].map(item => (
              <div key={item.label} className="kpi-card" style={{ padding: '14px 16px' }}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-2"
                  style={{ color: 'var(--text3)' }}>
                  {item.label}
                </div>
                <div className="font-syne font-extrabold text-xl"
                  style={{ color: item.warn ? 'var(--red)' : 'inherit' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main content row */}
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 360px' }}>
            {/* Revenue chart + brand table */}
            <div className="panel">
              <div className="panel-header">
                <span className="font-syne font-bold text-sm">Revenue by Brand · 30-Day Trend</span>
                <span className="badge-live">Live</span>
                <div className="ml-auto flex gap-2">
                  <button className="text-[10px] font-mono px-3 py-1 rounded border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    Export
                  </button>
                </div>
              </div>
              <div className="p-5">
                <RevenueChart data={trend as any[]} />
                <div className="mt-4 border-t" style={{ borderColor: 'var(--border)' }} />
                <BrandTable portfolio={portfolio as any[]} />
              </div>
            </div>

            {/* AI Insights */}
            <div className="panel">
              <div className="panel-header">
                <span className="font-syne font-bold text-sm">AI Insights</span>
                <span className="badge-ai">NeMo Claw</span>
              </div>
              <div className="p-3">
                <AIInsightsFeed insights={insights as any[]} />
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-3 gap-3">
            <AlertList alerts={alerts as any[]} />
            <LiveTransactionFeed />
            {/* Location summary */}
            <div className="panel">
              <div className="panel-header">
                <span className="font-syne font-bold text-sm">📍 Location Status</span>
              </div>
              <div className="p-4">
                <div className="rounded-lg mb-4 flex items-center justify-center flex-col gap-2"
                  style={{ height: 160, background: 'linear-gradient(135deg,#0a1628,#0d1e36)',
                    border: '1px solid var(--border)' }}>
                  <span className="text-3xl">🗺️</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text2)' }}>
                    300+ Locations · 12 States
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>
                    CA · AZ · NV · TX · FL · CO · WA · OR · UT · NM · ID · MT
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 284, label: 'Operating', color: 'var(--green)' },
                    { count: 14,  label: 'Remodeling', color: 'var(--gold)' },
                    { count: 8,   label: 'Opening Soon', color: 'var(--accent2)' },
                  ].map(item => (
                    <div key={item.label} className="text-center p-2 rounded-lg"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                      <div className="font-syne font-extrabold text-xl"
                        style={{ color: item.color }}>{item.count}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text3)' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
