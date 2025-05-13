"use client"

import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Moon, Send, Sun } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import { Button } from "@/components/ui/alunos/button"
import { useTheme } from "@/components/ThemeProvider"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { darkMode, toggleTheme } = useTheme();
  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Sidebar/>
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="w-full flex flex-row justify-end">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100vh-13rem)] max-w-3xl mx-auto">
          <div className="flex-1 overflow-y-auto rounded-t-lg bg-white p-4 shadow-sm">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl font-bold text-gray-700">Bem-vindo ao Chat com IA</h2>
                  <p className="text-gray-500">Faça uma pergunta para começar a conversa.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-b-lg bg-white p-4 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua pergunta..."
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
