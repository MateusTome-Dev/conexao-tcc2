import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface Message {
  id: number;
  conteudo: string;
  horarioSistema: string;
  nomeDocente: string;
  criadoPorNome: string;
  initials: string;
  classStId: number;
  color: string;
  classStDTO: {
    nomeTurma: string;
    id?: number;
  }[];
}

// Lista de cores para os avatares
const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
];

function MessageList({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        const decoded: any = jwtDecode(token);
        const userId = decoded?.sub;
        if (!userId) throw new Error("ID do usuário não encontrado no token");

        // 2️⃣ Buscar os avisos da turma
        const reminderResponse = await fetch(
          `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/reminder/teacher/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!reminderResponse.ok) throw new Error("Nenhum aviso disponível.");

        const reminders: Message[] = await reminderResponse.json();

        reminders.sort(
          (a, b) =>
            new Date(b.horarioSistema).getTime() -
            new Date(a.horarioSistema).getTime()
        );

        const updatedMessages = reminders
          .filter((message) => {
            const messageDate = new Date(message.horarioSistema).getTime();
            const sevenDaysAgo = Date.now() - 168 * 60 * 60 * 1000;
            return messageDate >= sevenDaysAgo;
          })
          .sort(
            (a, b) =>
              new Date(b.horarioSistema).getTime() -
              new Date(a.horarioSistema).getTime()
          )
          .map((message, index) => ({
            ...message,
            color: avatarColors[index % avatarColors.length],
          }));

        setMessages(updatedMessages);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar avisos");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div
      className={`bg-white dark:bg-black rounded-xl shadow-md p-4 overflow-hidden ${className} h-[332px]`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Avisos</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando avisos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum aviso disponível.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-[#141414]">
          {messages.map((message, index) => (
            <div key={message.id}>
              {index > 0 && <hr className="border-gray-200 my-4" />}
              <div className="flex gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white font-semibold rounded-full ${message.color}`}
                >
                  {message.initials}
                </div>
                {/* Conteúdo da Mensagem */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">
                      {message.nomeDocente ||
                        message.criadoPorNome ||
                        "Não encontrado."}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500 text-sm">
                        {new Date(
                          new Date(message.horarioSistema).getTime() -
                            3 * 60 * 60 * 1000
                        ).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {/* Adicionando mensagem abaixo do horário */}
                      <span className="text-gray-400 text-xs mt-1">
                        {message.classStDTO[0]?.nomeTurma}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-[#8A8A8A] text-sm mt-1">
                    {message.conteudo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;