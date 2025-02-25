import { QuestionType } from '@/types';
import { searchPexelsPhotos } from './pexels';

// Сэдэв бүрт тохирох хайлтын түлхүүр үгс
const searchTerms = {
  animals: {
    'заан': 'elephant',
    'арслан': 'lion',
    'баавгай': 'bear',
    'үнэг': 'fox',
    'туулай': 'rabbit',
    'морь': 'horse'
  },
  flags: {
    'монгол': 'mongolia flag',
    'япон': 'japan flag',
    'солонгос': 'korea flag',
    'хятад': 'china flag',
    'америк': 'usa flag',
    'англи': 'uk flag'
  },
  knowledge: {
    'машин': 'car',
    'онгоц': 'airplane',
    'гэр': 'mongolian ger',
    'ном': 'book',
    'цэцэг': 'flower',
    'мод': 'tree'
  },
  colors: {
    'улаан': 'red color',
    'хөх': 'blue color',
    'ногоон': 'green color',
    'шар': 'yellow color',
    'хар': 'black color',
    'цагаан': 'white color'
  }
};

// Статик зургуудын URL-ууд - нөөц хувилбар
const staticImages = {
  animals: {
    'заан': 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=800',
    'арслан': 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800',
    'баавгай': 'https://images.pexels.com/photos/158109/kodiak-brown-bear-adult-portrait-wildlife-158109.jpeg?auto=compress&cs=tinysrgb&w=800',
    'үнэг': 'https://images.pexels.com/photos/236622/pexels-photo-236622.jpeg?auto=compress&cs=tinysrgb&w=800',
    'туулай': 'https://images.pexels.com/photos/372166/pexels-photo-372166.jpeg?auto=compress&cs=tinysrgb&w=800',
    'морь': 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  flags: {
    'монгол': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/800px-Flag_of_Mongolia.svg.png',
    'япон': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/800px-Flag_of_Japan.svg.png',
    'солонгос': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/800px-Flag_of_South_Korea.svg.png',
    'хятад': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/800px-Flag_of_the_People%27s_Republic_of_China.svg.png',
    'америк': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/800px-Flag_of_the_United_States.svg.png',
    'англи': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/800px-Flag_of_the_United_Kingdom_%283-5%29.svg.png'
  },
  knowledge: {
    'машин': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    'онгоц': 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
    'гэр': 'https://images.pexels.com/photos/5998706/pexels-photo-5998706.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ном': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
    'цэцэг': 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=800',
    'мод': 'https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  colors: {
    'улаан': 'https://images.pexels.com/photos/40465/pexels-photo-40465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'хөх': 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ногоон': 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=800',
    'шар': 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
    'хар': 'https://images.pexels.com/photos/1937743/pexels-photo-1937743.jpeg?auto=compress&cs=tinysrgb&w=800',
    'цагаан': 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
};

const questions: QuestionType[] = [
  // Амьтад
  {
    id: 'animal-1',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'заан',
    imageUrl: '', // Зургийг динамикаар авна
    category: 'animals',
  },
  {
    id: 'animal-2',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'арслан',
    imageUrl: '',
    category: 'animals',
  },
  {
    id: 'animal-3',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'баавгай',
    imageUrl: '',
    category: 'animals',
  },
  {
    id: 'animal-4',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'үнэг',
    imageUrl: '',
    category: 'animals',
  },
  {
    id: 'animal-5',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'туулай',
    imageUrl: '',
    category: 'animals',
  },
  {
    id: 'animal-6',
    question: 'Энэ ямар амьтан бэ?',
    answer: 'морь',
    imageUrl: '',
    category: 'animals',
  },
  
  // Орны далбаа
  {
    id: 'flag-1',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'монгол',
    imageUrl: '',
    category: 'flags',
  },
  {
    id: 'flag-2',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'япон',
    imageUrl: '',
    category: 'flags',
  },
  {
    id: 'flag-3',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'солонгос',
    imageUrl: '',
    category: 'flags',
  },
  {
    id: 'flag-4',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'хятад',
    imageUrl: '',
    category: 'flags',
  },
  {
    id: 'flag-5',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'америк',
    imageUrl: '',
    category: 'flags',
  },
  {
    id: 'flag-6',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'англи',
    imageUrl: '',
    category: 'flags',
  },
  
  // Танин мэдэхүй
  {
    id: 'knowledge-1',
    question: 'Энэ юу вэ?',
    answer: 'машин',
    imageUrl: '',
    category: 'knowledge',
  },
  {
    id: 'knowledge-2',
    question: 'Энэ юу вэ?',
    answer: 'онгоц',
    imageUrl: '',
    category: 'knowledge',
  },
  {
    id: 'knowledge-3',
    question: 'Энэ юу вэ?',
    answer: 'гэр',
    imageUrl: '',
    category: 'knowledge',
  },
  {
    id: 'knowledge-4',
    question: 'Энэ юу вэ?',
    answer: 'ном',
    imageUrl: '',
    category: 'knowledge',
  },
  {
    id: 'knowledge-5',
    question: 'Энэ юу вэ?',
    answer: 'цэцэг',
    imageUrl: '',
    category: 'knowledge',
  },
  {
    id: 'knowledge-6',
    question: 'Энэ юу вэ?',
    answer: 'мод',
    imageUrl: '',
    category: 'knowledge',
  },
  
  // Өнгө
  {
    id: 'color-1',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'улаан',
    imageUrl: '',
    category: 'colors',
  },
  {
    id: 'color-2',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'хөх',
    imageUrl: '',
    category: 'colors',
  },
  {
    id: 'color-3',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'ногоон',
    imageUrl: '',
    category: 'colors',
  },
  {
    id: 'color-4',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'шар',
    imageUrl: '',
    category: 'colors',
  },
  {
    id: 'color-5',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'хар',
    imageUrl: '',
    category: 'colors',
  },
  {
    id: 'color-6',
    question: 'Энэ ямар өнгө вэ?',
    answer: 'цагаан',
    imageUrl: '',
    category: 'colors',
  },
];

// Зургийн URL авах функц
export async function getImageUrl(category: string, answer: string): Promise<string> {
  try {
    // 1. Эхлээд статик зургуудаас хайх
    const staticCategory = staticImages[category as keyof typeof staticImages];
    if (staticCategory) {
      const staticUrl = staticCategory[answer.toLowerCase() as keyof typeof staticCategory];
      if (staticUrl) {
        console.log(`Using static image for ${answer}: ${staticUrl}`);
        return staticUrl;
      }
    }
    
    // 2. Статик зураг байхгүй бол Pexels API ашиглах
    const categoryTerms = searchTerms[category as keyof typeof searchTerms];
    
    if (!categoryTerms) {
      return `https://via.placeholder.com/800x600?text=${encodeURIComponent(category)}`;
    }
    
    const searchTerm = categoryTerms[answer.toLowerCase() as keyof typeof categoryTerms] || answer;
    
    // Pexels API ашиглан зураг хайх
    console.log(`Searching Pexels for: ${searchTerm}`);
    const pexelsUrl = await searchPexelsPhotos(searchTerm);
    
    if (pexelsUrl) {
      console.log(`Found Pexels image: ${pexelsUrl}`);
      return pexelsUrl;
    }
    
    // 3. Хэрэв API-с зураг олдохгүй бол placeholder ашиглах
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(searchTerm)}`;
  } catch (error) {
    console.error('Error in getImageUrl:', error);
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(answer)}`;
  }
}

// Асуултуудыг авах функц
export function getQuestions(category: string): QuestionType[] {
  return questions.filter(q => q.category === category);
}

// Зурагтай асуултуудыг авах функц
export async function getQuestionsWithImages(category: string): Promise<QuestionType[]> {
  const filteredQuestions = questions.filter(q => q.category === category);
  
  // Асуулт бүрт зураг нэмэх
  const questionsWithImages = await Promise.all(
    filteredQuestions.map(async (question) => {
      // Зургийн URL авах
      const imageUrl = await getImageUrl(question.category, question.answer);
      return { ...question, imageUrl };
    })
  );
  
  return questionsWithImages;
} 