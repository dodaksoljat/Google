import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyPlan, NutritionPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateWorkoutPlan(profile: UserProfile): Promise<WeeklyPlan> {
  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const prompt = `Atue como um Personal Trainer especialista em musculação e fisiologia do exercício. 
  Crie um plano de treino semanal detalhado para o seguinte perfil:
  Nome: ${profile.name || "Aluno"}
  Altura: ${profile.height}cm
  Peso: ${profile.weight}kg (IMC: ${bmi.toFixed(1)})
  Objetivo: ${profile.goal}
  Nível: ${profile.level}
  Disponibilidade: ${profile.availability}
  Restrições: ${profile.restrictions}

  O treino deve ser otimizado considerando a relação peso/altura (biotipo).
  Para cada exercício, inclua: Nome, Séries/Reps, Tempo de Descanso, Carga sugerida, Instrução de Execução e um 'videoSearchQuery' (uma string de busca para o YouTube que mostre a execução correta, ex: 'execução correta agachamento livre').
  
  Responda estritamente em formato JSON seguindo o esquema fornecido.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      setsReps: { type: Type.STRING },
                      rest: { type: Type.STRING },
                      suggestedLoad: { type: Type.STRING },
                      execution: { type: Type.STRING },
                      videoSearchQuery: { type: Type.STRING },
                    },
                    required: ["name", "setsReps", "rest", "suggestedLoad", "execution", "videoSearchQuery"],
                  },
                },
              },
              required: ["day", "focus", "exercises"],
            },
          },
        },
        required: ["title", "days"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as WeeklyPlan;
  } catch (error) {
    console.error("Failed to parse workout plan:", error);
    throw new Error("Erro ao gerar o plano de treino. Tente novamente.");
  }
}

export async function generateNutritionTips(profile: UserProfile): Promise<NutritionPlan> {
  const prompt = `Atue como um Nutricionista Esportivo. 
  Crie dicas de alimentação personalizadas para o seguinte perfil:
  Altura: ${profile.height}cm
  Peso: ${profile.weight}kg
  Objetivo: ${profile.goal}
  Nível de atividade: ${profile.availability}

  Forneça recomendações de macros, calorias estimadas e dicas práticas por categoria (Pré-treino, Pós-treino, Hidratação, etc).
  Responda estritamente em formato JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          dailyCalories: { type: Type.STRING },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fats: { type: Type.STRING },
            },
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
        required: ["title", "recommendations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as NutritionPlan;
  } catch (error) {
    throw new Error("Erro ao gerar dicas de nutrição.");
  }
}
