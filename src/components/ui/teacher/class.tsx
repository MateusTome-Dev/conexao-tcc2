'use client';

import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

interface TeacherProfile {
  nome: string;
  emailDocente: string;
  dataNascimentoDocente: string;
  classes: { nomeTurma: string; id: number }[]; // Lista de turmas
}

export function Class(){

  
  
  const [darkMode, setDarkMode] = useState(false);
    const [teacherData, setTeacherData] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [turmaSelecionada, setTurmaSelecionada] = useState<{ nomeTurma: string; id: number } | null>(null);
   
      // Função de buscar os dados do estudante
      const fetchTeacherData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token não encontrado");
   
          const decoded: any = jwtDecode(token); // Decodificação do JWT
          const id = decoded?.sub; // Extraindo o id do usuário do token
          if (!id) throw new Error("ID do usuário não encontrado no token");
   
          const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/${id}`);
          if (!response.ok) throw new Error("Não foi possível carregar os dados do estudante");
   
          const data = await response.json();
          setTeacherData(data); // Setando os dados do estudante
          if (data.classes.length > 0) {
            setTurmaSelecionada(data.classes[0]); // Seleciona a primeira turma, caso haja
          }
        } catch (err: any) {
          setError(err.message); // Tratamento de erro
        } finally {
          setLoading(false); // Finalizando o carregamento
        }
      };
   
      // Chama a função de fetch quando o componente for montado
      useEffect(() => {
        fetchTeacherData(); // Chamando a função para carregar os dados
      }, []);
   
   
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [darkMode]);


  return (
    <>
    {/* Exibindo Turmas */}
    <div className="space-y-2">
              {teacherData?.classes?.length ? (
                teacherData.classes.map((turma) => (
                  <button
                    key={turma.id}
                    onClick={() => setTurmaSelecionada(turma)}
                    className={`block w-full p-3 text-left border border-[#F0F7FF] bg-[#F0F7FF] dark:bg-[#141414] dark:border-[#141414] dark:hover:border-blue-500 rounded-lg ${turmaSelecionada?.id === turma.id ? 'border-blue-500' : 'border-[#F0F7FF]'}`}
                  >
                    <span className="font-semibold">{turma.nomeTurma}</span>
                    <span className="block text-gray-500 text-sm">Nº{turma.id}</span>
                  </button>
                ))
              ) : (
                <p>{loading ? 'Carregando turmas...' : 'Nenhuma turma disponível'}</p>
              )}
            </div>
    </>
  );
};

