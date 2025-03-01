"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Iridescence from "@/components/ui/iridescence"
import { Auth } from "@/api/auth"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

import logoImage from "@/assets/images/logo.png"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await Auth.login({ email, password })
      if (response.isSuccess) {
        toast.success("Login successful")
        navigate("/")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("An error occurred during login")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Iridescence
          color={[0.2, 0, 0.3]}
          speed={1}
          amplitude={0.2}
          mouseReact={true}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 p-6">
        <img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-8d" />
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div
          className="max-w-md w-full mx-auto rounded-2xl p-8 backdrop-blur-xl border border-white/20"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <h2 className="font-bold text-xl text-white">Login</h2>
          <p className="text-gray-300 text-sm max-w-sm mt-2">Welcome to our website.</p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label className="text-white" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="skibidi@fpt.edu.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label className="text-white" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </LabelInputContainer>
            <Button
              type="submit"
              className="w-full h-12 text-white text-base font-medium"
              style={{
                background: "linear-gradient(90deg, #4F0094, #920072)",
                border: "none",
                borderRadius: "8px",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-sm text-center text-gray-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 font-bold hover:text-purple-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

