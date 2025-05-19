"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Send, Sun } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import { Button } from "@/components/ui/alunos/button"
import { useTheme } from "@/components/ThemeProvider"
import { Groq } from "groq-sdk"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { darkMode, toggleTheme } = useTheme()

  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Você é um assistente útil que responde em português brasileiro de forma clara e concisa."
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: input
          }
        ],
        model: "llama3-70b-8192", // Modelo Llama 3 70B fixo
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "Não foi possível obter uma resposta."
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Erro ao chamar a API do Groq:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-row min-h-screen bg-gray-50 dark:bg-[#141414]">
      <Sidebar/>
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="w-full flex flex-row justify-end mb-4">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-13rem)] max-w-3xl mx-auto">
          <div className="flex-1 overflow-y-auto rounded-t-lg bg-white dark:bg-[#000000] p-4 shadow-sm border-[1px] border-b-0 border-gray-400 dark:border-[1px] dark:border-b-0 dark:border-[#0077FF]">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Bem-vindo ao Chat com IA</h2>
                  <p className="text-gray-500 dark:text-gray-400">Faça uma pergunta para começar a conversa.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-b-lg bg-white dark:bg-[#000000] p-4 shadow-sm border-[1px]  dark:border-[#0077FF] border-gray-400">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua pergunta..."
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 focus:border-gray-500 dark:focus:border-blue-500 focus:outline-none bg-white dark:bg-[#141414] dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}