"use client"

import { motion } from "framer-motion"
import { Box, Palette, CreditCard } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function FeaturesSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const features = [
        {
            icon: <Box className="w-12 h-12" />,
            title: "Simple Steps to Purchase Your Artwork",
            description: "Browse our extensive collection and find what resonates with you.",
        },
        {
            icon: <Palette className="w-12 h-12" />,
            title: "Experience Artwork Like Never Before",
            description: "Our 3D mockups allow you to see how the artwork will look in your space.",
        },
        {
            icon: <CreditCard className="w-12 h-12" />,
            title: "Seamless Checkout for Your Convenience",
            description: "Once you've made your choice, our streamlined checkout process makes purchasing a breeze.",
        },
    ]

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-purple-950/30"></div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <motion.div
                    className="space-y-6 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.p
                        className="text-sm text-purple-400"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Explore
                    </motion.p>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Discover Your Perfect Artwork with Ease
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 max-w-3xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Selecting and purchasing artwork has never been easier. With our innovative 3D mockup feature, you can
                        visualize your chosen pieces in real-time before making a decision.
                    </motion.p>
                </motion.div>

                <motion.div
                    ref={ref}
                    className="grid md:grid-cols-3 gap-12 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
                                borderColor: "rgba(139, 92, 246, 0.3)",
                            }}
                        >
                            <motion.div
                                className="text-purple-500"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Buy
                    </motion.button>
                    <motion.button
                        className="px-6 py-2 border border-purple-600 rounded-full text-white hover:bg-purple-600/10 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

