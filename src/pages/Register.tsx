"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Iridescence from "@/components/ui/iridescence"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Auth } from "@/api/auth"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"

import logoImage from "@/assets/images/logo.png"

export default function RegisterPage() {
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle role selection
  const handleRoleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!formData.role) {
      toast.error("Please select a role")
      return
    }

    setIsLoading(true)

    try {
      const payload: Auth.RegisterPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }

      let response: Auth.RegisterResponse

      // Call different APIs based on role
      if (formData.role.toLowerCase() === "customer") {
        response = await Auth.registerCustomer(payload)
      } else {
        response = await Auth.registerPhotographer(payload)
      }

      if (response.isSuccess) {
        toast.success("Registration successful!")
        // Redirect to login page after successful registration
        navigate("/login")
      } else {
        toast.error(response.message || "Registration failed")
      }
    } catch (error) {
      toast.error("An error occurred during registration")
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Iridescence color={[0.2, 0, 0.3]} speed={0.7} amplitude={0.2} mouseReact={true} />
      </div>

      {/* Logo */}
      <div className="relative z-10 p-6">
        <img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-8d" />
      </div>

      {/* Register Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div
          className="max-w-md w-full mx-auto rounded-2xl p-8 backdrop-blur-xl border border-white/20"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <h2 className="font-bold text-xl text-white">Register</h2>
          <p className="text-gray-300 text-sm max-w-sm mt-2">Create your account.</p>

          <form className="my-8" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label className="text-white" htmlFor="username">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label className="text-white" htmlFor="role">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={handleRoleSelect}>
                  <SelectTrigger
                    id="role"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-10"
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label className="text-white" htmlFor="email">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                  type={showPassword1 ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label className="text-white" htmlFor="confirmPassword">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword2 ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
          <div className="text-sm text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-bold hover:text-purple-500">
              Login
            </Link>
          </div>
          <div className="mt-8 text-xs text-center text-gray-400">
            By registering, you agree to our{" "}
            <a href="/terms" className="text-purple-600 hover:text-purple-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </a>
            .
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

