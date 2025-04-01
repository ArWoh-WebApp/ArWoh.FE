/**
 * Enhanced security utilities to help protect content
 */

// Function to detect if developer tools are open with multiple methods
export const isDevToolsOpen = (): boolean => {
    // Method 1: Check window dimensions (most reliable)
    const widthThreshold = window.outerWidth - window.innerWidth > 160
    const heightThreshold = window.outerHeight - window.innerHeight > 160

    if (widthThreshold || heightThreshold) {
        return true
    }

    // Method 2: Check for debugger
    const devToolsDetected = (): boolean => {
        let devtools = false
        const handler = {
            get: () => {
                devtools = true
                return ""
            },
        }

        // This creates a trap that will be triggered if dev tools are open
        const testObject = Object.create(handler)
        testObject.__proto__ = handler

        console.log("%c", testObject)

        return devtools
    }

    // // Method 3: Check for Firebug
    // const isFirebugEnabled = (): boolean => {
    //     return !!window.console.
    // }

    // Method 4: Performance timing difference
    const hasDevToolsTimingIssue = (): boolean => {
        const start = performance.now()
        // Run a debug statement that takes longer when dev tools are open
        for (let i = 0; i < 1000; i++) {
            console.debug(i)
        }
        const end = performance.now()
        // If it took suspiciously long, dev tools might be open
        return (end - start) > 100
    }

    return devToolsDetected() || hasDevToolsTimingIssue()
}

// Function to disable common keyboard shortcuts with improved capture
export const disableKeyboardShortcuts = (event: KeyboardEvent): boolean => {
    // Capture screenshot-related shortcuts
    if (
        event.key === "PrintScreen" ||
        event.code === "PrintScreen" ||
        // Win+Shift+S in Windows
        (event.shiftKey && (event.metaKey || event.ctrlKey || event.getModifierState("Meta") || event.getModifierState("OS")) && (event.key === "s" || event.key === "S")) ||
        // Command+Shift+3 or Command+Shift+4 in macOS
        (event.shiftKey && event.metaKey && (event.key === "3" || event.key === "4" || event.key === "$"))
    ) {
        event.preventDefault()
        event.stopPropagation()
        return true
    }

    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
    if (
        event.key === "F12" ||
        (event.ctrlKey &&
            event.shiftKey &&
            (event.key === "I" || event.key === "i" || event.key === "J" || event.key === "j")) ||
        (event.ctrlKey &&
            (event.key === "U" ||
                event.key === "u" ||
                event.key === "S" ||
                event.key === "s" ||
                event.key === "P" ||
                event.key === "p"))
    ) {
        event.preventDefault()
        event.stopPropagation()
        return true
    }

    return false
}

// Function to add a watermark to an image with improved patterns
export const addWatermark = (canvas: HTMLCanvasElement, text = "Protected", opacity = 0.15): void => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // First watermark layer
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.font = "14px Arial"
    ctx.fillStyle = "white"
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(-Math.PI / 6)

    // Create repeating watermark pattern
    for (let i = -canvas.height; i < canvas.height * 2; i += 30) {
        for (let j = -canvas.width; j < canvas.width * 2; j += 150) {
            ctx.fillText(text, j, i)
        }
    }
    ctx.restore()

    // Second watermark layer with different angle
    ctx.save()
    ctx.globalAlpha = opacity * 0.7
    ctx.font = "10px Arial"
    ctx.fillStyle = "white"
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(Math.PI / 4)

    // Create second repeating watermark pattern with offset
    for (let i = -canvas.height; i < canvas.height * 2; i += 40) {
        for (let j = -canvas.width; j < canvas.width * 2; j += 130) {
            ctx.fillText(text, j, i)
        }
    }
    ctx.restore()
}

// Function to add noise to an image to disrupt OCR and image processing
export const addImageNoise = (canvas: HTMLCanvasElement, intensity = 5): void => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Add structured noise patterns that are hard to remove
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.width
        const y = Math.floor((i / 4) / canvas.width)

        // Create a complex pattern that varies by position
        if ((x + y) % 7 === 0 || (x * y) % 13 === 1) {
            data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() * intensity * 2 - intensity)))
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() * intensity * 2 - intensity)))
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() * intensity * 2 - intensity)))
        }
    }

    ctx.putImageData(imageData, 0, 0)
}

// Function to create dynamic CSS that helps prevent clean screenshots
export const injectAntiScreenshotCSS = (): HTMLStyleElement => {
    const style = document.createElement("style")
    style.innerHTML = `
    /* Base protections */
    img, video, canvas {
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      pointer-events: none !important;
    }
    
    /* Reveal watermark on screenshot */
    @media print, screen and (-webkit-min-device-pixel-ratio:0) and (min-resolution:.001dpcm) {
      .screenshot-reveal {
        opacity: 0.3 !important;
      }
    }
    
    /* Prevent image capture */
    img, canvas, video {
      filter: drop-shadow(0 0 0 rgba(0,0,0,0.001));
      transform: translateZ(0);
    }
    
    /* Hide elements during system screenshots - may not work in all browsers but worth trying */
    @media (color-gamut: rec2020) {
      .screenshot-protected {
        filter: blur(10px) !important;
        transition: none !important;
      }
    }
    `
    document.head.appendChild(style)
    return style
}

// Helper function to blur images temporarily (useful for screenshot detection)
export const blurImagesTemporarily = (durationMs = 1000): void => {
    const images = document.querySelectorAll('img, canvas')
    const originalFilters: string[] = []

    // Store original filters and apply blur
    images.forEach((img, index) => {
        const element = img as HTMLElement
        originalFilters[index] = element.style.filter
        element.style.filter = 'blur(10px)'
    })

    // Restore original filters after duration
    setTimeout(() => {
        images.forEach((img, index) => {
            const element = img as HTMLElement
            element.style.filter = originalFilters[index]
        })
    }, durationMs)
}