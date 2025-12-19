import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants.tsx';
import { Job, ApplicationData, QuizAnswer } from '../types.ts';
import { analyzeAndSubmitApplication } from '../geminiService.ts';

interface QuizProps {
  job: Job;
  onComplete: (result: string) => void;
  onCancel: () => void;
}

const Quiz: React.FC<QuizProps> = ({ job, onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio: '',
    experience: '',
    notes: '',
  });
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = QUIZ_QUESTIONS.length + 1;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, answer: value }];
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const application: ApplicationData = {
      jobId: job.id,
      name: formData.name,
      email: formData.email,
      portfolio: formData.portfolio,
      experience: formData.experience,
      notes: formData.notes,
      answers,
    };

    const summary = `
**Dados Enviados:**
**Nome:** ${formData.name}
**E-mail:** ${formData.email}
**Portfólio:** ${formData.portfolio}
**Experiência:** ${formData.experience}

Sua candidatura foi registrada e recebida por **João Apolinário**. Entraremos em contato se houver fit!
    `.trim();

    try {
      await analyzeAndSubmitApplication(application);
      onComplete(summary);
    } catch (error) {
      console.error("Erro no envio:", error);
      onComplete(summary); // Mostra o resumo mesmo se o webhook falhar (backup)
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="animate-fadeIn flex flex-col min-h-[60vh]">
      <div className="w-full h-1 bg-gray-50 mb-12 rounded-full overflow-hidden">
        <div 
          className="h-full bg-violet-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow">
        {step === 0 ? (
          <div className="animate-fadeIn">
            <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-4 block">Informações</span>
            <h2 className="text-3xl font-black tracking-tight text-black mb-10">Dados de Contato</h2>
            
            <div className="space-y-6">
              {[
                { label: 'Nome Completo', key: 'name', type: 'text' },
                { label: 'E-mail', key: 'email', type: 'email' },
                { label: 'Portfólio', key: 'portfolio', type: 'url', placeholder: 'Behance, Dribbble ou Site' },
                { label: 'Experiência', key: 'experience', type: 'text', placeholder: 'Ex: 2 anos' }
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">{field.label}</label>
                  <input 
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-500/5 outline-none font-medium text-sm transition-all"
                    value={(formData as any)[field.key]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : step <= QUIZ_QUESTIONS.length ? (
          <div key={step} className="animate-fadeIn">
            <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-4 block">Pergunta {step} de {QUIZ_QUESTIONS.length}</span>
            <h2 className="text-2xl font-black tracking-tight text-black mb-10 leading-tight">
              {QUIZ_QUESTIONS[step - 1].question}
            </h2>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[step - 1].type === 'boolean' ? (
                <div className="grid grid-cols-2 gap-4">
                  {['Sim', 'Não'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerChange(QUIZ_QUESTIONS[step - 1].id, opt === 'Sim')}
                      className={`p-6 rounded-[2rem] border transition-all font-bold text-sm ${
                        answers.find(a => a.questionId === QUIZ_QUESTIONS[step - 1].id)?.answer === (opt === 'Sim')
                          ? 'border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                          : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-violet-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                QUIZ_QUESTIONS[step - 1].options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerChange(QUIZ_QUESTIONS[step - 1].id, opt)}
                    className={`w-full text-left p-6 rounded-[2rem] border transition-all font-bold text-sm ${
                      answers.find(a => a.questionId === QUIZ_QUESTIONS[step - 1].id)?.answer === opt
                        ? 'border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-violet-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-12 flex justify-between gap-4">
        <button onClick={handleBack} className="text-gray-400 hover:text-violet-600 font-black uppercase text-[10px] tracking-widest transition-colors py-4">
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </button>
        <button 
          disabled={step === 0 ? (!formData.name || !formData.email || !formData.portfolio || !formData.experience) : !answers.find(a => a.questionId === QUIZ_QUESTIONS[step - 1].id) || isSubmitting}
          onClick={step === QUIZ_QUESTIONS.length ? handleSubmit : handleNext}
          className="bg-violet-600 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-violet-700 disabled:opacity-20 transition-all shadow-xl shadow-violet-500/20"
        >
          {isSubmitting ? 'Processando...' : (step === QUIZ_QUESTIONS.length ? 'Finalizar' : 'Próximo')}
        </button>
      </div>
    </div>
  );
};

export default Quiz;