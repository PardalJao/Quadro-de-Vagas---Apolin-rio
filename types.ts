
export interface Job {
  id: string;
  title: string;
  salary: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  advantages: string[];
  demandInfo: string;
  active: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[] | boolean;
}

export interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  portfolio: string;
  experience: string;
  notes: string;
  answers: QuizAnswer[];
}
