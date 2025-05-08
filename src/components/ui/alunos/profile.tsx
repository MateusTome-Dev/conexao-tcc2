import Image from "next/image";

interface ProfileInfoProps {
  imageUrl: string;
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  registrationNumber: string;
}

export function ProfileInfo({
  imageUrl,
  name,
  email,
  birthDate,
  phone,
  registrationNumber,
}: ProfileInfoProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            width={80}
            height={80}
            className="rounded-full w-16 h-16 md:w-20 md:h-20"
            alt="Foto de perfil"
          />
        ) : (
          <span className="text-gray-500">Sem foto</span>
        )}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white">
            {name}
          </h2>
          <p className="text-gray-500 text-sm md:text-base">{email}</p>
        </div>
      </div>
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-[#ffffffd8]">
            Nome Completo
          </label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-full p-2 text-sm sm:text-base rounded-lg border text-gray-700 border-blue-100 bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414] cursor-not-allowed focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-[#ffffffd8]">
            Data de Nascimento
          </label>
          <input
            type="text"
            value={formatDate(birthDate)}
            readOnly
            className="w-full p-2 text-sm sm:text-base rounded-lg border text-gray-700 border-blue-100 bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414] cursor-not-allowed focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-[#ffffffd8]">
            Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 text-sm sm:text-base rounded-lg border text-gray-700 border-blue-100 bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414] cursor-not-allowed focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-[#ffffffd8]">
            Telefone
          </label>
          <input
            type="tel"
            value={phone}
            readOnly
            className="w-full p-2 text-sm sm:text-base rounded-lg border text-gray-700 border-blue-100 bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414] cursor-not-allowed focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-[#ffffffd8]">
            Nº Matrícula
          </label>
          <input
            type="text"
            value={registrationNumber}
            readOnly
            className="w-full p-2 text-sm sm:text-base rounded-lg border text-gray-700 border-blue-100 bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414] cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
