import React from 'react';
import { Job } from '../types';

interface JobDetailProps {
  job: Job;
  onApply: () => void;
  onBack: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onApply, onBack }) => {
  return (
    <div className="animate-fadeIn pb-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-violet-600 font-black uppercase text-[9px] tracking-[0.2em] transition-colors mb-10"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Voltar ao Quadro
      </button>

      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-violet-600 text-white rounded-[2rem] flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-xl shadow-violet-500/20">
          {job.title[0]}
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-black leading-none mb-4">{job.title}</h1>
        <div className="flex justify-center gap-3">
           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{job.location}</span>
           <span className="text-[10px] font-black text-gray-200">•</span>
           <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{job.type}</span>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-6 border-b border-violet-50 pb-2">Sobre a Posição</h2>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            {job.description}
          </p>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-6 border-b border-violet-50 pb-2">Requisitos Base</h2>
          <ul className="space-y-4">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-4 text-gray-900 font-bold text-sm tracking-tight leading-tight">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* Card de Informações */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-violet-50 shadow-sm space-y-8 mt-16">
          <div>
            <span className="text-[9px] font-black text-violet-300 uppercase tracking-widest block mb-2">COMPENSAÇÃO</span>
            <span className="text-2xl font-black text-violet-600">{job.salary}</span>
          </div>
          
          <div>
            <span className="text-[9px] font-black text-violet-300 uppercase tracking-widest block mb-4">DISPONIBILIDADE</span>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-200" />
                Disponibilidade para alinhamentos
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-200" />
                Demandas nas manhãs e tardes
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação Principal */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 bg-white/90 backdrop-blur-md border-t border-gray-50 z-50">
          <div className="w-full max-w-[452px]">
            <button 
              onClick={onApply}
              className="w-full bg-violet-600 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-violet-700 transition-all active:scale-95 shadow-2xl shadow-violet-500/20"
            >
              INICIAR CANDIDATURA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;