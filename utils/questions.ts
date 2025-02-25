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

// Бүх амьтдын жагсаалт (Монгол нэр)
const animalsMongolian = [
  'заан', 'арслан', 'баавгай', 'туулай', 'үнэг', 'чоно', 'хулгана', 'тэмээ', 'морь', 'үхэр',
  'хонь', 'ямаа', 'гахай', 'нохой', 'муур', 'одоншувуу', 'хэрэм', 'загас', 'шувуу', 'тахиа', 'галуу',
  'нугас', 'хэрээ', 'бүргэд', 'баклан', 'матар', 'могой', 'мэлхий', 'хавч', 'аалз', 'эрвээхэй',
  'зөгий', 'хүрэн баавгай', 'цагаан баавгай', 'хирс', 'бар', 'ирвэс', 'хулан', 'зээр', 'бух', 'тугал',
  'унага', 'ботго', 'хурга', 'ишиг', 'гөлөг', 'мяаруу', 'туулайн зулзага', 'тоодог', 'тас'
];

// Бүх амьтдын жагсаалт (Галиг нэр - аудио файлын нэр)
const animalsGalig = [
  'Zaan', 'Arslan', 'Baavgai', 'Tuulai', 'Uneg', 'Chono', 'Khulgana', 'Temee', 'Mori', 'Ukher',
  'Khoni', 'Yamaa', 'Gakhai', 'Nokhoi', 'Muur', 'Odonshuvu', 'Kherem', 'Zagas', 'Shuvuu', 'Takhia', 'Galuu',
  'Nugas', 'Kheree', 'Burged', 'Baklan', 'Matar', 'Mogoi', 'Melkhii', 'Khavch', 'Aalz', 'Erveekhei',
  'Zogii', 'Khuren baavgai', 'Tsagaan baavgai', 'Khirs', 'Bar', 'Irves', 'Khulan', 'Zeer', 'Bukh', 'Tugal',
  'Unaga', 'Botgo', 'Khurga', 'Ishig', 'Golog', 'Myaaruu', 'Tuulain zulzaga', 'Toodog', 'Tas'
];

// Амьтдын асуултууд
const animalQuestions: QuestionType[] = animalsMongolian.map((animal, index) => ({
  id: `animal-${index + 1}`,
  question: 'Энэ ямар амьтан бэ?',
  answer: animal,
  imageUrl: '', // Зургийг динамикаар авна
  category: 'animals',
  audioFile: `/audio/animals/${animalsGalig[index]}.mp3`,
  options: [] // Сонголтуудыг динамикаар бүрдүүлнэ
}));

// Бусад асуултууд (орны далбаа гэх мэт)
const flagQuestions: QuestionType[] = [
  {
    id: 'flag-1',
    question: 'Энэ аль улсын далбаа вэ?',
    answer: 'монгол',
    imageUrl: '',
    category: 'flags',
  },
  // ... бусад далбааны асуултууд
];

// Бүх асуултуудыг нэгтгэх
const questions: QuestionType[] = [
  ...animalQuestions,
  ...flagQuestions,
  // ... бусад категорийн асуултууд
];

// Асуултуудыг категориор нь авах
export function getQuestionsByCategory(category: string): QuestionType[] {
  return questions.filter(q => q.category === category);
}

// Зурагтай асуултуудыг авах
export async function getQuestionsWithImages(category: string): Promise<QuestionType[]> {
  const categoryQuestions = getQuestionsByCategory(category);
  
  // Амьтны категори бол сонголтуудыг бүрдүүлэх
  if (category === 'animals') {
    return Promise.all(categoryQuestions.map(async (question) => {
      // Зөв хариултын зургийг авах
      const correctImageUrl = await getImageUrl(question.answer);
      
      // Санамсаргүй 3 буруу хариулт сонгох
      const otherAnimals = animalsMongolian.filter(animal => animal !== question.answer);
      const randomWrongAnswers = getRandomElements(otherAnimals, 3);
      
      // Буруу хариултуудын зургийг авах
      const wrongImageUrls = await Promise.all(randomWrongAnswers.map(animal => getImageUrl(animal)));
      
      // Зөв болон буруу хариултуудыг нэгтгэх
      const options = [
        { text: question.answer, imageUrl: correctImageUrl, isCorrect: true },
        ...randomWrongAnswers.map((animal, index) => ({
          text: animal,
          imageUrl: wrongImageUrls[index],
          isCorrect: false
        }))
      ];
      
      // Сонголтуудыг холих
      const shuffledOptions = shuffleArray(options);
      
      return {
        ...question,
        imageUrl: correctImageUrl,
        options: shuffledOptions
      };
    }));
  } else {
    // Бусад категорийн хувьд хуучин логикийг ашиглах
    return Promise.all(categoryQuestions.map(async (question) => {
      const imageUrl = await getImageUrl(question.answer);
      return { ...question, imageUrl };
    }));
  }
}

// Зураг авах функц
async function getImageUrl(keyword: string): Promise<string> {
  try {
    // Эхлээд статик зургуудаас хайх
    const staticImageUrl = getStaticImageUrl(keyword);
    if (staticImageUrl) {
      return staticImageUrl;
    }
    
    // Статик зураг байхгүй бол placeholder зураг буцаах
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(keyword)}`;
  } catch (error) {
    console.error('Error fetching image:', error);
    // Алдаа гарвал placeholder зураг буцаах
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(keyword)}`;
  }
}

// Статик зургийн URL авах
function getStaticImageUrl(keyword: string): string | null {
  // Амьтдын статик зургууд - бүх амьтдад зураг нэмж өгөх
  const animalImages: Record<string, string> = {
    'заан': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&h=600&fit=crop',
    'арслан': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop',
    'баавгай': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&h=600&fit=crop',
    'туулай': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
    'үнэг': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop',
    'чоно': 'https://images.unsplash.com/photo-1564352969906-8b7f46ba4b8b?w=800&h=600&fit=crop',
    'хулгана': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop',
    'тэмээ': 'https://images.unsplash.com/photo-1598113972215-96c018fb1a0c?w=800&h=600&fit=crop',
    'морь': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
    'үхэр': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&h=600&fit=crop',
    'хонь': 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&h=600&fit=crop',
    'ямаа': 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&h=600&fit=crop',
    'гахай': 'https://images.unsplash.com/photo-1593179357196-ea11a2e7c119?w=800&h=600&fit=crop',
    'нохой': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop',
    'муур': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
    'одоншувуу': 'https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?w=800&h=600&fit=crop',
    'хэрэм': 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=800&h=600&fit=crop',
    'загас': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&h=600&fit=crop',
    'шувуу': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop',
    'тахиа': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop',
    'галуу': 'https://images.unsplash.com/photo-1560713781-d4ef450854a0?w=800&h=600&fit=crop',
    'нугас': 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?w=800&h=600&fit=crop',
    'хэрээ': 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&h=600&fit=crop',
    'бүргэд': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&h=600&fit=crop',
    'баклан': 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=800&h=600&fit=crop',
    'матар': 'https://images.unsplash.com/photo-1559380619-f891d122a9e9?w=800&h=600&fit=crop',
    'могой': 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=600&fit=crop',
    'мэлхий': 'https://images.unsplash.com/photo-1590955559496-50316bd28ff2?w=800&h=600&fit=crop',
    'хавч': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&h=600&fit=crop',
    'аалз': 'https://images.unsplash.com/photo-1557121924-900c1d089a84?w=800&h=600&fit=crop',
    'эрвээхэй': 'https://images.unsplash.com/photo-1559535332-db9971090158?w=800&h=600&fit=crop',
    'зөгий': 'https://images.unsplash.com/photo-1588852656646-f483f1d2a39c?w=800&h=600&fit=crop',
    'хүрэн баавгай': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&h=600&fit=crop',
    'цагаан баавгай': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&h=600&fit=crop',
    'хирс': 'https://images.unsplash.com/photo-1598894000396-bc7e3242c75e?w=800&h=600&fit=crop',
    'бар': 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
    'ирвэс': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&h=600&fit=crop',
    'хулан': 'https://images.unsplash.com/photo-1598113923195-dce587818e69?w=800&h=600&fit=crop',
    'зээр': 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&h=600&fit=crop',
    'бух': 'https://images.unsplash.com/photo-1583499871880-de841d1ace2a?w=800&h=600&fit=crop',
    'тугал': 'https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?w=800&h=600&fit=crop',
    'унага': 'https://images.unsplash.com/photo-1553284965-fa17e1766dfe?w=800&h=600&fit=crop',
    'ботго': 'https://images.unsplash.com/photo-1626548307930-deac221f87d9?w=800&h=600&fit=crop',
    'хурга': 'https://images.unsplash.com/photo-1613318286904-862375d58c50?w=800&h=600&fit=crop',
    'ишиг': 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=800&h=600&fit=crop',
    'гөлөг': 'https://images.unsplash.com/photo-1583511655826-05700442982d?w=800&h=600&fit=crop',
    'мяаруу': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    'туулайн зулзага': 'https://images.unsplash.com/photo-1591561582301-7ce6587cc286?w=800&h=600&fit=crop',
    'тоодог': 'https://images.unsplash.com/photo-1621631210430-3b5514a1cec9?w=800&h=600&fit=crop',
    'тас': 'https://images.unsplash.com/photo-1620578508654-0cb11099f5fb?w=800&h=600&fit=crop'
  };
  
  return animalImages[keyword] || null;
}

// Англи хэл дээрх хайлтын түлхүүр үг авах
function getEnglishSearchTerm(keyword: string): string | null {
  const translations: Record<string, string> = {
    'заан': 'elephant',
    'арслан': 'lion',
    'баавгай': 'bear',
    'туулай': 'rabbit',
    'үнэг': 'fox',
    'чоно': 'wolf',
    'хулгана': 'mouse',
    'тэмээ': 'camel',
    'морь': 'horse',
    'үхэр': 'cow',
    'хонь': 'sheep',
    'ямаа': 'goat',
    'гахай': 'pig',
    'нохой': 'dog',
    'муур': 'cat',
    'одоншувуу': 'owl',
    'хэрэм': 'squirrel',
    'загас': 'fish',
    'шувуу': 'bird',
    'тахиа': 'chicken',
    'галуу': 'goose',
    'нугас': 'duck',
    'хэрээ': 'crow',
    'бүргэд': 'eagle',
    'баклан': 'cormorant',
    'матар': 'beaver',
    'могой': 'snake',
    'мэлхий': 'frog',
    'хавч': 'crab',
    'аалз': 'spider',
    'эрвээхэй': 'butterfly',
    'зөгий': 'bee',
    'хүрэн баавгай': 'brown bear',
    'цагаан баавгай': 'polar bear',
    'хирс': 'rhinoceros',
    'бар': 'tiger',
    'ирвэс': 'leopard',
    'хулан': 'wild horse',
    'зээр': 'gazelle',
    'бух': 'bull',
    'тугал': 'calf',
    'унага': 'foal',
    'ботго': 'baby camel',
    'хурга': 'lamb',
    'ишиг': 'kid goat',
    'гөлөг': 'puppy',
    'мяаруу': 'kitten',
    'туулайн зулзага': 'baby rabbit',
    'тоодог': 'bustard',
    'тас': 'vulture'
  };
  
  return translations[keyword] || null;
}

// Массиваас санамсаргүй элементүүд авах
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Массивын элементүүдийг холих
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => 0.5 - Math.random());
}

export default questions; 