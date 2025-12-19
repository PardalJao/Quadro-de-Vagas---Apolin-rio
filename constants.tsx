
import { Job } from './types';

export const OPEN_POSITIONS: Job[] = [
  {
    id: 'web-designer-jr-001',
    title: 'Web Designer Criativo JR',
    salary: 'R$ 2.000 / mês',
    type: 'Sem horário fixo',
    location: 'Remoto',
    active: true,
    description: 'Buscamos um talento com mentalidade de crescimento e sede de aprendizado para atuar como braço direito criativo em projetos digitais inovadores.',
    requirements: [
      'Domínio avançado de Figma',
      'Conhecimento em Geração de Imagens por IA (especificamente Nano Banana)',
      'Mentalidade de crescimento (growth mindset) e disposição para aprender novas tecnologias diariamente',
      'Disponibilidade obrigatória para alinhamentos e recebimento de demandas nos períodos da manhã e da tarde',
      'Foco total em design digital (landing pages, criativos, logos)',
      'Capacidade de autogestão para lidar com demanda diária variável'
    ],
    advantages: [
      'Capacidade de gerar vídeos com IA',
      'Conhecimentos em WordPress e Elementor',
      'Experiência prévia com ferramentas Gemini'
    ],
    demandInfo: 'Disponibilidade para alinhamentos e recebimento de demandas nas manhãs e tardes.'
  },
  {
    id: 'prog-python-closed',
    title: 'Programador em Python',
    salary: 'Encerrada',
    type: 'Tempo Integral',
    location: 'Remoto',
    active: false,
    description: '',
    requirements: [],
    advantages: [],
    demandInfo: ''
  },
  {
    id: 'copy-closed',
    title: 'Copywriter',
    salary: 'Encerrada',
    type: 'Freelancer',
    location: 'Remoto',
    active: false,
    description: '',
    requirements: [],
    advantages: [],
    demandInfo: ''
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'figma_exp',
    question: 'Qual seu nível de intimidade com o Figma?',
    type: 'radio',
    options: ['Iniciante', 'Intermediário', 'Avançado', 'Expert']
  },
  {
    id: 'ai_banana',
    question: 'Você já utilizou Nano Banana para gerar imagens?',
    type: 'radio',
    options: ['Sim, uso diariamente', 'Já testei', 'Ainda não, mas conheço o conceito']
  },
  {
    id: 'availability',
    question: 'Você confirma disponibilidade total para alinhamentos em horários comerciais (manhã e tarde)?',
    type: 'boolean',
  },
  {
    id: 'learning_mindset',
    question: 'Você possui uma mentalidade focada em aprendizado contínuo e evolução constante?',
    type: 'boolean',
  }
];
