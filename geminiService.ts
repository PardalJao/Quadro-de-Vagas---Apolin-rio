import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  let analysis = "Análise automática não pôde ser gerada no momento.";
  
  // Tenta gerar a análise com a IA, mas não trava o processo se falhar
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      VOCÊ É O ROBERTO, ASSISTENTE TÉCNICO DE JOÃO APOLINÁRIO.
      Analise esta candidatura para a vaga de Web Designer Criativo JR.
      Nome: ${data.name} | Portfolio: ${data.portfolio} | Exp: ${data.experience}
      
      Gere um relatório curto (Markdown) com Pontos Fortes e Nota de 0-10.
      Assine como Roberto.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    if (response.text) analysis = response.text;
  } catch (aiError) {
    console.warn("IA indisponível, seguindo com envio simples.", aiError);
  }

  // ENVIO OBRIGATÓRIO PARA WEB3FORMS
  const web3Payload = {
    access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
    subject: `[VAGA] ${data.name} - Web Designer JR`,
    from_name: "Portal João Apolinário",
    name: data.name,
    email: data.email,
    message: `
### 👤 DADOS DO CANDIDATO
---
**NOME:** ${data.name}
**E-MAIL:** ${data.email}
**PORTFÓLIO:** ${data.portfolio}
**EXPERIÊNCIA:** ${data.experience}

### 🤖 ANÁLISE TÉCNICA (ROBERTO)
---
${analysis}

### 📝 RESPOSTAS DO QUIZ
---
${data.answers.map(a => `**${a.questionId}:** ${a.answer}`).join('\n')}
    `.trim()
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(web3Payload)
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    return analysis;
  } catch (error) {
    console.error("Erro crítico no Web3Forms:", error);
    throw error;
  }
};