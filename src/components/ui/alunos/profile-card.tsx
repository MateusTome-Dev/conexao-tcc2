import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/alunos/avatar";

interface StudentProfile {
  imageUrl?: string;
  nome: string;
  emailAluno: string;
  matriculaAluno: string;
}

interface ProfileCardProps {
  studentData: StudentProfile | null;
  loading: boolean;
  error: string | null;
}

export function ProfileCard({ studentData, loading, error }: ProfileCardProps) {
  const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-300 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-300 text-gray-600">...</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Carregando...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-300 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-red-100 text-red-600">!</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Erro</h2>
            <p className="text-sm text-white/90">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-300 p-4">
      <div className="flex items-center gap-2">
        <Avatar className="h-12 w-12">
          {studentData?.imageUrl ? (
            <AvatarImage src={studentData.imageUrl} alt={`Foto de ${studentData.nome}`} />
          ) : (
            <span className="sr-only">Sem foto</span>
          )}
          <AvatarFallback className="bg-white/20 text-white">
            {getInitials(studentData?.nome || "?")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white max-md:text-[16px]">
            {studentData?.nome || "Nome não disponível"}
          </h2>
          <p className="text-sm text-white/90 max-md:text-[11px]">
            {studentData?.emailAluno || "Email não disponível"}
          </p>
          <p className="text-xs text-white/80 max-md:text-[11px]">
            {studentData?.matriculaAluno || "Matrícula não disponível"}
          </p>
        </div>
      </div>
    </div>
  );
}