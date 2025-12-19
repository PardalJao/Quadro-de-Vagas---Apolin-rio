import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  // Inicialização do Gemini usando estritamente process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    1. Gere um relatório técnico detalhado para o João Apolinário.
    2. Liste **Pontos Fortes** e **Pontos de Atenção**.
    3. Dê uma nota de 0 a 10 para o fit técnico.
    4. Formate com **negritos** para facilitar a leitura.
    5. Termine com: "Assinado: Roberto."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const analysis = response.text || "Análise indisponível no momento.";

    // Integração com Web3Forms para disparar o e-mail para o Trello
    // Nota: O e-mail de destino configurado no Web3Forms deve ser o do Trello: 
    // joaovitorapolinario+09kyyudnmwrev4q8sijq@boards.trello.com
    const web3FormData = {
      access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
      subject: `Candidatura: ${data.name} - Web Designer JR`,
      from_name: "Portal de Vagas João Apolinário",
      name: data.name,
      email: data.email,
      message: `
--- DADOS DO CANDIDATO ---
NOME: ${data.name}
E-MAIL: ${data.email}
PORTFÓLIO: ${data.portfolio}
EXPERIÊNCIA: ${data.experience}

--- ANÁLISE TÉCNICA (ROBERTO) ---
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
      console.warn("Web3Forms reportou erro:", web3Result.message);
    }

    return analysis;
  } catch (error) {
    console.error("Erro no processamento da candidatura:", error);
    throw error;
  }
};