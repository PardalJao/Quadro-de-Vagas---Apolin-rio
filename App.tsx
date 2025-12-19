import React, { useState } from 'react';
import Landing from './components/Landing';
import JobDetail from './components/JobDetail';
import Quiz from './components/Quiz';
import Success from './components/Success';
import { Job } from './types';

enum View {
  LANDING,
  DETAILS,
  QUIZ,
  SUCCESS
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationResult, setApplicationResult] = useState<string>('');

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setCurrentView(View.DETAILS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartApplication = () => {
    setCurrentView(View.QUIZ);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationComplete = (result: string) => {
    setApplicationResult(result);
    setCurrentView(View.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setCurrentView(View.LANDING);
    setSelectedJob(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Largura Total */}
      <header className="w-full py-6 border-b border-gray-50 bg-white sticky top-0 z-50 flex justify-center">
        <button onClick={reset} className="font-black text-[10px] uppercase tracking-[0.5em] text-violet-600 hover:text-violet-800 transition-colors">
          João Apolinário
        </button>
      </header>
      
      {/* Container de Conteúdo Centralizado */}
      <main className="flex-grow content-container py-8">
        {currentView === View.LANDING && (
          <Landing onJobSelect={handleJobSelect} />
        )}
        
        {currentView === View.DETAILS && selectedJob && (
          <JobDetail 
            job={selectedJob} 
            onApply={handleStartApplication}
            onBack={reset}
          />
        )}
        
        {currentView === View.QUIZ && selectedJob && (
          <Quiz 
            job={selectedJob} 
            onComplete={handleApplicationComplete}
            onCancel={() => setCurrentView(View.DETAILS)}
          />
        )}
        
        {currentView === View.SUCCESS && (
          <Success result={applicationResult} onHome={reset} />
        )}
      </main>

      {/* Footer Largura Total */}
      <footer className="w-full py-12 text-center border-t border-gray-50 bg-gray-50">
        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} João Apolinário
        </span>
      </footer>
    </div>
  );
};

export default App;