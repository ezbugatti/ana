export interface QuestionType {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
  category: 'animals' | 'flags' | 'knowledge' | 'colors';
} 