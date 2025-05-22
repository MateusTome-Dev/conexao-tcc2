import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function ModalCreate({ isOpen, onClose, message }: ModalProps) {
  if (!isOpen) return null // Não renderiza se não estiver aberto

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-[#141414] p-6 rounded-lg shadow-lg flex flex-col items-center">
        <span className="animate-spin dark:text-blue-500 dark:t border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10"></span>
        <p className="mt-4 dark:text-white">{message || "Carregando..."}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
