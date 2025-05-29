"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the event type based on your API response
interface Event {
  id: number;
  tituloEvento: string;
  dataEvento: string;
  horarioEvento: string;
  localEvento: string;
  descricaoEvento: string;
}

// Colors to cycle through for events
const eventColors = [
  "bg-blue-500",
  "bg-blue-500",
];

export function EventSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/event");

        if (!response.ok) {
          throw new Error(`Error fetching events: ${response.status}`);
        }

        const data = await response.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter events to only include future or today's events
        const futureEvents = data.filter((event: Event) => {
          const eventDate = new Date(event.dataEvento);
          return eventDate >= today;
        });

        setEvents(futureEvents);

        // Set the first future event as selected by default
        if (futureEvents.length > 0) {
          setSelectedEvent(futureEvents[0]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Check screen size and set collapsed state
  useEffect(() => {
    const checkScreenSize = () => {
      const shouldCollapse = window.innerWidth < 1536;
      setIsCollapsed(shouldCollapse);
      if (shouldCollapse) setIsOpen(false);
      else setIsOpen(true);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Format date from API (YYYY-MM-DD) to "DD - MMM YYYY"
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayFormatted = day;
    const monthFormatted = date
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    const yearFormatted = year;
    return `${dayFormatted} - ${
      monthFormatted.charAt(0).toUpperCase() + monthFormatted.slice(1)
    } ${yearFormatted}`;
  };

  // Format time from API (HH:MM:SS) to "HH:MM"
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <>
      {/* Toggle button for collapsed view - always visible when collapsed */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 2xl:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        aria-label={
          isOpen ? "Fechar detalhes do evento" : "Abrir detalhes do evento"
        }
      >
        {isOpen ? (
          <ChevronRight className="w-6 h-6 text-blue-500" />
        ) : (
          <ChevronLeft className="w-6 h-6 text-blue-500" />
        )}
      </button>

      {/* Overlay when sidebar is open in collapsed mode */}
      {isOpen && isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 2xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Event sidebar panel */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } fixed 2xl:static right-0 z-40 w-[400px] max-md:w-[340px] h-screen transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#FFFFFF] dark:bg-black pt-8 pl-16 pr-16 pb-8 rounded-[20px]">
                <div>
                  <h3 className="dark:text-white text-lg font-semibold mb-2 max-w-56 break-words">
                    {selectedEvent?.tituloEvento || "Sobre o Evento"}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-[#D0CECE] max-w-56 break-words">
                    {selectedEvent?.descricaoEvento ||
                      "Nenhum evento selecionado"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    Horário
                  </h3>
                  {selectedEvent && (
                    <div className="mb-3 bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-center">
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        {selectedEvent.horarioEvento.substring(0, 5)} •{" "}
                        {formatDate(selectedEvent.dataEvento)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="pt-4 text-sm mb-4 dark:text-[#D0CECE] max-w-56 break-words">
                    {selectedEvent?.localEvento ||
                      "Cotia SP, Senai Ricardo Lerner"}
                    <br />
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] dark:bg-black pt-8 pl-16 pr-16 pb-5 rounded-[20px]">
                <h3 className="text-lg font-semibold mb-4 dark:text-[#D0CECE]">
                  Próximos Eventos
                </h3>
                <div className="space-y-3 p-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-[#141414]">
                  {events.length > 0 ? (
                    events.map((event, index) => (
                      <div
                        key={event.id}
                        className={`flex items-center gap-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg cursor-pointer ${
                          selectedEvent?.id === event.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div
                          className={`w-8 h-8 ${
                            eventColors[index % eventColors.length]
                          } rounded-full flex items-center justify-center text-white`}
                        >
                          {event.dataEvento.split("-")[2]}
                        </div>
                        <div>
                          <p className="font-medium dark:text-white break-words max-w-40 max-md:max-w-28">
                            {event.tituloEvento}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-white">
                            {formatDate(event.dataEvento)} •{" "}
                            {formatTime(event.horarioEvento)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground dark:text-[#D0CECE]">
                      Nenhum evento futuro encontrado
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}