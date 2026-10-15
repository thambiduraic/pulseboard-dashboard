import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DailyPoint {
  date: string
  label: string
  revenue: number
  customers: number
}

interface DistributionPoint {
  name: string
  value: number
  color: string
}

interface ProductPoint {
  name: string
  revenue: number
  subscribers: number
  color: string
}

export type ChartProps =
  | { variant: 'revenue'; data: DailyPoint[] }
  | { variant: 'distribution'; data: DistributionPoint[] }
  | { variant: 'analytics'; data: DailyPoint[] }
  | { variant: 'products'; data: ProductPoint[] }

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => <div key={entry.name}><i style={{ background: entry.color }} />{entry.name}: {entry.name === 'Customers' ? entry.value : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(entry.value)}</div>)}
    </div>
  )
}

export default function Charts(props: ChartProps) {
  if (props.variant === 'distribution') {
    const total = props.data.reduce((sum, entry) => sum + entry.value, 0)
    return (
      <div className="distribution-chart" role="img" aria-label={`Subscription distribution across ${props.data.length} plans`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={props.data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={91} paddingAngle={4} stroke="none">
              {props.data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(value) => [`${value} subscribers`, 'Active']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center"><strong>{total}</strong><span>subscribers</span></div>
      </div>
    )
  }

  if (props.variant === 'products') {
    return (
      <div className="chart-wrap product-chart" role="img" aria-label="Net revenue by product plan">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={props.data} layout="vertical" margin={{ top: 3, right: 15, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#eef0f5" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 10 }} tickFormatter={(value: number) => `$${value / 1000}k`} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={75} tick={{ fill: '#686f7e', fontSize: 11 }} />
            <Tooltip formatter={(value) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value)), 'Revenue']} />
            <Bar dataKey="revenue" name="Revenue" radius={[0, 5, 5, 0]} barSize={19}>
              {props.data.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (props.variant === 'analytics') {
    return (
      <div className="chart-wrap analytics-chart" role="img" aria-label="Daily revenue and new customer growth">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={props.data} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6558d3" stopOpacity={0.17} />
                <stop offset="100%" stopColor="#6558d3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f5" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} minTickGap={25} />
            <YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} tickFormatter={(value: number) => `$${value / 1000}k`} />
            <YAxis yAxisId="customers" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} />
            <Tooltip content={<TrendTooltip />} />
            <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#6558d3" strokeWidth={2.5} fill="url(#analyticsFill)" />
            <Area yAxisId="customers" type="monotone" dataKey="customers" name="Customers" stroke="#39a98b" strokeWidth={2} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="chart-wrap revenue-chart" role="img" aria-label="Net revenue trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={props.data} margin={{ top: 12, right: 7, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6558d3" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#6558d3" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#eef0f5" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} minTickGap={28} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} tickFormatter={(value: number) => `$${value / 1000}k`} />
          <Tooltip content={<TrendTooltip />} />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6558d3" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
