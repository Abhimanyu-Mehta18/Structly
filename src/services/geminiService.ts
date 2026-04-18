import { GoogleGenAI, Type } from "@google/genai";
import { Goal, Milestone, Task, StartingBlock, EnergyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async decomposeGoal(goalTitle: string, description: string): Promise<Milestone[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Deconstruct this strategic vision into 5 realistic, high-impact milestones.
        Goal: ${goalTitle}
        Mission: ${description}
        
        Focus on immediate tactical steps and logical progression. Ensure milestones are verbs and actionable.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                isCompleted: { type: Type.BOOLEAN }
              },
              required: ["id", "title", "isCompleted"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Decomposition failed", error);
      return [];
    }
  },

  async generateStartingBlock(task: Task): Promise<StartingBlock> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a high-performance Executive Assistant. Generate a professional 'Starting Block' to eliminate the blank-page syndrome for this task.
        
        Task: ${task.title}
        Energy Profile: ${task.energyLevel}
        
        Deliver one of the following:
        - 'outline': A 3-5 point tactical framework.
        - 'draft': An opening paragraph or structural template.
        - 'research': 3 key domains to investigate or context-setting bullet points.
        
        Deliver authoritative, ready-to-use content.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['outline', 'links', 'draft', 'research'] },
              content: { type: Type.STRING }
            },
            required: ["type", "content"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Starting block generation failed", error);
      return { type: 'outline', content: "Failed to generate starting block. Just start the first step!" };
    }
  },

  async simulateDecision(action: string, currentTasks: Task[]): Promise<{ overview: string; impact: string; recommendation: string }> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a high-level Strategic Consultant. Simulate the long-term impact of embarking on this strategic goal: "${action}". 
        
        Current environment (pending tasks): ${currentTasks.map(t => t.title).join(", ")}
        
        Analyze the downstream effects on cognitive load, resource allocation, and timeline.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: "Broad strategic assessment" },
              impact: { type: Type.STRING, description: "Expected impact on resources/time" },
              recommendation: { type: Type.STRING, description: "Actionable advice for the user" }
            },
            required: ["overview", "impact", "recommendation"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return { 
        overview: "Simulation temporarily interrupted.", 
        impact: "Strategic data flow restricted.", 
        recommendation: "Continue with existing priorities while the simulation engine recalibrates." 
      };
    }
  },

  async processJournal(journalText: string): Promise<{ summary: string; nextActions: string[]; strategicInsight: string; negativeFriction: string; improvementPlan: string }> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this raw daily reflection and extract the signal from the noise. 
        Reflection: "${journalText}"
        
        Requirements:
        1. 'summary': A concise, professional executive summary of the day's intent and progress.
        2. 'nextActions': 2-3 tactical next steps for tomorrow, phrased as clear actions.
        3. 'strategicInsight': A single deep observation regarding the user's focus, friction, or momentum.
        4. 'negativeFriction': Identify any emotional or logistical bottlenecks, procrastination, or negative patterns mentioned.
        5. 'improvementPlan': Provide a specific, actionable advice to pivot or solve the identified negative friction.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              nextActions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              strategicInsight: { type: Type.STRING },
              negativeFriction: { type: Type.STRING },
              improvementPlan: { type: Type.STRING }
            },
            required: ["summary", "nextActions", "strategicInsight", "negativeFriction", "improvementPlan"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return { 
        summary: "Error processing journal", 
        nextActions: [], 
        strategicInsight: "Analysis engine temporarily offline. Strategic alignment preserved.",
        negativeFriction: "Unable to detect friction levels.",
        improvementPlan: "Maintain standard protocol."
      };
    }
  }
};
