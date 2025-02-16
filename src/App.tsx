import type React from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import Header from "./components/Header"
//import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Footer from "./components/Footer"
import Home from "./pages/Home"

// Define valid routes
const validRoutes = [
	"/",
	"/login",
	"/register",
	"/not-found",
]

const AppContent: React.FC = () => {
	const location = useLocation()
	const isValidRoute = validRoutes.includes(location.pathname)
	const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
	const showHeaderFooter = isValidRoute && !isAuthPage

	return (
		<div className="min-h-screen flex flex-col">
			{showHeaderFooter && <Header />}
			<main className="flex-1">
					<Routes location={location}>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						{/* Protected routes */}

						{/* 404 Page*/}
						<Route path="*" element={<NotFound />} />
					</Routes>
			</main>
			{showHeaderFooter && <Footer/>}
		</div>
	)
}

const App: React.FC = () => {
	return (
		<Router>
			<AppContent />
		</Router>
	)
}

export default App

