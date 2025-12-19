import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  // Inicialização do SDK do Gemini usando a env API_KEY
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
    1. Gere um relatório para o João.
    2. Liste Pontos Fortes e Pontos de Atenção.
    3. Nota 0-10 de fit técnico.
    4. Use Markdown.
    5. Termine com: "Assinado: Roberto."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const analysis = response.text || "Sem análise disponível.";

    // Montagem do e-mail para o Trello
    // Subject = Título do Card
    // Message = Descrição do Card
    const web3Payload = {
      access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
      subject: `[VAGA] ${data.name} - Web Designer JR`,
      from_name: "Portal de Vagas João Apolinário",
      name: data.name,
      email: data.email,
      message: `
### 👤 PERFIL DO CANDIDATO
---
**NOME:** ${data.name}
**E-MAIL:** ${data.email}
**PORTFÓLIO:** ${data.portfolio}
**EXPERIÊNCIA:** ${data.experience}

### 📝 RESPOSTAS DO QUIZ
---
${data.answers.map(a => `**${a.questionId}:** ${a.answer}`).join('\n')}

### 🤖 ANÁLISE TÉCNICA (ROBERTO)
---
${analysis}

---
*Processado via @google/genai e Web3Forms*
      `.trim()
    };

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(web3Payload)
    });

    const result = await web3Response.json();
    
    if (!result.success) {
      console.error("Erro no Web3Forms:", result.message);
      throw new Error("Erro no provedor de e-mail.");
    }

    return analysis;
  } catch (error) {
    console.error("Erro no fluxo de candidatura:", error);
    throw error;
  }
};