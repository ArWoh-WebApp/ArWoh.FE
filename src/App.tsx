import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"

const AppContent: React.FC = () => {

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
					<Routes location={location}>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						{/* 404 Page*/}
						<Route path="*" element={<NotFound />} />
					</Routes>
			</main>
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

