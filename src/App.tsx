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
import { Toaster } from "./components/ui/sonner"
import { CartProvider } from "./contexts/CartContext"
import { CartDrawer } from "./components/cart/CartDrawer"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/security/ProtectedRoute"
import UserPage from "./pages/UserPage"
import PhotographerPage from "./pages/PhotographerPage"

// Define valid routes
const validRoutes = ["/", "/login", "/register", "/art-gallery", "/user-profile", "/photographer-profile", "/not-found"]

const AppContent: React.FC = () => {
	const location = useLocation()
	const isValidRoute = validRoutes.includes(location.pathname)
	const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
	const showHeaderFooter = isValidRoute && !isAuthPage

	return (
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
	)
}

const App: React.FC = () => {
	return (
		<Router>
			<AuthProvider>
				<CartProvider>
					<AppContent />
					<CartDrawer />
					<Toaster />
				</CartProvider>
			</AuthProvider>
		</Router>
	)
}

export default App

