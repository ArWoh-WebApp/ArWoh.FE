"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, LinkIcon, ImageIcon, Heading, Undo, Redo } from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-purple-400 underline underline-offset-2 hover:text-purple-300",
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="rich-text-editor rounded-md border border-white/10 bg-black/20 overflow-hidden">
            <div className="flex flex-wrap gap-1 p-1 border-b border-white/10 bg-black/30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-white/10" : ""}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-white/10" : ""}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-white/10" : ""}
                    type="button"
                >
                    <Heading className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-white/10" : ""}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-white/10" : ""}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        const url = window.prompt("URL")
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run()
                        }
                    }}
                    className={editor.isActive("link") ? "bg-white/10" : ""}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        const url = window.prompt("Image URL")
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run()
                        }
                    }}
                    type="button"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1"></div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    type="button"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    type="button"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

