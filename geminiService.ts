import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  // Acesso direto ao process.env.API_KEY conforme diretriz
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
    
    INSTRUÇÕES PARA O RELATÓRIO:
    1. Seja direto e profissional.
    2. Liste **Pontos Fortes** e **Pontos de Atenção**.
    3. Nota de 0 a 10 para fit técnico.
    4. Use Markdown (negritos e listas).
    5. Termine com: "Assinado: Roberto."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const analysis = response.text || "Análise não gerada.";

    // Payload otimizado para Trello via Web3Forms
    // O subject vira o título do Card no Trello
    // O message vira a descrição do Card no Trello
    const web3FormData = {
      access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
      subject: `[CANDIDATO] ${data.name} - Web Designer JR`,
      from_name: "Portal de Vagas João Apolinário",
      name: data.name,
      email: data.email,
      message: `
### 👤 DADOS DO CANDIDATO
---
**Nome:** ${data.name}
**E-mail:** ${data.email}
**Portfólio:** ${data.portfolio}
**Experiência:** ${data.experience}

### 📝 RESPOSTAS DO QUIZ
---
${data.answers.map(a => `**${a.questionId}:** ${a.answer}`).join('\n')}

### 🤖 ANÁLISE DO ROBERTO (IA)
---
${analysis}

---
*Enviado via Portal de Recrutamento João Apolinário*
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
      console.error("Web3Forms Erro:", web3Result.message);
      throw new Error(web3Result.message);
    }

    return analysis;
  } catch (error) {
    console.error("Falha crítica no envio:", error);
    throw error;
  }
};