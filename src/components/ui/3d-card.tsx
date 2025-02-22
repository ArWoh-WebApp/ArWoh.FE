"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

export const ThreeDCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateXFactor = 20
    const rotateYFactor = 20

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    setRotateX((mouseY / (rect.height / 2)) * -rotateXFactor)
    setRotateY((mouseX / (rect.width / 2)) * rotateYFactor)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotateX(0)
    setRotateY(0)
  }, [])

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.addEventListener("mousemove", handleMouseMove)
      currentRef.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", handleMouseMove)
        currentRef.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
    >
      {children}
    </motion.div>
  )
}

