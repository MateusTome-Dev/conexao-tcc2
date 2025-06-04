"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const WEEKDAYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]
const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
]

interface Event {
  id: number
  tituloEvento: string
  dataEvento: string
  horarioEvento: string
  localEvento: string
  descricaoEvento: string
}

interface CalendarProps {
  selectedDate?: Date
  onSelectDate?: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event");
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const formattedMonth = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(new Date(selectedYear, selectedMonth))
    setCurrentMonth(formattedMonth)
  }, [selectedMonth, selectedYear])

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(event.target.value))
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear)

  return (
    <div className="mb-6 w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#666666] dark:text-[#D0CECE]">Eventos</h1>
        <div className="flex items-center w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-white dark:bg-[#0D0D0D] px-3 py-2 rounded-lg text-[#8A8A8A] dark:text-[#D0CECE] w-full sm:w-auto"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm text-[#333333] dark:text-[#D0CECE]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="h-6 sm:h-8 aspect-square"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const event = events.find((e) => {
            const eventDate = new Date(e.dataEvento)
            // Adiciona 1 dia à data do evento
            eventDate.setDate(eventDate.getDate() + 1)
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === selectedMonth && 
                   eventDate.getFullYear() === selectedYear
          })
          return (
            <button
              key={day}
              className={`h-6 sm:h-8 aspect-square rounded-full flex items-center justify-center text-xs sm:text-sm text-[#666666]
                ${event ? "bg-blue-500 text-white" : "hover:bg-[#ffffff] dark:hover:bg-[#000000] dark:text-[#666666]"}`}
              title={event ? `${event.tituloEvento}\n${event.descricaoEvento}\nLocal: ${event.localEvento}\nHorário: ${event.horarioEvento}` : ""}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}