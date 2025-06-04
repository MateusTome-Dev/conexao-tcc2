"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import type { EventSourceInput } from "@fullcalendar/core/index.js"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Event {
  title: string
  start: Date | string
  allDay: boolean
  id: number
}

export default function ResponsiveCalendar() {
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event")
      const data = await response.json()
      const events = data.map((event: any) => ({
        id: event.id,
        title: event.tituloEvento,
        start: event.dataEvento,
        allDay: true,
        backgroundColor: event.dataEvento === new Date().toISOString().split("T")[0] ? "#1e3a8a" : "#3b82f6",
      }))
      setAllEvents(events)
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el")
    if (draggableEl) {
      draggableEl.style.pointerEvents = "none"
    }
  }, [])

  // Add custom CSS for the calendar title on mobile
  useEffect(() => {
    const addCustomStyles = () => {
      // Check if the style element already exists
      let styleElement = document.getElementById("calendar-custom-styles")

      if (!styleElement) {
        // Create a new style element if it doesn't exist
        styleElement = document.createElement("style")
        styleElement.id = "calendar-custom-styles"
        document.head.appendChild(styleElement)
      }

      // Define the CSS rule for mobile calendar title
      const cssRule = `
        @media (max-width: 768px) {
          .fc .fc-toolbar-title {
            font-size: 20px !important;
          }
        }
      `

      styleElement.textContent = cssRule
    }

    addCustomStyles()

    // Clean up function to remove the style element when component unmounts
    return () => {
      const styleElement = document.getElementById("calendar-custom-styles")
      if (styleElement) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <>
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
              selectable={false}
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
            />
          </div>
        </div>
      </main>
    </>
  )
}

