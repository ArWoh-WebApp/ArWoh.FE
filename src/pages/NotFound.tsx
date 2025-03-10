/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import FuzzyText from "@/components/ui/fuzzy-text"
import DigitalRain from "@/components/ui/digital-rain"
import CircuitBoard from "@/components/ui/circuit-board"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const navigate = useNavigate()
  const [hoverIntensity, setHoverIntensity] = useState(0.7)
  const [enableHover, setEnableHover] = useState(true)

  // Randomly change the hover intensity for a glitchy effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHoverIntensity(0.3 + Math.random() * 0.5)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background blur overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-[2px]"></div>

      {/* Digital Rain background - using white color with low opacity */}
      <div className="absolute inset-0 z-0 opacity-30">
        <DigitalRain color="rgba(255, 255, 255, 0.4)" speed={0.8} density={0.03} />
      </div>

      {/* Circuit Board overlay - using white color with low opacity */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <CircuitBoard color="rgba(255, 255, 255, 0.5)" density={0.3} />
      </div>

      {/* Glitch overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay"></div>

      {/* Content */}
      <div className="z-[5] flex flex-col items-center justify-center px-4 text-center">
        {/* Fuzzy 404 text */}
        <div className="mb-4 flex justify-center">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={hoverIntensity}
            enableHover={enableHover}
            fontSize="clamp(6rem, 20vw, 20rem)"
            fontWeight={900}
            color="#ffffff"
          >
            404
          </FuzzyText>
        </div>

        {/* Subtitle with glitch effect */}
        <motion.h2
          className="mb-8 text-2xl font-bold text-white/80 md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mb-8 max-w-md text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The page you're looking for doesn't exist or has been moved to another dimension.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-white px-6 py-2 text-black transition-all hover:bg-gray-200 hover:shadow-lg"
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-black text-white border-white/20 px-6 transition-all"
          >
            Go Back
          </Button>
        </motion.div>
      </div>

      {/* Tech-inspired decorative elements - changed to white */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-[3] h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
      <div className="pointer-events-none absolute right-0 top-0 z-[3] h-full w-[2px] bg-gradient-to-b from-transparent via-white to-transparent opacity-30"></div>
    </div>
  )
}

