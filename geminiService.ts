import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types";

const getApiKey = () => {
  try {
    // Verifica se process e process.env existem antes de acessar
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Ambiente process.env não disponível no navegador.");
  }
  return "";
};

const WEBHOOK_URL = "/api/webhook"; 

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("API_KEY não encontrada. Verifique as variáveis de ambiente na Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    VOCÊ É O ROBERTO, ASSISTENTE TÉCNICO DE JOÃO APOLINÁRIO.
    Analise esta candidatura para a vaga de Web Designer Criativo JR.
    
    DADOS DO CANDIDATO:
    Nome: ${data.name}
    E-mail: ${data.email}
    Portfólio: ${data.portfolio}
    Experiência: ${data.experience}
    
    RESPOSTAS DO QUIZ:
    ${data.answers.map(a => `- ${a.questionId}: ${a.answer}`).join('\n')}
    
    INSTRUÇÕES:
    1. Gere um relatório técnico detalhado.
    2. Liste **Pontos Fortes** e **Pontos de Atenção**.
    3. Dê uma nota de 0 a 10 para o fit técnico.
    4. Formate com **negritos** para facilitar a leitura no Trello.
    5. Termine com: "Assinado: Roberto."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const analysis = response.text || "Análise não disponível.";

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trello_email: "joaovitorapolinario+09kyyudnmwrev4q8sijq@boards.trello.com",
        candidate_name: data.name,
        candidate_email: data.email,
        portfolio: data.portfolio,
        analysis: analysis
      })
    });

    if (!res.ok) {
        console.warn("O webhook falhou, mas a análise foi gerada.");
    }
    
    return analysis;
  } catch (error) {
    console.error("Erro no processamento:", error);
    return "Candidatura enviada para processamento. Em breve você receberá um retorno.";
  }
};