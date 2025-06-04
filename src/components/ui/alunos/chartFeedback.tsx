"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jwtDecode } from "jwt-decode";
import SmallSelect from "@/components/ui/alunos/smallselect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/alunos/select";

interface FeedbackData {
  bimestre: number;
  resposta1: number;
  resposta2: number;
  resposta3: number;
  resposta4: number;
  resposta5: number;
  createdByDTO: { id: number; nomeDocente: string };
}

interface ChartData {
  name: string;
  value: number;
  fullName: string;
}

interface Creator {
  id: number;
  nomeDocente: string;
}

const EngagementChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bimestre, setBimestre] = useState<number>(1);
  const [allData, setAllData] = useState<FeedbackData[]>([]);
  const [selectedType, setSelectedType] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<number | null>(null);
  const [selectedCreatorName, setSelectedCreatorName] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const valorVindoDoSelect = (value: string) => {
    switch (value) {
      case "1º Bimestre":
        setSelectedType(1);
        setBimestre(1);
        break;
      case "2º Bimestre":
        setSelectedType(2);
        setBimestre(2);
        break;
      case "3º Bimestre":
        setSelectedType(3);
        setBimestre(3);
        break;
      case "4º Bimestre":
        setSelectedType(4);
        setBimestre(4);
        break;
    }
  };

  const types = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

  const normalizeData = (values: number[]) => {
    const maxValue = Math.max(...values);
    if (maxValue === 0) return values.map(() => 0); // Retorna array de zeros se todos forem zero
    return values.map((value) => (value / maxValue) * 5);
  };

  const fetchCreators = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const resposta = await fetch("https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) throw new Error("Falha ao buscar os criadores");

      const dados = await resposta.json();
      setCreators(dados);
      
      if (dados.length > 0) {
        setSelectedCreator(dados[0].id);
        setSelectedCreatorName(dados[0].nomeDocente);
      }
    } catch (err: any) {
      console.error("Erro ao buscar criadores:", err);
      setError(err.message || "Erro ao buscar os criadores");
      setCreators([]);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const decoded: any = jwtDecode(token);
      const userId = decoded?.sub;
      if (!userId) throw new Error("ID do usuário não encontrado no token");

      const resposta = await fetch(
        `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/feedback/${userId}`
      );
      if (!resposta.ok) throw new Error("Falha ao buscar os dados");

      const dados = await resposta.json();
      setAllData(dados);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar todos os dados:", err);
      setError(err.message);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = () => {
    try {
      if (!allData || allData.length === 0) {
        setData([]);
        return;
      }

      // Filtrar por professor selecionado
      const filteredByCreator = selectedCreator
        ? allData.filter(
            (item) => item.createdByDTO && item.createdByDTO.id === selectedCreator
          )
        : allData;

      // Filtrar por bimestre selecionado
      const filteredData = filteredByCreator.filter(
        (item) => item.bimestre === bimestre
      );

      if (filteredData.length === 0) {
        setData([]);
        return;
      }

      const values = [
        filteredData[0].resposta1,
        filteredData[0].resposta2,
        filteredData[0].resposta3,
        filteredData[0].resposta4,
        filteredData[0].resposta5,
      ];

      const normalizedValues = normalizeData(values);

      const categories = [
        { tiny: "Eng", short: "Eng", full: "Engajamento" },
        { tiny: "Dis", short: "Disp", full: "Disposição" },
        { tiny: "Ent", short: "Ent", full: "Entrega" },
        { tiny: "Atn", short: "Aten", full: "Atenção" },
        { tiny: "Cmp", short: "Comp", full: "Comportamento" },
      ];

      const formattedData = categories.map((category, index) => ({
        name:
          chartWidth < 350
            ? category.tiny
            : chartWidth < 600
            ? category.short
            : category.full,
        fullName: category.full,
        value: normalizedValues[index],
      }));

      setData(formattedData);
      setError(null);

      if (filteredData.length > 0 && filteredData[0].createdByDTO) {
        setSelectedCreatorName(filteredData[0].createdByDTO.nomeDocente);
      } else {
        setSelectedCreatorName(null);
      }
    } catch (err: any) {
      setError(err.message);
      setData([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchCreators();
        await fetchAllData();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (allData.length > 0 || (allData.length === 0 && !loading)) {
      updateChartData();
    }
  }, [bimestre, selectedCreator, chartWidth, allData, loading]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-semibold">{dataPoint.fullName}</p>
        <p>Valor: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64">Carregando dados...</div>;

  return (
    <div className={`${chartWidth < 400 ? "p-2 sm:p-4" : "p-6"} bg-white shadow-md rounded-lg dark:bg-[#141414]`}>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Select
            onValueChange={(value) => {
              const selectedCreator = creators.find(c => c.nomeDocente === value);
              if (selectedCreator) {
                setSelectedCreator(selectedCreator.id);
                setSelectedCreatorName(selectedCreator.nomeDocente);
              }
            }}
            value={selectedCreatorName || ""}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Selecione o docente">
                {selectedCreatorName || "Selecione o docente"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {creators.map((creator) => (
                <SelectItem key={creator.id} value={creator.nomeDocente}>
                  {creator.nomeDocente}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <SmallSelect
            aria-label="Selecione o Bimestre"
            selectedType={selectedType}
            setSelectedType={valorVindoDoSelect}
            placeholder="Selecione o Bimestre"
            items={types}
          />
        </div>
      </div>
      {error ? (
        <div className="text-red-500 mb-4 flex items-center">
          <span className="material-icons mr-2">error</span>
          {error}
        </div>
      ) : data.length === 0 && !loading ? (
        <div className="text-center text-gray-500 mt-4">
          Nenhum feedback disponível para o bimestre selecionado.
        </div>
      ) : (
        <div className="h-[350px] w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: chartWidth < 400 ? 10 : 20,
                left: chartWidth < 400 ? 0 : 10,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={0}
                textAnchor="middle"
                height={60}
                tick={{ fontSize: chartWidth < 400 ? 9 : 11 }}
                interval={0}
              />
              <YAxis
                domain={[0, 5]}
                width={chartWidth < 400 ? 25 : 35}
                tick={{ fontSize: chartWidth < 400 ? 10 : 12 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Bar dataKey="value" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EngagementChart;