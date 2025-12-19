import { GoogleGenAI } from "@google/genai";
import { ApplicationData } from "./types.ts";

export const analyzeAndSubmitApplication = async (data: ApplicationData) => {
  // Inicializa o Gemini com a API Key do sistema
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
    1. Analise o perfil para o João Apolinário.
    2. Liste Pontos Fortes e Pontos de Atenção.
    3. Dê uma nota 0 a 10 de fit técnico.
    4. Use Markdown.
    5. Termine com: "Assinado: Roberto."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const analysis = response.text || "Análise indisponível no momento.";

    // Payload completo para Web3Forms chegar formatado no Trello
    const web3Payload = {
      access_key: "bd3a6d17-761c-4f13-a448-78a2663b2215",
      subject: `[VAGA] ${data.name} - Web Designer JR`, // Título do card no Trello
      from_name: "Portal de Vagas",
      name: data.name,
      email: data.email,
      message: `
### 👤 INFORMAÇÕES DO CANDIDATO
---
**Nome:** ${data.name}
**E-mail:** ${data.email}
**Portfólio:** ${data.portfolio}
**Experiência:** ${data.experience}

### 📝 RESPOSTAS DO FORMULÁRIO
---
${data.answers.map(a => `**${a.questionId}:** ${a.answer}`).join('\n')}

### 🤖 ANÁLISE TÉCNICA (ROBERTO IA)
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
      body: JSON.stringify(web3Payload)
    });

    const result = await web3Response.json();
    
    if (!result.success) {
      console.error("Erro no Web3Forms:", result.message);
      throw new Error(result.message);
    }

    return analysis;
  } catch (error) {
    console.error("Erro crítico no envio:", error);
    throw error;
  }
};