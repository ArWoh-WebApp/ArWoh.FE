"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import backgroundImage from "@/assets/images/login.png"
import logoImage from "@/assets/images/logo.png"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          position: "fixed",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 p-6">
        <img src={logoImage || "/placeholder.svg"} alt="ArtWoh" className="h-8" />
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div
          className="w-full max-w-[400px] p-8 rounded-2xl backdrop-blur-xl border border-white/20"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base text-white/90">WELCOME</h2>
              <h1 className="text-2xl font-semibold text-white">Login</h1>
              <p className="text-sm text-gray-400">Lorem ipsum is simply</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-white/50 data-[state=checked]:bg-custom-purple data-[state=checked]:border-custom-purple"
                  />
                  <label htmlFor="remember" className="text-sm text-white">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-white hover:text-custom-purple-light">
                  Forgot Password ?
                </a>
              </div>

              <Button
                className="w-full h-12 text-white text-base font-medium"
                style={{
                  background: "linear-gradient(to right, #8B2CF5, #9747FF)",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Login
              </Button>

              <div className="text-sm text-center text-gray-400">
                Don't have an Account ?{" "}
                <a href="/register" className="text-white font-bold hover:text-custom-purple-light">
                  Register
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

