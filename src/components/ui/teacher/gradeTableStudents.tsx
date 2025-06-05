"use client";

import { jwtDecode } from "jwt-decode";
import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Tipos para as notas e as matérias
interface Nota {
  idNota: number;
  nota: number;
  bimestre: number;
  status: string;
  nomeDisciplina: string;
}

interface Turma {
  disciplinaTurmas: {
    id: number;
    nomeDisciplina: string;
  };
}

interface Materia {
  nomeDisciplina: string;
  notas: (number | null)[]; // Array de notas para cada bimestre
}

interface ModalProps {
  tipo: "editar" | "adicionar";
  disciplina?: string;
  bimestre?: number;
  notaAtual?: number;
  idNota?: number;
  onClose: () => void;
  onSave: (dados: {
    disciplina: string;
    bimestre: number;
    nota: number;
    idNota?: number;
  }) => void;
  disciplinas: { id: number; nomeDisciplina: string }[];
}

// Componente do Modal (mantido igual)
const Modal = ({
  tipo,
  disciplina,
  bimestre,
  notaAtual,
  idNota,
  onClose,
  onSave,
  disciplinas,
}: ModalProps) => {
  const [novaDisciplina, setNovaDisciplina] = useState(disciplina || "");
  const [novoBimestre, setNovoBimestre] = useState(bimestre || 1);
  const [novaNota, setNovaNota] = useState(
    notaAtual !== undefined ? notaAtual.toString() : ""
  );
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!novaDisciplina) {
      setErro("Selecione uma disciplina");
      return;
    }

    if (isNaN(novoBimestre) || novoBimestre < 1 || novoBimestre > 4) {
      setErro("O bimestre deve estar entre 1 e 4");
    }

    const notaNumero = Number.parseFloat(novaNota);
    if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
      setErro("A nota deve ser um número entre 0 e 10");
      return;
    }

    // Enviar dados
    onSave({
      disciplina: novaDisciplina,
      bimestre: novoBimestre,
      nota: notaNumero,
      idNota: idNota,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#141414] p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-500">
            {tipo === "editar" ? "Editar Nota" : "Adicionar Nota"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {erro && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{erro}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Disciplina
            </label>
            {tipo === "editar" ? (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                {novaDisciplina}
              </div>
            ) : (
              <select
                value={novaDisciplina}
                onChange={(e) => setNovaDisciplina(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-400 rounded bg-white dark:bg-black text-gray-900 dark:text-white"
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disc) => (
                  <option key={disc.id} value={disc.nomeDisciplina}>
                    {disc.nomeDisciplina}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bimestre
            </label>
            {tipo === "editar" ? (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                {novoBimestre}º Bimestre
              </div>
            ) : (
              <select
                value={novoBimestre}
                onChange={(e) =>
                  setNovoBimestre(Number.parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-400 rounded bg-white dark:bg-black text-gray-900 dark:text-white"
              >
                <option value={1}>1º Bimestre</option>
                <option value={2}>2º Bimestre</option>
                <option value={3}>3º Bimestre</option>
                <option value={4}>4º Bimestre</option>
              </select>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nota
            </label>
            <input
              type="number"
              step="0.1"
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-400 rounded bg-white dark:bg-black text-gray-900 dark:text-white"
              placeholder="Digite a nota (0-10)"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Table = () => {
  // Estado para armazenar as disciplinas e notas
  const [disciplinas, setDisciplinas] = useState<Materia[]>([]);
  const params = useParams();
  const id = params.id as string;
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [modalTipo, setModalTipo] = useState<"editar" | "adicionar">(
    "adicionar"
  );
  const [notaSelecionada, setNotaSelecionada] = useState<{
    disciplina: string;
    bimestre: number;
    nota: number | null;
    idNota?: number;
  } | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<
    { id: number; nomeDisciplina: string }[]
  >([]);
  const [notasRaw, setNotasRaw] = useState<Nota[]>([]);

  // Função para organizar as notas por disciplina
  const organizarNotasPorDisciplina = (notas: Nota[]): Materia[] => {
    const disciplinasMap: { [key: string]: (number | null)[] } = {};

    // Organiza as notas por disciplina e bimestre
    notas.forEach((nota) => {
      const { nomeDisciplina, bimestre, nota: valorNota } = nota;

      // Inicializa a disciplina se não existir no mapa
      if (!disciplinasMap[nomeDisciplina]) {
        disciplinasMap[nomeDisciplina] = [null, null, null, null]; // Inicializa os bimestres como nulos
      }

      // Corrige a posição do bimestre (0 para o 1° bimestre, 1 para o 2°, etc.)
      const indiceBimestre = bimestre - 1;

      // Adiciona a nota no bimestre correspondente (0 a 3)
      disciplinasMap[nomeDisciplina][indiceBimestre] = valorNota;
    });

    // Converte o mapa de disciplinas para um array de Materia
    return Object.keys(disciplinasMap).map((nomeDisciplina) => ({
      nomeDisciplina,
      notas: disciplinasMap[nomeDisciplina],
    }));
  };

  const buscarNotas = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const decoded: any = jwtDecode(token);
    const userId = decoded?.sub;
    if (!userId) throw new Error("ID do usuário não encontrado no token");

    const resposta = await fetch(
      `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${id}`
    );

    if (!resposta.ok) {
      throw new Error("Falha ao buscar os dados");
    }

    const dados = await resposta.json();

    setNotasRaw(dados.notas);
    const disciplinasOrganizadas = organizarNotasPorDisciplina(dados.notas);
    setDisciplinas(disciplinasOrganizadas);

    setDisciplinasDisponiveis(dados.turma.disciplinaTurmas);
  } catch (erro) {
    setErro((erro as Error).message);
  } finally {
    setCarregando(false);
  }
};

  // Faz a requisição para buscar as notas quando o componente for montado
  useEffect(() => {
    buscarNotas();
  }, [id]); // Adicionei id como dependência para recarregar quando mudar

  // Função para abrir o modal de edição
  const abrirModalEdicao = (
    disciplina: string,
    bimestre: number,
    nota: number | null
  ) => {
    if (nota === null) {
      abrirModalAdicao(disciplina, bimestre);
      return;
    }

    // Buscar o ID da nota correspondente
    const notaEncontrada = notasRaw.find(
      (n) => n.nomeDisciplina === disciplina && n.bimestre === bimestre
    );

    setNotaSelecionada({
      disciplina,
      bimestre,
      nota,
      idNota: notaEncontrada?.idNota,
    });
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Função para abrir o modal de adição
  const abrirModalAdicao = (disciplina?: string, bimestre?: number) => {
    setNotaSelecionada(
      disciplina && bimestre
        ? {
            disciplina,
            bimestre,
            nota: null,
          }
        : null
    );
    setModalTipo("adicionar");
    setModalAberto(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setModalAberto(false);
    setNotaSelecionada(null);
    // Limpa a mensagem após fechar o modal
    setTimeout(() => setMensagem(null), 300);
  };

  // Função para salvar a nota (criar ou editar)
  const salvarNota = async (dados: {
    disciplina: string;
    bimestre: number;
    nota: number;
    idNota?: number;
  }) => {
    setSalvando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const disciplinaSelecionada = disciplinasDisponiveis.find(
        (d) => d.nomeDisciplina === dados.disciplina
      );

      if (!disciplinaSelecionada) throw new Error("Disciplina não encontrada");

      const endpoint = dados.idNota
        ? `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/note/${dados.idNota}` // endpoint de edição
        : "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/note"; // endpoint de criação

      const metodo = dados.idNota ? "PUT" : "POST";

      const corpo = {
        studentId: id,
        nota: dados.nota,
        bimestre: dados.bimestre,
        disciplineId: disciplinaSelecionada.id,
      };

      const resposta = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });

      if (!resposta.ok && resposta.status === 409) {
        toast.warn("Já existe uma nota para este aluno, disciplina e bimestre.");
        return;
      }

      // Atualiza a lista de notas
      const novasDisciplinas = [...disciplinas];
      const indiceDisciplina = novasDisciplinas.findIndex(
        (d) => d.nomeDisciplina === dados.disciplina
      );

      if (indiceDisciplina >= 0) {
        // Atualiza a nota na disciplina existente
        novasDisciplinas[indiceDisciplina].notas[dados.bimestre - 1] =
          dados.nota;
      } else {
        // Cria uma nova disciplina
        const novaDisciplina: Materia = {
          nomeDisciplina: dados.disciplina,
          notas: [null, null, null, null],
        };
        novaDisciplina.notas[dados.bimestre - 1] = dados.nota;
        novasDisciplinas.push(novaDisciplina);
      }

      setDisciplinas(novasDisciplinas);
      await buscarNotas();
      toast.success(`Nota ${dados.idNota ? "atualizada" : "adicionada"} com sucesso!`);

      fecharModal();
    } catch (erro) {
      toast.error("Erro ao atribuir nota.");
    }finally {
      setSalvando(false);
    }
  };

  // Lista de todas as disciplinas disponíveis (para o dropdown)
  const todasDisciplinas = disciplinas.map((d) => d.nomeDisciplina);

  // Exibe a mensagem de carregamento ou erro, se houver
  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">Carregando...</div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-100 p-4 rounded text-red-700">Erro: {erro}</div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="w-full p-4 bg-white dark:bg-black rounded-[20px]">
        {/* Tabela para desktop */}
        <div className="hidden md:flex overflow-x-auto md:justify-center">
          <table className="min-w-[50%] border-separate border-spacing-4">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Matéria</th>
                <th className="p-3 text-center">1° Bim.</th>
                <th className="p-3 text-center">2° Bim.</th>
                <th className="p-3 text-center">3° Bim.</th>
                <th className="p-3 text-center">4° Bim.</th>
              </tr>
            </thead>
            <tbody>
              {disciplinas.map((materia, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-100 dark:odd:bg-gray-800 even:bg-gray-200 dark:even:bg-gray-700"
                >
                  <td className="p-3 bg-blue-600 text-white font-semibold">
                    {materia.nomeDisciplina}
                  </td>
                  {materia.notas.map((nota, i) => (
                    <td
                      key={i}
                      className="p-3 text-center border border-transparent text-black dark:text-white bg-[#EAF4FF] dark:bg-[#141414] cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      onClick={() =>
                        abrirModalEdicao(materia.nomeDisciplina, i + 1, nota)
                      }
                    >
                      {nota !== null ? nota : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lista para mobile */}
        <div className="md:hidden space-y-4">
          {disciplinas.map((materia, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="bg-blue-600 text-white p-3 font-semibold">
                {materia.nomeDisciplina}
              </div>
              <div className="grid grid-cols-2 gap-2 p-2">
                {materia.notas.map((nota, i) => (
                  <div
                    key={i}
                    className="bg-[#EAF4FF] dark:bg-[#141414] p-3 rounded text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    onClick={() =>
                      abrirModalEdicao(materia.nomeDisciplina, i + 1, nota)
                    }
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {i + 1}° Bim.
                    </div>
                    <div className="font-medium text-black dark:text-white">
                      {nota !== null ? nota : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => abrirModalAdicao()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Adicionar Nota
          </button>
        </div>

        {/* Modal */}
        {modalAberto && (modalTipo === "adicionar" || notaSelecionada) && (
          <Modal
            tipo={modalTipo}
            disciplina={notaSelecionada?.disciplina}
            bimestre={notaSelecionada?.bimestre}
            notaAtual={notaSelecionada?.nota || undefined}
            idNota={notaSelecionada?.idNota}
            onClose={fecharModal}
            onSave={salvarNota}
            disciplinas={disciplinasDisponiveis}
          />
        )}

        {/* Mensagem de feedback */}
        {mensagem && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${
              mensagem.tipo === "sucesso"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {mensagem.texto}
          </div>
        )}
      </div>
    </>
  );
};

export default Table;