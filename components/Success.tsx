import React from 'react';

interface SuccessProps {
  result: string;
  onHome: () => void;
}

const Success: React.FC<SuccessProps> = ({ result, onHome }) => {
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <strong key={index} className="text-violet-700 font-black">{content}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="animate-fadeIn py-12 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-violet-600 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-violet-500/30">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      
      <h1 className="text-3xl font-black text-black tracking-tight mb-4 leading-none text-center">Tudo Pronto!</h1>
      <p className="text-gray-400 font-medium text-sm mb-12 px-8 text-center">
        Obrigado pela candidatura. O processo foi concluído e seu perfil já está na fila de avaliação.
      </p>

      <div className="bg-violet-50/40 rounded-[2.5rem] p-8 mb-12 text-left border border-violet-100 w-full">
        <span className="text-[9px] font-black text-violet-300 uppercase tracking-widest block mb-4">CONFIRMAÇÃO DE REGISTRO</span>
        <div className="text-gray-600 font-medium whitespace-pre-line leading-relaxed text-[13px]">
          {renderMarkdown(result)}
        </div>
      </div>

      <button 
        onClick={onHome}
        className="w-full bg-violet-600 text-white py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/10"
      >
        Voltar ao Início
      </button>
    </div>
  );
};

export default Success;