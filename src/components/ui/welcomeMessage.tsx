"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import HumanSpace from "../../assets/images/HumaaansSpace.png";

interface WelcomeMessageProps {
  name: string;
}

export default function WelcomeMessage({ name }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Verifica se o usuário acabou de logar (podemos usar um marcador)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    
    if (justLoggedIn) {
      // Se acabou de logar, mostra a mensagem e remove o marcador
      setIsVisible(true);
      sessionStorage.removeItem('justLoggedIn');
      localStorage.removeItem('hideWelcomeMessage');
    } else {
      // Caso contrário, verifica a preferência salva
      const savedPreference = localStorage.getItem('hideWelcomeMessage');
      if (savedPreference === 'true') {
        setIsVisible(false);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hideWelcomeMessage', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="w-full relative">
      <div className="w-full bg-[#0077FF] flex flex-row rounded-[15px] text-[#FFFFFF] mt-2">
        <div className="p-8 w-1/2">
          <h1 className="text-3xl font-bold max-md:text-xl">Seja bem-vindo(a), {name} 👋</h1>
          <p className="w-80 max-md:w-40 max-md:text-sm">
            O sucesso é a soma de pequenos esforços repetidos dia após dia.
          </p>
        </div>
        <div className="w-1/2 flex justify-center">
          <Image 
            src={HumanSpace} 
            alt="Imagem ilustrativa" 
            width={300} 
            height={200} 
            className="max-md:w-[220px] max-md:h-[150px] max-md:object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}