import React from 'react';
import { OPEN_POSITIONS } from '../constants';
import { Job } from '../types';

interface LandingProps {
  onJobSelect: (job: Job) => void;
}

const Landing: React.FC<LandingProps> = ({ onJobSelect }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="text-center pb-12">
        <h1 className="text-4xl font-black tracking-tighter text-black mb-4 leading-none">
          Quadro de Vagas
        </h1>
        <p className="text-base font-bold text-gray-800 mb-2">
          Buscamos talentos excepcionais para a construção.
        </p>
        <p className="text-sm text-gray-400 font-medium leading-relaxed">
          Explore as posições em aberto e junte-se à nossa visão.
        </p>
      </section>

      {/* Lista de Vagas */}
      <div className="space-y-4">
        {OPEN_POSITIONS.map((job) => (
          <div 
            key={job.id} 
            onClick={() => job.active && onJobSelect(job)}
            className={`flex gap-5 p-6 rounded-[2rem] border transition-all ${
              job.active 
              ? 'border-gray-100 bg-white hover:border-violet-100 hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer group' 
              : 'border-transparent bg-gray-50/50 opacity-50 grayscale pointer-events-none'
            }`}
          >
            {/* Ícone */}
            <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-colors ${job.active ? 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white' : 'bg-gray-100 text-gray-300'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Conteúdo */}
            <div className="flex-grow pt-1">
              <h3 className="font-black text-base tracking-tight text-black mb-2">
                {job.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest bg-violet-50/50 px-2 py-0.5 rounded">
                  {job.salary}
                </span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                  {job.type}
                </span>
              </div>

              {job.active && (
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-violet-600/60 group-hover:text-violet-600 transition-colors">
                  Ver Detalhes
                  <svg className="w-2.5 h-2.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Informativo */}
      <div className="mt-16 p-8 bg-violet-50/30 rounded-[2.5rem] text-center border border-violet-50">
        <p className="text-[9px] font-black text-violet-300 uppercase tracking-widest mb-3">DÚVIDAS?</p>
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed px-4">
          Novas posições são abertas semanalmente. Se não encontrou o que busca hoje, volte em breve.
        </p>
      </div>
    </div>
  );
};

export default Landing;