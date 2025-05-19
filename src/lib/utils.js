import { predefinedQA } from "./const";

export const getRandomDelay = () => Math.floor(Math.random() * 2000) + 1000;

export function getPredefinedAnswer(userInput) {
  const normalized = userInput.toLowerCase();
  for (const item of predefinedQA) {
    if (item.keywords.some(kw => normalized.includes(kw))) {
      return item.answer;
    }
  }
    return null;
}
