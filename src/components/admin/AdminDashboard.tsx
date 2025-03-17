"use client"

import { useState } from "react"
import { BarChart3, Image, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<{ [key: string]: "stats" | "chart" }>({
    users: "stats",
    artworks: "stats",
  })

  const toggleView = (card: string) => {
    setActiveView((prev) => ({
      ...prev,
      [card]: prev[card] === "stats" ? "chart" : "stats",
    }))
  }

  return (
    <div className="min-h-screen w-full bg-zinc-900">
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <h1 className="text-xl font-semibold text-white">Art Gallery Admin Dashboard</h1>
      </div>
      <main className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card
            className="bg-zinc-800 border-zinc-700 cursor-pointer transition-all hover:bg-zinc-750 hover:shadow-lg relative overflow-hidden"
            onClick={() => toggleView("users")}
          >
            {/* Subtle indicator in corner */}
            <div className="absolute top-2 right-2 text-xs text-zinc-500">
              Click to {activeView.users === "stats" ? "view chart" : "view stats"}
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent className="min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeView.users === "stats" ? (
                  <motion.div
                    key="user-stats"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-white mb-2">1,248</div>
                    <p className="text-sm text-zinc-400 mb-3">Total registered users</p>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">850</div>
                        <p className="text-xs text-zinc-400">Regular Users</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">320</div>
                        <p className="text-xs text-zinc-400">Photographers</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">78</div>
                        <p className="text-xs text-zinc-400">Admins</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-green-400 font-medium">+12% from last month</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="user-chart"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-[180px]"
                  >
                    <UserTypePieChart />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            {/* Pulse effect on the border when in chart view */}
            {activeView.users === "chart" && (
              <div className="absolute inset-0 border border-blue-500/50 rounded-lg pointer-events-none">
                <motion.div
                  className="absolute inset-0 border border-blue-500 rounded-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
          </Card>

          <Card
            className="bg-zinc-800 border-zinc-700 cursor-pointer transition-all hover:bg-zinc-750 hover:shadow-lg relative overflow-hidden"
            onClick={() => toggleView("artworks")}
          >
            {/* Subtle indicator in corner */}
            <div className="absolute top-2 right-2 text-xs text-zinc-500">
              Click to {activeView.artworks === "stats" ? "view chart" : "view stats"}
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-100">Total Artworks</CardTitle>
              <Image className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent className="min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeView.artworks === "stats" ? (
                  <motion.div
                    key="artwork-stats"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-white mb-2">3,456</div>
                    <p className="text-sm text-zinc-400 mb-3">Total artworks in gallery</p>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">1,450</div>
                        <p className="text-xs text-zinc-400">Paintings</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">1,050</div>
                        <p className="text-xs text-zinc-400">Photography</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">956</div>
                        <p className="text-xs text-zinc-400">Other</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-green-400 font-medium">+8% from last month</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="artwork-chart"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-[180px]"
                  >
                    <ArtworkTypePieChart />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            {/* Pulse effect on the border when in chart view */}
            {activeView.artworks === "chart" && (
              <div className="absolute inset-0 border border-blue-500/50 rounded-lg pointer-events-none">
                <motion.div
                  className="absolute inset-0 border border-blue-500 rounded-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-zinc-100">Total Revenue</CardTitle>
                <CardDescription className="text-zinc-400">Revenue trends over the past year</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-white">$124,580</div>
                  <p className="text-xs text-zinc-400">+18% from last month</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-zinc-100">Yearly Projection</div>
                  <div className="text-lg font-semibold text-white">$1,495,000</div>
                </div>
              </div>
              <div className="h-[300px]">
                <RevenueDetailChart />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-zinc-100">Recent Sales</CardTitle>
              <CardDescription className="text-zinc-400">Latest 5 sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-100">{sale.customer}</p>
                      <p className="text-xs text-zinc-400">{sale.artwork}</p>
                    </div>
                    <div className="text-sm font-medium text-zinc-100">${sale.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Sample data for charts
const recentSales = [
  { customer: "John Doe", artwork: "Abstract Landscape", amount: 1200 },
  { customer: "Jane Smith", artwork: "Modern Portrait", amount: 850 },
  { customer: "Robert Johnson", artwork: "City Skyline", amount: 1500 },
  { customer: "Emily Davis", artwork: "Nature Scene", amount: 950 },
  { customer: "Michael Brown", artwork: "Surreal Composition", amount: 1100 },
]

function UserTypePieChart() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  const data = [
    { name: "Regular Users", value: 850, color: "#3b82f6" },
    { name: "Photographers", value: 320, color: "#8b5cf6" },
    { name: "Admins", value: 78, color: "#ec4899" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {data.map((item, i) => {
            const startAngle = i === 0 ? 0 : data.slice(0, i).reduce((sum, d) => sum + (d.value / total) * 360, 0)
            const endAngle = startAngle + (item.value / total) * 360

            const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            // Calculate midpoint angle for the tooltip position
            const midAngle = startAngle + (endAngle - startAngle) / 2
            const midX = 50 + 30 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const midY = 50 + 30 * Math.sin(((midAngle - 90) * Math.PI) / 180)

            // Calculate outer point for the indicator line
            const outerX = 50 + 45 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const outerY = 50 + 45 * Math.sin(((midAngle - 90) * Math.PI) / 180)

            return (
              <g key={item.name}>
                <motion.path
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    scale: hoveredSegment === i ? 1.05 : 1,
                    filter: hoveredSegment === i ? "brightness(1.2)" : "brightness(1)",
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.1,
                    scale: { duration: 0.2 },
                  }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ transformOrigin: "center" }}
                />

                {hoveredSegment === i && (
                  <g>
                    {/* Animated dot with percentage */}
                    <motion.circle
                      cx={midX}
                      cy={midY}
                      r="3"
                      fill="#fff"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Value display */}
                    <motion.text
                      x={midX + (midX > 50 ? 8 : -8)}
                      y={midY}
                      textAnchor={midX > 50 ? "start" : "end"}
                      fill="#fff"
                      fontSize="5"
                      fontWeight="bold"
                      alignmentBaseline="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {Math.round((item.value / total) * 100)}%
                    </motion.text>
                  </g>
                )}
              </g>
            )
          })}
          <circle cx="50" cy="50" r="25" fill="#1f2937" />
        </svg>
      </div>

      <div className="ml-4 space-y-2">
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            className="flex items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: hoveredSegment === i ? 1.1 : 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.4 + i * 0.1,
              scale: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSegment(i)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="h-3 w-3 rounded-full mr-2"
              style={{
                backgroundColor: item.color,
                boxShadow: hoveredSegment === i ? `0 0 8px ${item.color}` : "none",
              }}
            ></div>
            <div className="text-xs text-zinc-300">
              {item.name}: {item.value} ({Math.round((item.value / total) * 100)}%)
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ArtworkTypePieChart() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  const data = [
    { name: "Paintings", value: 1450, color: "#3b82f6" },
    { name: "Photography", value: 1050, color: "#8b5cf6" },
    { name: "Digital Art", value: 650, color: "#ec4899" },
    { name: "Sculptures", value: 306, color: "#f97316" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {data.map((item, i) => {
            const startAngle = i === 0 ? 0 : data.slice(0, i).reduce((sum, d) => sum + (d.value / total) * 360, 0)
            const endAngle = startAngle + (item.value / total) * 360

            const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            // Calculate midpoint angle for the tooltip position
            const midAngle = startAngle + (endAngle - startAngle) / 2
            const midX = 50 + 30 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const midY = 50 + 30 * Math.sin(((midAngle - 90) * Math.PI) / 180)

            // Calculate outer point for the indicator line
            const outerX = 50 + 45 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const outerY = 50 + 45 * Math.sin(((midAngle - 90) * Math.PI) / 180)

            return (
              <g key={item.name}>
                <motion.path
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    scale: hoveredSegment === i ? 1.05 : 1,
                    filter: hoveredSegment === i ? "brightness(1.2)" : "brightness(1)",
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.1,
                    scale: { duration: 0.2 },
                  }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ transformOrigin: "center" }}
                />

                {hoveredSegment === i && (
                  <g>
                    {/* Animated dot with percentage */}
                    <motion.circle
                      cx={midX}
                      cy={midY}
                      r="3"
                      fill="#fff"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Value display */}
                    <motion.text
                      x={midX + (midX > 50 ? 8 : -8)}
                      y={midY}
                      textAnchor={midX > 50 ? "start" : "end"}
                      fill="#fff"
                      fontSize="5"
                      fontWeight="bold"
                      alignmentBaseline="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {Math.round((item.value / total) * 100)}%
                    </motion.text>
                  </g>
                )}
              </g>
            )
          })}
          <circle cx="50" cy="50" r="25" fill="#1f2937" />
        </svg>
      </div>

      <div className="ml-4 space-y-2">
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            className="flex items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: hoveredSegment === i ? 1.1 : 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.4 + i * 0.1,
              scale: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSegment(i)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="h-3 w-3 rounded-full mr-2"
              style={{
                backgroundColor: item.color,
                boxShadow: hoveredSegment === i ? `0 0 8px ${item.color}` : "none",
              }}
            ></div>
            <div className="text-xs text-zinc-300">
              {item.name}: {item.value} ({Math.round((item.value / total) * 100)}%)
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function RevenueDetailChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const data = [
    { month: "Jan", revenue: 8500 },
    { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 10500 },
    { month: "Apr", revenue: 9800 },
    { month: "May", revenue: 11200 },
    { month: "Jun", revenue: 12500 },
    { month: "Jul", revenue: 13800 },
    { month: "Aug", revenue: 14200 },
    { month: "Sep", revenue: 13500 },
    { month: "Oct", revenue: 15000 },
    { month: "Nov", revenue: 16200 },
    { month: "Dec", revenue: 18500 },
  ]

  const maxRevenue = Math.max(...data.map((d) => d.revenue))
  const minRevenue = Math.min(...data.map((d) => d.revenue))

  const pathData = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 1200
      const y = 300 - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * 300
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const areaPathData = `
    ${pathData}
    L ${1200} ${300}
    L ${0} ${300}
    Z
  `

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full">
        <motion.div
          className="flex justify-between text-xs text-zinc-500 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span>${minRevenue}</span>
          <span>${maxRevenue}</span>
        </motion.div>
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <line x1="0" y1="0" x2="1200" y2="0" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="75" x2="1200" y2="75" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="150" x2="1200" y2="150" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="225" x2="1200" y2="225" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="300" x2="1200" y2="300" stroke="#374151" strokeWidth="1" />
            </motion.g>

            {/* Line chart */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Area under the line */}
            <motion.path
              d={areaPathData}
              fill="url(#gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 1200
              const y = 300 - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * 300
              return (
                <g key={i}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={hoveredPoint === i ? "6" : "4"}
                    fill={hoveredPoint === i ? "#fff" : "#3b82f6"}
                    stroke={hoveredPoint === i ? "#3b82f6" : "none"}
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: "pointer" }}
                  />

                  {hoveredPoint === i && (
                    <g>
                      <motion.rect
                        x={x - 35}
                        y={y - 35}
                        width="70"
                        height="25"
                        rx="4"
                        fill="#1f2937"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        initial={{ opacity: 0, y: y - 25 }}
                        animate={{ opacity: 1, y: y - 35 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.text
                        x={x}
                        y={y - 22}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="12"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        ${d.revenue.toLocaleString()}
                      </motion.text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <motion.div
          className="flex justify-between text-xs text-zinc-500 mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {data.map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.03 }}
              className={hoveredPoint === i ? "text-blue-400 font-medium" : ""}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: "pointer" }}
            >
              {d.month}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

