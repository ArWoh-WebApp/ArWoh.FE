"use client"

import type React from "react"
import { useState, useCallback, memo, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Iridescence from "@/components/ui/iridescence"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Auth } from "@/api/auth"
import { UserService } from "@/api/user"
import { toast } from "sonner"

import logoImage from "@/assets/images/logo.png"

// Memoized Iridescence with frozen props to prevent re-renders
const MemoizedIridescence = memo(Iridescence, () => true) // Force the component to never re-render

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  
  // Use refs instead of state for form fields to prevent re-renders during typing
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Get values from refs at submit time rather than tracking with state
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""

    try {
      // First, attempt to login
      const loginResponse = await Auth.login({ email, password })

      if (loginResponse.isSuccess) {
        // If login is successful, fetch the user profile directly
        const userProfileResponse = await UserService.getUserProfile()

        if (userProfileResponse.isSuccess) {
          const userData = userProfileResponse.data

          // Call the login function from context to update the global state
          await login(email, password)

          // Redirect based on the user role from the response
          if (userData.role === "Admin") {
            navigate("/admin")
          } else if (userData.role === "Photographer") {
            navigate("/photographer-profile")
          } else {
            navigate("/user-profile")
          }

          toast.success("Login successful")
        } else {
          toast.error("Failed to fetch user profile")
        }
      } else {
        toast.error(loginResponse.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
      {/* Animated Background - Rendered only once and never re-rendered */}
      <div className="absolute inset-0">
        <MemoizedIridescence 
          color={[0.2, 0, 0.3]}
          speed={1} 
          amplitude={0.1} 
          mouseReact={false} 
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 p-6">
        <img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-8" />
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
                ref={emailRef}
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
                  ref={passwordRef}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
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

const LabelInputContainer = memo(({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
})