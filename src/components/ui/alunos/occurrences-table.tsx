"use client"
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/alunos/table";
import { useParams } from 'next/navigation';

export function OccurrencesTable() {
  const params = useParams();
  const id = params.id as string;
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/feedbackteacher/student/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao buscar feedback');
          }
          return response.json();
        })
        .then(data => {
          setFeedback(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch(error => {
          console.error('Erro ao buscar feedback:', error);
          setError(error.message);
          setFeedback([]);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="space-y-4 flex flex-col pb-[30px] border-b border-[#00000050] dark:border-[#ffffff50]">
      <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-white min-w-[150px]">Ocorrência</TableHead>
                <TableHead className="dark:text-white min-w-[150px]">Orientador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 dark:bg-[#141414] dark:text-[#ffffffd8]">
                    Carregando feedbacks...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 dark:bg-[#141414] dark:text-[#ffffffd8] text-red-500">
                    Erro ao carregar feedbacks: {error}
                  </TableCell>
                </TableRow>
              ) : feedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 dark:bg-[#141414] dark:text-[#ffffffd8]">
                    Nenhum feedback encontrado para este aluno.
                  </TableCell>
                </TableRow>
              ) : (
                feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="dark:bg-[#141414] dark:text-[#ffffffd8] min-w-[150px]">
                      {item.conteudo}
                    </TableCell>
                    <TableCell className="dark:bg-[#141414] dark:text-[#ffffffd8] min-w-[150px]">
                      {item.teacher?.nomeDocente || 'Não informado'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}