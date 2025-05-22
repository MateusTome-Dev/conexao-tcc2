import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SmallSelect from "@/components/ui/institution/smallselect";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/alunos/selectCreator";
import { useParams } from 'next/navigation';  

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
  const { id } = useParams<{ id: string }>();
  const studentId = id ? parseInt(id, 10) : null;
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bimestre, setBimestre] = useState<number>(1);
  const [selectedType, setSelectedType] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'professor' | 'media'>('media');
  const [selectedOption, setSelectedOption] = useState<string>('media');

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBimestreChange = (value: string) => {
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

  const calculateAverage = (feedbackList: FeedbackData[]) => {
    if (feedbackList.length === 0) return [0, 0, 0, 0, 0];
    
    const sum = feedbackList.reduce((acc, curr) => {
      return {
        resposta1: acc.resposta1 + curr.resposta1,
        resposta2: acc.resposta2 + curr.resposta2,
        resposta3: acc.resposta3 + curr.resposta3,
        resposta4: acc.resposta4 + curr.resposta4,
        resposta5: acc.resposta5 + curr.resposta5,
      };
    }, { resposta1: 0, resposta2: 0, resposta3: 0, resposta4: 0, resposta5: 0 });

    return [
      sum.resposta1 / feedbackList.length,
      sum.resposta2 / feedbackList.length,
      sum.resposta3 / feedbackList.length,
      sum.resposta4 / feedbackList.length,
      sum.resposta5 / feedbackList.length,
    ];
  };

  const fetchCreators = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const resposta = await fetch("https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) throw new Error("Falha ao buscar os professores");

      const dados = await resposta.json();
      setCreators(dados);
      
    } catch (err: any) {
      console.error("Erro ao buscar professores:", err);
      setError(err.message || "Erro ao buscar os professores");
      setCreators([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      if (!studentId) throw new Error("ID do aluno não encontrado na URL");

      const resposta = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/feedback/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) throw new Error("Falha ao buscar os dados");

      const dados = await resposta.json();

      if (!dados || dados.length === 0) {
        setData([]);
        return;
      }

      const filteredByBimestre = dados.filter((item: FeedbackData) => item.bimestre === bimestre);

      if (filteredByBimestre.length === 0) {
        setData([]);
        return;
      }

      let values: number[] = [];
      let displayName = "Média Geral";
      
      if (viewMode === 'media') {
        // Calcula a média de todos os professores
        values = calculateAverage(filteredByBimestre);
      } else {
        // Filtra por professor selecionado
        const filteredByCreator = selectedCreator
          ? filteredByBimestre.filter((item: FeedbackData) => item.createdByDTO?.id === selectedCreator.id)
          : filteredByBimestre;

        if (filteredByCreator.length === 0) {
          setData([]);
          return;
        }

        // Pega o primeiro feedback do professor selecionado
        const feedback = filteredByCreator[0];
        values = [
          feedback.resposta1,
          feedback.resposta2,
          feedback.resposta3,
          feedback.resposta4,
          feedback.resposta5,
        ];
        displayName = selectedCreator?.nomeDocente || "Professor";
      }

      const categories = [
        { tiny: "Eng", short: "Eng", full: "Engajamento" },
        { tiny: "Dis", short: "Disp", full: "Disposição" },
        { tiny: "Ent", short: "Ent", full: "Entrega" },
        { tiny: "Atn", short: "Aten", full: "Atenção" },
        { tiny: "Cmp", short: "Comp", full: "Comportamento" },
      ];

      const formattedData = categories.map((category, index) => ({
        name: chartWidth < 350 ? category.tiny : chartWidth < 600 ? category.short : category.full,
        fullName: category.full,
        value: values[index],
      }));

      setData(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [bimestre, selectedCreator, studentId, chartWidth, viewMode]);

  const handleCreatorChange = (value: string) => {
    if (value === 'media') {
      setViewMode('media');
      setSelectedCreator(null);
      setSelectedOption('media');
    } else {
      const creator = creators.find(c => c.nomeDocente === value);
      if (creator) {
        setSelectedCreator(creator);
        setViewMode('professor');
        setSelectedOption(creator.nomeDocente);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-semibold">{dataPoint.fullName}</p>
        <p>Valor: {payload[0].value.toFixed(2)}</p>
        {viewMode === 'media' && <p className="text-sm text-gray-500">Média de todos os professores</p>}
        {viewMode === 'professor' && selectedCreator && (
          <p className="text-sm text-gray-500">Professor: {selectedCreator.nomeDocente}</p>
        )}
      </div>
    );
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={`${chartWidth < 400 ? "p-2 sm:p-4" : "p-6"} bg-white shadow-md rounded-lg dark:bg-[#141414]`}>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Select
            value={selectedOption}
            onValueChange={handleCreatorChange}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue>
                {(value) => value === 'media' 
                  ? "Média de todos os professores" 
                  : creators.find(c => c.nomeDocente === value)?.nomeDocente || "Selecione um professor"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="media">Média de todos os professores</SelectItem>
              <SelectItem disabled>Professores individuais</SelectItem>
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
            setSelectedType={handleBimestreChange}
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
      ) : data.length > 0 ? (
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
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar 
                dataKey="value" 
                fill={viewMode === 'media' ? "#3182CE" : "#3182CE"} 
                name={viewMode === 'media' ? "Média Geral" : selectedCreator?.nomeDocente || "Professor"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          Nenhum feedback disponível para o filtro selecionado.
        </div>
      )}
    </div>
  );
};

export default EngagementChart;