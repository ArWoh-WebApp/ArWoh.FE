"use client"

import { useState, useEffect } from "react"
import { BarChart3, Image, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { fetchUserSummary, fetchImageSummary, fetchRevenueSummary, UserSummaryDTO, ImageSummaryDTO, RevenueSummaryDTO } from "@/api/dashboard" 

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<{ [key: string]: "stats" | "chart" }>({
    users: "stats",
    artworks: "stats",
  })
  const [userSummary, setUserSummary] = useState<UserSummaryDTO | null>(null)
  const [imageSummary, setImageSummary] = useState<ImageSummaryDTO | null>(null)
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummaryDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toggleView = (card: string) => {
    setActiveView((prev) => ({
      ...prev,
      [card]: prev[card] === "stats" ? "chart" : "stats",
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [userRes, imageRes, revenueRes] = await Promise.all([
          fetchUserSummary(),
          fetchImageSummary(),
          fetchRevenueSummary(),
        ])

        if (!userRes.isSuccess) throw new Error(userRes.message)
        if (!imageRes.isSuccess) throw new Error(imageRes.message)
        if (!revenueRes.isSuccess) throw new Error(revenueRes.message)

        setUserSummary(userRes.data)
        setImageSummary(imageRes.data)
        setRevenueSummary(revenueRes.data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-zinc-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-900 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
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
                    <div className="text-4xl font-bold text-white mb-2">
                      {userSummary?.totalUsers.toLocaleString()}
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">Total registered users</p>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">
                          {userSummary?.userCount.toLocaleString()}
                        </div>
                        <p className="text-xs text-zinc-400">Regular Users</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">
                          {userSummary?.photographerCount.toLocaleString()}
                        </div>
                        <p className="text-xs text-zinc-400">Photographers</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-white">
                          {userSummary?.adminCount.toLocaleString()}
                        </div>
                        <p className="text-xs text-zinc-400">Admins</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-green-400 font-medium">All users from system</div>
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
                    <UserTypePieChart
                      data={{
                        regularUsers: userSummary?.userCount || 0,
                        photographers: userSummary?.photographerCount || 0,
                        admins: userSummary?.adminCount || 0,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            {activeView.users === "chart" && (
              <div className="absolute inset-0 border border-blue-500/50 rounded-lg pointer-events-none">
                <motion.div
                  className="absolute inset-0 border border-blue-500 rounded-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
              </div>
            )}
          </Card>

          <Card
            className="bg-zinc-800 border-zinc-700 cursor-pointer transition-all hover:bg-zinc-750 hover:shadow-lg relative overflow-hidden"
            onClick={() => toggleView("artworks")}
          >
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
                    <div className="text-4xl font-bold text-white mb-2">
                      {imageSummary?.totalImages.toLocaleString()}
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">Total artworks in gallery</p>
                    <div className="flex justify-center space-x-6 mt-4">
                      {Object.entries(imageSummary?.imageOrientations || {}).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-xl font-semibold text-white">{value.toLocaleString()}</div>
                          <p className="text-xs text-zinc-400">{key}</p>
                        </div>
                      ))}
                      {(() => {
                        const orientationsSum = Object.values(imageSummary?.imageOrientations || {}).reduce((sum, val) => sum + val, 0);
                        const otherCount = (imageSummary?.totalImages || 0) - orientationsSum;
                        return otherCount > 0 ? (
                          <div className="text-center">
                            <div className="text-xl font-semibold text-white">{otherCount.toLocaleString()}</div>
                            <p className="text-xs text-zinc-400">Other</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div className="mt-4 text-xs text-green-400 font-medium">All artworks from system</div>
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
                    <ArtworkTypePieChart orientations={imageSummary?.imageOrientations || {}} totalImages={imageSummary?.totalImages || 0} />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            {activeView.artworks === "chart" && (
              <div className="absolute inset-0 border border-blue-500/50 rounded-lg pointer-events-none">
                <motion.div
                  className="absolute inset-0 border border-blue-500 rounded-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
              </div>
            )}
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <Card className="bg-zinc-800 border-zinc-700">
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
                  <div className="text-2xl font-bold text-white">
                    ${(revenueSummary?.totalRevenue ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-400">Earn this month</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-zinc-100">Yearly Projection</div>
                  <div className="text-lg font-semibold text-white">
                    ${((revenueSummary?.totalRevenue ?? 0) * 12).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <RevenueDetailChart monthlyRevenue={revenueSummary?.monthlyRevenue || {}} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function UserTypePieChart({ data }: { data: { regularUsers: number; photographers: number; admins: number } }) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  const chartData = [
    { name: "Regular Users", value: data.regularUsers, color: "#3b82f6" },
    { name: "Photographers", value: data.photographers, color: "#8b5cf6" },
    { name: "Admins", value: data.admins, color: "#ec4899" },
  ]

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {chartData.map((item, i) => {
            const startAngle = i === 0 ? 0 : chartData.slice(0, i).reduce((sum, d) => sum + (d.value / total) * 360, 0)
            const endAngle = startAngle + (item.value / total) * 360

            const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            const midAngle = startAngle + (endAngle - startAngle) / 2
            const midX = 50 + 30 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const midY = 50 + 30 * Math.sin(((midAngle - 90) * Math.PI) / 180)

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
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, scale: { duration: 0.2 } }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ transformOrigin: "center" }}
                />
                {hoveredSegment === i && (
                  <g>
                    <motion.circle
                      cx={midX}
                      cy={midY}
                      r="3"
                      fill="#fff"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />
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
        {chartData.map((item, i) => (
          <motion.div
            key={item.name}
            className="flex items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, scale: hoveredSegment === i ? 1.1 : 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1, scale: { duration: 0.2 } }}
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
              {item.name}: {item.value.toLocaleString()} ({Math.round((item.value / total) * 100)}%)
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ArtworkTypePieChart({ orientations, totalImages }: { orientations: { [key: string]: number }; totalImages: number }) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  const orientationsSum = Object.values(orientations).reduce((sum, val) => sum + val, 0)

  const otherCount = totalImages - orientationsSum


  const chartData = [
    ...Object.entries(orientations).map(([name, value], i) => ({
      name,
      value,
      color: ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316"][i % 4],
    })),
    ...(otherCount > 0 ? [{ name: "Other", value: otherCount, color: "#f97316" }] : []),
  ]

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {chartData.map((item, i) => {
            const startAngle = i === 0 ? 0 : chartData.slice(0, i).reduce((sum, d) => sum + (d.value / total) * 360, 0)
            const endAngle = startAngle + (item.value / total) * 360

            const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            const midAngle = startAngle + (endAngle - startAngle) / 2
            const midX = 50 + 30 * Math.cos(((midAngle - 90) * Math.PI) / 180)
            const midY = 50 + 30 * Math.sin(((midAngle - 90) * Math.PI) / 180)

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
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, scale: { duration: 0.2 } }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ transformOrigin: "center" }}
                />
                {hoveredSegment === i && (
                  <g>
                    <motion.circle
                      cx={midX}
                      cy={midY}
                      r="3"
                      fill="#fff"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />
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
        {chartData.map((item, i) => (
          <motion.div
            key={item.name}
            className="flex items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, scale: hoveredSegment === i ? 1.1 : 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1, scale: { duration: 0.2 } }}
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
              {item.name}: {item.value.toLocaleString()} ({Math.round((item.value / total) * 100)}%)
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function RevenueDetailChart({ monthlyRevenue }: { monthlyRevenue: { [key: string]: number } }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const data = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }))
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 0)
  const minRevenue = Math.min(...data.map((d) => d.revenue), 0)

  let pathData = ""
  let areaPathData = ""
  if (data.length === 0) {
    pathData = "M 0 300 L 1200 300"
    areaPathData = "M 0 300 L 1200 300 L 1200 300 L 0 300 Z"
  } else if (data.length === 1) {
    const y = maxRevenue === minRevenue ? 150 : 300 - ((data[0].revenue - minRevenue) / (maxRevenue - minRevenue)) * 300
    pathData = `M 0 ${y} L 1200 ${y}`
    areaPathData = `M 0 ${y} L 1200 ${y} L 1200 300 L 0 300 Z`
  } else {
    pathData = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 1200
        const y = maxRevenue === minRevenue ? 150 : 300 - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * 300
        return `${i === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")
    areaPathData = `${pathData} L 1200 300 L 0 300 Z`
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full">
        <motion.div
          className="flex justify-between text-xs text-zinc-500 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span>${minRevenue.toLocaleString()}</span>
          <span>${maxRevenue.toLocaleString()}</span>
        </motion.div>
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <line x1="0" y1="0" x2="1200" y2="0" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="75" x2="1200" y2="75" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="150" x2="1200" y2="150" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="225" x2="1200" y2="225" stroke="#374151" strokeWidth="1" />
              <line x1="0" y1="300" x2="1200" y2="300" stroke="#374151" strokeWidth="1" />
            </motion.g>
            <motion.path
              d={pathData}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d={areaPathData}
              fill="url(#gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            {data.length > 0 &&
              data.map((d, i) => {
                const x = data.length === 1 ? 600 : (i / (data.length - 1)) * 1200
                const y = maxRevenue === minRevenue ? 150 : 300 - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * 300
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
                      animate={{ scale: 1, opacity: 1 }}
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
          {data.length > 0 ? (
            data.map((d, i) => (
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
            ))
          ) : (
            <span>No data available</span>
          )}
        </motion.div>
      </div>
    </div>
  )
}