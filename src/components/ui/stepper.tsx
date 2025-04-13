"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: {
        id: string | number
        label: string
        description?: string
        icon?: React.ReactNode
        completed?: boolean
        active?: boolean
        disabled?: boolean
    }[]
    activeStep: number
    orientation?: "horizontal" | "vertical"
    variant?: "default" | "circles" | "dots"
    size?: "default" | "sm" | "lg"
    colorScheme?: "default" | "blue" | "green" | "purple" | "cyan"
}

export function Stepper({
    steps,
    activeStep,
    orientation = "horizontal",
    variant = "default",
    size = "default",
    colorScheme = "default",
    className,
    ...props
}: StepperProps) {
    // Get color scheme classes
    const getColorClasses = (isActive: boolean, isCompleted: boolean) => {
        const colorMap = {
            default: {
                active: "bg-white text-black",
                completed: "bg-white text-black",
                connector: "bg-white",
            },
            blue: {
                active: "bg-blue-500 text-white",
                completed: "bg-blue-500 text-white",
                connector: "bg-blue-500",
            },
            green: {
                active: "bg-green-500 text-white",
                completed: "bg-green-500 text-white",
                connector: "bg-green-500",
            },
            purple: {
                active: "bg-purple-500 text-white",
                completed: "bg-purple-500 text-white",
                connector: "bg-purple-500",
            },
            cyan: {
                active: "bg-cyan-500 text-white",
                completed: "bg-cyan-500 text-white",
                connector: "bg-cyan-500",
            },
        }

        if (isCompleted) return colorMap[colorScheme].completed
        if (isActive) return colorMap[colorScheme].active
        return "bg-gray-700 text-white/60"
    }

    const getConnectorColorClass = (isCompleted: boolean) => {
        const colorMap = {
            default: "bg-white",
            blue: "bg-blue-500",
            green: "bg-green-500",
            purple: "bg-purple-500",
            cyan: "bg-cyan-500",
        }

        return isCompleted ? colorMap[colorScheme] : "bg-gray-700"
    }

    // Get size classes
    const getSizeClasses = () => {
        const sizeMap = {
            sm: {
                step: "w-6 h-6 text-xs",
                connector: "h-0.5",
                verticalConnector: "w-0.5",
                verticalStep: "h-6",
                label: "text-xs",
                description: "text-xs",
            },
            default: {
                step: "w-8 h-8 text-sm",
                connector: "h-1",
                verticalConnector: "w-1",
                verticalStep: "h-8",
                label: "text-sm",
                description: "text-xs",
            },
            lg: {
                step: "w-10 h-10 text-base",
                connector: "h-1.5",
                verticalConnector: "w-1.5",
                verticalStep: "h-10",
                label: "text-base",
                description: "text-sm",
            },
        }

        return sizeMap[size]
    }

    const sizeClasses = getSizeClasses()

    return (
        <div
            className={cn("flex", orientation === "horizontal" ? "flex-row items-center" : "flex-col items-start", className)}
            {...props}
        >
            {steps.map((step, index) => {
                const isActive = index === activeStep
                const isCompleted = index < activeStep
                const isLast = index === steps.length - 1
                const colorClass = getColorClasses(isActive, isCompleted)
                const connectorColorClass = getConnectorColorClass(isCompleted)

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={cn("flex", orientation === "horizontal" ? "flex-col items-center" : "flex-row items-start")}
                        >
                            {/* Step indicator */}
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full transition-colors",
                                    colorClass,
                                    sizeClasses.step,
                                    step.disabled && "opacity-50 cursor-not-allowed",
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : step.icon || (variant === "default" ? index + 1 : "")}
                            </div>

                            {/* Step label and description */}
                            {(step.label || step.description) && (
                                <div className={cn("flex flex-col", orientation === "horizontal" ? "items-center mt-2" : "ml-3")}>
                                    {step.label && (
                                        <span
                                            className={cn(
                                                sizeClasses.label,
                                                "font-medium",
                                                isActive || isCompleted ? "text-white" : "text-white/60",
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    )}
                                    {step.description && (
                                        <span className={cn(sizeClasses.description, "text-white/60", isActive && "text-white/80")}>
                                            {step.description}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Connector */}
                        {!isLast && (
                            <div
                                className={cn(
                                    "flex-1 transition-colors",
                                    orientation === "horizontal"
                                        ? cn("mx-2", sizeClasses.connector)
                                        : cn("my-2 ml-4", sizeClasses.verticalConnector, sizeClasses.verticalStep),
                                    connectorColorClass,
                                )}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
