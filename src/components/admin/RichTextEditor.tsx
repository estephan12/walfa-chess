"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe el contenido completo de la noticia o crónica aquí...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#5FA8D3] underline font-medium hover:text-[#4A96C2]",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-xl my-4 border border-[#2B5B84] max-h-[500px] w-auto object-cover",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[260px] p-4 focus:outline-none text-sm text-[#F0F4F8] leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return (
      <div className="rounded-xl border border-[#2B5B84] bg-[#0B0F19] p-4 min-h-[300px] flex items-center justify-center text-[#94A3B8] text-sm">
        Cargando editor...
      </div>
    )
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Ingresa la URL del enlace:", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("Ingresa la URL directa de la imagen:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="rounded-xl border border-[#2B5B84] bg-[#0B0F19] overflow-hidden focus-within:border-[#5FA8D3] focus-within:ring-2 focus-within:ring-[#5FA8D3]/30 transition-all">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#132238] border-b border-[#2B5B84] text-[#94A3B8]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("bold") ? "bg-[#0B0F19] text-[#5FA8D3] font-bold" : ""
          }`}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("italic") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("strike") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#2B5B84] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Encabezado H2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Encabezado H3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#2B5B84] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("bulletList") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("orderedList") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("blockquote") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Cita"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors"
          title="Línea divisoria"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#2B5B84] mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors ${
            editor.isActive("link") ? "bg-[#0B0F19] text-[#5FA8D3]" : ""
          }`}
          title="Insertar enlace"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] transition-colors"
          title="Insertar imagen por URL"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#2B5B84] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] disabled:opacity-30 transition-colors"
          title="Deshacer"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-lg hover:bg-[#0B0F19] hover:text-[#F0F4F8] disabled:opacity-30 transition-colors"
          title="Rehacer"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Área de texto enriquecido */}
      <EditorContent editor={editor} />
    </div>
  )
}
