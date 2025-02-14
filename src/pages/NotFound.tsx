import type React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

import notFoundImage from "@/assets/images/notFound.png"

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <span className="text-xl text-muted-foreground">404</span>
            <h1 className="text-4xl font-bold text-[#1e1b4b] font-yeseva">Page not found</h1>
            <p className="text-xl text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. Please check the URL or navigate back home.
            </p>
            <div className="flex gap-4">
              <Button 
                asChild
                className="bg-blue-600 hover:bg-blue-700">
                <Link to="/">Go back home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact support</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={notFoundImage}
              alt="404 Illustration"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NotFound

