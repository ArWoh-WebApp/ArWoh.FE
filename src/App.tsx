"use client"

import type React from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import { AnimatePresence } from "framer-motion"
import PageTransition from "./components/animations/PageTransition"
import ArtworkList from "./pages/ArtworkList"
import { CartProvider } from "./contexts/CartContext"
import { CartDrawer } from "./components/cart/CartDrawer"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/security/ProtectedRoute"
import UserPage from "./pages/UserPage"
import PhotographerPage from "./pages/PhotographerPage"
import { ToastProvider } from "./components/custom/sonner-provider"
import PortfolioPage from "./pages/PortfolioPage"
import PhotographerPublicPage from "./pages/PublicPhotographerPage"
import { useEffect } from "react"
import StoryOfArtPage from "./pages/StoryOfArtPage"
import { SecurityWrapper } from "./components/security/SecurityWrapper"
import PrintScreenProtection from "./components/security/PrintScreenProtection"
import PaymentSuccess from "./pages/PaymentSuccess"

// Define route patterns
const routePatterns = [
	"/",
	"/login",
	"/register",
	"/art-gallery",
	"/user-profile",
	"/photographer-profile",
	"/photographer/:id",
	"/portfolio",
	"/story-of-art",
	"/not-found",
	"/payment-success",
]

// Function to check if a path matches any of the route patterns
const isPathMatchingPattern = (path: string, patterns: string[]): boolean => {
	// Direct match
	if (patterns.includes(path)) return true

	// Check for pattern matches (like /photographer/:id)
	return patterns.some((pattern) => {
		if (!pattern.includes(":")) return false

		const patternParts = pattern.split("/")
		const pathParts = path.split("/")

		if (patternParts.length !== pathParts.length) return false

		return patternParts.every((part, index) => {
			// If it's a parameter part (starts with :), it matches any value
			if (part.startsWith(":")) return true
			// Otherwise, it should match exactly
			return part === pathParts[index]
		})
	})
}

const AppContent: React.FC = () => {
	const location = useLocation()
	const isValidRoute = isPathMatchingPattern(location.pathname, routePatterns)
	const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
	const showHeaderFooter = isValidRoute && !isAuthPage

	useEffect(() => {
		document.body.style.overflow = "auto"
		return () => {
			document.body.style.overflow = "auto"
		}
	}, [location.pathname])

	return (
		<SecurityWrapper>

			{/* PrintScreenProtection */}
			<PrintScreenProtection />

			<div className="flex min-h-screen flex-col">
				{showHeaderFooter && <Header />}
				<main className="flex-1">
					<AnimatePresence mode="wait" initial={false}>
						<Routes>
							{/* Public Routes */}
							<Route
								path="/"
								element={
									<PageTransition>
										<Home />
									</PageTransition>
								}
							/>
							<Route
								path="/login"
								element={
									<ProtectedRoute requireAuth={false}>
										<PageTransition>
											<Login />
										</PageTransition>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/register"
								element={
									<ProtectedRoute requireAuth={false}>
										<PageTransition>
											<Register />
										</PageTransition>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/art-gallery"
								element={
									<PageTransition>
										<ArtworkList />
									</PageTransition>
								}
							/>
							<Route
								path="/portfolio"
								element={
									<PageTransition>
										<PortfolioPage />
									</PageTransition>
								}
							/>
							<Route
								path="/story-of-art"
								element={
									<PageTransition>
										<StoryOfArtPage />
									</PageTransition>
								}
							/>
							<Route
								path="/photographer/:id"
								element={
									<PageTransition>
										<PhotographerPublicPage />
									</PageTransition>
								}
							/>
							<Route
								path="/payment-success"
								element={
									<PageTransition>
										<PaymentSuccess />
									</PageTransition>
								}
							/>
							{/* Protected Routes */}
							<Route
								path="/user-profile"
								element={
									<ProtectedRoute requireAuth={true} requirePhotographer={false} requireAdmin={false}>
										<PageTransition>
											<UserPage />
										</PageTransition>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/photographer-profile"
								element={
									<ProtectedRoute requireAuth={true} requirePhotographer={true} requireAdmin={false}>
										<PageTransition>
											<PhotographerPage />
										</PageTransition>
									</ProtectedRoute>
								}
							/>

							{/* 404 Page */}
							<Route
								path="*"
								element={
									<PageTransition>
										<NotFound />
									</PageTransition>
								}
							/>
						</Routes>
					</AnimatePresence>
				</main>
				{showHeaderFooter && <Footer />}
			</div>
		</SecurityWrapper>
	)
}

const App: React.FC = () => {
	return (
		<Router>
			<AuthProvider>
				<CartProvider>
					<AppContent />
					<CartDrawer />
					<ToastProvider />
				</CartProvider>
			</AuthProvider>
		</Router>
	)
}

export default App