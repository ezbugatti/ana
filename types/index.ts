export interface QuestionType {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
  category: string;
  audioFile?: string;
  options?: {
    text: string;
    imageUrl: string;
    isCorrect: boolean;
  }[];
} 