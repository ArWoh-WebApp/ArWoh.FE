import DOMPurify from "dompurify"

interface RichTextContentProps {
    html: string | null
    className?: string
}

export function RichTextContent({ html, className = "" }: RichTextContentProps) {
    if (!html) return null

    const sanitizedHtml = DOMPurify.sanitize(html)

    return (
        <div className={`prose prose-invert max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    )
}

