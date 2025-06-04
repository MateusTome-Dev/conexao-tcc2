"use client"

import type React from "react"
import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import type { EventSourceInput } from "@fullcalendar/core/index.js"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/institution/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/institution/dialog"
import { Input } from "@/components/ui/institution/input"
import { Label } from "@/components/ui/institution/label"
import { Textarea } from "@/components/ui/institution/textarea"
import { Plus, Trash2, Edit, Calendar } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

interface Event {
  id: number
  title: string
  start: Date | string
  allDay: boolean
  backgroundColor?: string
  extendedProps?: {
    horarioEvento: string
    localEvento: string
    descricaoEvento: string
  }
}

interface EventData {
  id?: number
  tituloEvento: string
  dataEvento: string
  horarioEvento: string
  localEvento: string
  descricaoEvento: string
}

interface BiggerCalendarProps {
  onEventCreated: () => void
}

export default function ResponsiveCalendar({ onEventCreated }: BiggerCalendarProps) {
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Função para obter a data de "antes de ontem" (2 dias atrás)
  const getBeforeYesterdayDate = () => {
    const date = new Date()
    date.setDate(date.getDate() - 2)
    return date
  }

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      const events = data.map((event: any) => ({
        id: event.id,
        title: event.tituloEvento,
        start: event.dataEvento,
        allDay: true,
        backgroundColor: event.dataEvento === new Date().toISOString().split("T")[0] ? "#1e3a8a" : "#3b82f6",
        extendedProps: {
          horarioEvento: event.horarioEvento,
          localEvento: event.localEvento,
          descricaoEvento: event.descricaoEvento,
        },
      }))
      setAllEvents(events)
    } catch (error) {
      console.error("Erro ao buscar eventos:", error)
      toast.error("Não foi possível carregar os eventos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el")
    if (draggableEl) {
      draggableEl.style.pointerEvents = "none"
    }
  }, [])

  useEffect(() => {
    const addCustomStyles = () => {
      let styleElement = document.getElementById("calendar-custom-styles")

      if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = "calendar-custom-styles"
        document.head.appendChild(styleElement)
      }

      const cssRule = `
        @media (max-width: 768px) {
          .fc .fc-toolbar-title {
            font-size: 20px !important;
          }
        }
      `

      styleElement.textContent = cssRule

      const modalStyles = `
        .DialogOverlay {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .DialogContent {
          background-color: white !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
        }
      `

      styleElement.textContent += modalStyles
    }

    addCustomStyles()

    return () => {
      const styleElement = document.getElementById("calendar-custom-styles")
      if (styleElement) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return false
    
    const date = new Date(dateString)
    const year = date.getFullYear()
    
    return !isNaN(date.getTime()) && year >= 1900
  }

  const isBeforeBeforeYesterday = (dateString: string): boolean => {
    const beforeYesterday = getBeforeYesterdayDate()
    beforeYesterday.setHours(0, 0, 0, 0) // Remove a parte de horas para comparar apenas a data
    
    const inputDate = new Date(dateString)
    inputDate.setHours(0, 0, 0, 0)
    
    return inputDate < beforeYesterday
  }

  const handleEventClick = (info: any) => {
    const event = allEvents.find((e) => e.id === Number.parseInt(info.event.id))
    if (event) {
      setSelectedEvent({
        id: event.id,
        tituloEvento: event.title,
        dataEvento: typeof event.start === "string" ? event.start : event.start.toISOString().split("T")[0],
        horarioEvento: event.extendedProps?.horarioEvento || "00:00:00",
        localEvento: event.extendedProps?.localEvento || "",
        descricaoEvento: event.extendedProps?.descricaoEvento || "",
      })
      setIsEditing(true)
      setOpenModal(true)
    }
  }

  const handleDateClick = (info: any) => {
    // Verifica se a data clicada é anterior a "antes de ontem"
    if (isBeforeBeforeYesterday(info.dateStr)) {
      toast.error("Não é possível criar eventos em datas anteriores a " + getBeforeYesterdayDate().toLocaleDateString('pt-BR'))
      return
    }

    setSelectedEvent({
      tituloEvento: "",
      dataEvento: info.dateStr,
      horarioEvento: "00:00:00",
      localEvento: "",
      descricaoEvento: "",
    })
    setIsEditing(false)
    setOpenModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedEvent((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleAddEvent = async () => {
    if (!selectedEvent) return

    if (!validateDate(selectedEvent.dataEvento)) {
      toast.error("Por favor, insira uma data válida posterior a 1900.")
      return
    }

    if (isBeforeBeforeYesterday(selectedEvent.dataEvento)) {
      toast.error("Não é possível agendar eventos para datas anteriores a " + getBeforeYesterdayDate().toLocaleDateString('pt-BR'))
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedEvent),
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar evento")
      }

      setOpenModal(false)
      fetchEvents()
      toast.success("Evento criado com sucesso!")
      onEventCreated()
    } catch (error) {
      console.error("Erro ao adicionar evento:", error)
      toast.error("Erro ao criar o evento.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !selectedEvent.id) return

    if (!validateDate(selectedEvent.dataEvento)) {
      toast.error("Por favor, insira uma data válida posterior a 1900.")
      return
    }

    if (isBeforeBeforeYesterday(selectedEvent.dataEvento)) {
      toast.error("Não é possível atualizar eventos para datas anteriores a " + getBeforeYesterdayDate().toLocaleDateString('pt-BR'))
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedEvent),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar evento")
      }

      setOpenModal(false)
      fetchEvents()
      toast.success("Evento atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar evento:", error)
      toast.error("Erro ao atualizar o evento.")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteEvent = () => {
    setOpenDeleteDialog(true)
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent.id) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir evento")
      }

      setOpenDeleteDialog(false)
      setOpenModal(false)
      fetchEvents()
      toast.success("Evento excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      toast.error("Erro ao excluir o evento.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ToastContainer/>
      <nav className="flex justify-between mb-4 md:mb-2 border-violet-100 p-2 md:p-4">
      </nav>
      <main className="flex flex-col items-center justify-between p-2 md:p-6 lg:p-16">
        <div className="w-full max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
          <div className="w-full dark:text-[#ffffff]">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: isMobile ? "prev,next" : "prev,next today",
                center: "title",
                right: isMobile ? "dayGridMonth" : "dayGridMonth,timeGridWeek",
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={false}
              droppable={false}
              selectable={true}
              height={isMobile ? "auto" : undefined}
              aspectRatio={isMobile ? 0.8 : 1.35}
              contentHeight="auto"
              stickyHeaderDates={true}
              dayMaxEventRows={isMobile ? 2 : true}
              locale={ptBrLocale}
              buttonText={{
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                list: "Lista",
              }}
              validRange={{
                start: getBeforeYesterdayDate() // Permite datas a partir de "antes de ontem"
              }}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
            />
          </div>
        </div>
      </main>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-[#141414] dark:text-white shadow-lg border-0">
          <div className="bg-white dark:bg-[#141414] dark:text-blue-500 p-4 border-b">
            <DialogTitle className="flex items-center text-xl font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              {isEditing ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </div>
          <div className="p-6">
            <div className="grid gap-5 py-2">
              <div className="grid gap-2 dark:text-white">
                <Label htmlFor="tituloEvento" className="font-medium">
                  Título
                </Label>
                <Input
                  id="tituloEvento"
                  name="tituloEvento"
                  placeholder="Digite o título do evento"
                  value={selectedEvent?.tituloEvento || ""}
                  maxLength={50}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 dark:text-white">
                  <Label htmlFor="dataEvento" className="font-medium">
                    Data
                  </Label>
                  <Input
                    id="dataEvento"
                    name="dataEvento"
                    type="date"
                    value={selectedEvent?.dataEvento || ""}
                    onChange={handleInputChange}
                    min={getBeforeYesterdayDate().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid gap-2 dark:text-white">
                  <Label htmlFor="horarioEvento" className="font-medium">
                    Horário
                  </Label>
                  <Input
                    id="horarioEvento"
                    name="horarioEvento"
                    type="time"
                    value={selectedEvent?.horarioEvento?.substring(0, 5) || ""}
                    onChange={(e) =>
                      handleInputChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: "horarioEvento",
                          value: e.target.value + ":00",
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2 dark:text-white">
                <Label htmlFor="localEvento" className="font-medium">
                  Local
                </Label>
                <Input
                  id="localEvento"
                  name="localEvento"
                  placeholder="Digite o local do evento"
                  value={selectedEvent?.localEvento || ""}
                  onChange={handleInputChange}
                  maxLength={35}
                />
              </div>
              <div className="grid gap-2 dark:text-white">
                <Label htmlFor="descricaoEvento" className="font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="descricaoEvento"
                  name="descricaoEvento"
                  placeholder="Descreva os detalhes do evento"
                  value={selectedEvent?.descricaoEvento || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="border-t p-4 bg-white dark:bg-[#141414] flex flex-wrap gap-3 justify-between sm:justify-between">
            {isEditing && (
              <Button
                variant="destructive"
                onClick={confirmDeleteEvent}
                disabled={isLoading}
                className="flex items-center gap-1 dark:text-white"
              >
                <Trash2 className="h-4 w-4" /> Excluir
              </Button>
            )}
            <div className="flex gap-2 ml-auto dark:text-white ">
              <Button variant="outline" onClick={() => setOpenModal(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                onClick={isEditing ? handleUpdateEvent : handleAddEvent}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </span>
                ) : isEditing ? (
                  <span className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Atualizar
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Adicionar
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white shadow-lg border-0 dark:bg-[#141414]">
          <div className="bg-white dark:bg-[#141414] p-4 border-b">
            <DialogTitle className="flex items-center text-xl font-semibold text-gray-900 dark:text-blue-500">
              <Trash2 className="mr-2 h-5 w-5 dark:text-blue-500" />
              Confirmar exclusão
            </DialogTitle>
          </div>
          <div className="p-6 dark:bg-[#141414]">
            <div className="py-2 space-y-4">
              <p className="text-gray-700 dark:text-white">Tem certeza que deseja excluir este evento?</p>
              <div className="p-4 bg-gray-100 rounded-md border border-gray-200 dark:bg-[#141414] ">
                <p className="font-semibold text-gray-900 dark:text-blue-500">{selectedEvent?.tituloEvento}</p>
                <div className="mt-2 text-sm text-gray-600 flex items-center dark:bg-[#141414]">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedEvent?.dataEvento} às {selectedEvent?.horarioEvento?.substring(0, 5)}
                </div>
              </div>
              <p className="text-sm text-red-600">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          <div className="border-t p-4 bg-white dark:bg-[#141414] flex justify-end gap-3 dark:text-white">
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 dark:text-white"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Excluindo...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Excluir
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}