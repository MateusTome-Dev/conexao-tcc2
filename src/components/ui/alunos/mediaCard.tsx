"use client";

import { useState, useEffect } from "react";
import SmallSelect from "@/components/ui/alunos/smallselect";
import { jwtDecode } from "jwt-decode";

export function MediaCard({ atualizarMedia }: { atualizarMedia: (media: number) => void }) {
  const [selectedType, setSelectedType] = useState(0);
  const [notas, setNotas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [_var, setVar] = useState("");

 useEffect(() => {
    const fetchNotas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        const decoded: any = jwtDecode(token);
        const userId = decoded?.sub;
        if (!userId) throw new Error("ID do usuário não encontrado no token");

        const resposta = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${userId}`);
        if (!resposta.ok) {
          throw new Error("Falha ao buscar os dados");
        }

        const dados = await resposta.json();
        setNotas(dados.notas);
      } catch (erro) {
        console.error("Erro ao buscar as notas:", erro);
      } finally {
        setCarregando(false);
      }
    };

    fetchNotas();
  }, []);

  function valorVindoDoSelect(value: string) {
    switch (value) {
      case "1º Bimestre":
        setSelectedType(1);
        break;
      case "2º Bimestre":
        setSelectedType(2);
        break;
      case "3º Bimestre":
        setSelectedType(3);
        break;
      case "4º Bimestre":
        setSelectedType(4);
        break;
      default:
        setSelectedType(0); // "Todas"
    }
  }

  const calcularMediaPorBimestre = () => {
    let bimestreNotas = [];
    let media = 0;
  
    if (selectedType === 0) {
      bimestreNotas = notas;
    } else {
      bimestreNotas = notas.filter((nota) => nota.bimestre === selectedType);
    }
  
    const somaNotas = bimestreNotas.reduce((acc, nota) => acc + nota.nota, 0);
    media = bimestreNotas.length > 0 ? somaNotas / bimestreNotas.length : 0;
  
    // Transformar a média em porcentagem
    const mediaPorcentagem = media * 10;
  
    return mediaPorcentagem;
  };

  useEffect(() => {
    const mediaCalculada = calcularMediaPorBimestre();
    atualizarMedia(mediaCalculada); // Atualiza a média no componente pai
  }, [selectedType, notas]);


  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="flex flex-row justify-between">
      <h2 className="text-lg font-bold">Média de notas</h2>
      <div className="flex flex-row items-center justify-center w-32">
        <SmallSelect
          selectedType={selectedType}
          setSelectedType={valorVindoDoSelect}
          placeholder="Selecione o Bimestre"
          items={["Todas", "1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"]}
        />
      </div>
    </div>
  );
}
