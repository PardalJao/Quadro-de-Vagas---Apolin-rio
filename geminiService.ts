import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  // Inicialização segura garantindo que a API_KEY seja lida
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Configuração de API pendente. Por favor, verifique as variáveis de ambiente.");
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
    
    const analysis = response.text || "Análise não pôde ser gerada.";

    // Disparo para o Web3Forms
    // IMPORTANTE: No painel do Web3Forms, o e-mail de destino deve ser o seu e-mail do Trello.
    const web3FormData = {
      access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
      subject: `Nova Candidatura: ${data.name}`,
      from_name: "Portal de Vagas João Apolinário",
      name: data.name,
      email: data.email,
      message: `
IDENTIFICAÇÃO DO CANDIDATO
---------------------------
Nome: ${data.name}
E-mail: ${data.email}
Portfólio: ${data.portfolio}
Experiência: ${data.experience}

RESPOSTAS DO QUIZ
-----------------
${data.answers.map(a => `${a.questionId}: ${a.answer}`).join('\n')}

ANÁLISE DO ROBERTO (IA)
-----------------------
${analysis}
      `.trim()
    };

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(web3FormData)
    });

    const web3Result = await web3Response.json();
    if (!web3Result.success) {
      console.error("Erro no Web3Forms:", web3Result.message);
    }

    return analysis;
  } catch (error) {
    console.error("Falha no processo de envio:", error);
    throw error;
  }
};