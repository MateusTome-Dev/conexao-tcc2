import { useEffect, useState } from "react";
import type { Event } from "../../../types/event";

interface EventListProps {
  className?: string;
}

export function EventList({ className }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  // Função para adicionar 1 dia a uma data
  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/event");
        const data: Event[] = await response.json();

        // Adiciona 1 dia a cada evento e filtra
        const today = new Date().toISOString().split("T")[0];
        const upcomingEvents = data
          .map(event => ({
            ...event,
            // Cria uma cópia do evento com a data modificada
            dataEvento: addOneDay(event.dataEvento)
          }))
          .filter((event) => event.dataEvento >= today);

        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const toggleEventExpansion = (eventId: number) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 ${className || ""}`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-6">Próximos eventos</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum evento futuro encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 max-h-[480px] pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-[#141414]">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 ${
                expandedEventId === event.id 
                  ? "dark:bg-[#0D0D0D] bg-white shadow-md"
                  : "dark:bg-[#0D0D0D] hover:bg-gray-100 dark:hover:bg-[#000000]"
              }`}
            >
              <div 
                className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 cursor-pointer"
                onClick={() => toggleEventExpansion(event.id)}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-medium ">
                  {new Date(event.dataEvento).getDate()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base">{event.tituloEvento}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(event.dataEvento).toLocaleDateString("pt-BR", {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <button 
                  className="p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full flex-shrink-0"
                  aria-label={expandedEventId === event.id ? "Recolher detalhes" : "Expandir detalhes"}
                >
                  <svg 
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform ${
                      expandedEventId === event.id ? "transform rotate-90" : ""
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {expandedEventId === event.id && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 border-t dark:border-gray-800">
                  <div className="flex flex-row sm:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <h4 className="font-medium mb-2">Descrição</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-words w-20">
                        {event.descricaoEvento || "Nenhuma descrição fornecida."}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Detalhes</h4>
                      <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                        <li>
                          <span className="font-semibold">Data:</span> {formatDate(event.dataEvento)}
                        </li>
                        <li>
                          <span className="font-semibold">Horário:</span> {event.horarioEvento}
                        </li>
                        <li>
                          <span className="font-semibold">Local:</span> {event.localEvento || "Não especificado"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}