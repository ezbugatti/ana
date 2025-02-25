'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getQuestionsWithImages } from '@/utils/questions';
import { QuestionType } from '@/types';
import { speakText } from '@/utils/speech';

// Дуу хоолойнуудыг ачаалах функц
function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Дуу хоолойнуудыг ачаалах
    window.speechSynthesis.getVoices();
    
    // Хэрэглэгчийн харилцан үйлдлээр дуу хоолойг идэвхжүүлэх
    const enableSpeech = () => {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0; // Дуу гаргахгүй
      window.speechSynthesis.speak(utterance);
      
      // Хэрэглэгчийн харилцан үйлдлийн event listener-ийг устгах
      document.removeEventListener('click', enableSpeech);
    };
    
    // Хэрэглэгчийн эхний харилцан үйлдлийг хүлээх
    document.addEventListener('click', enableSpeech);
  }
}

export default function CategoryPage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    // Дуу хоолой дэмжигдэж байгаа эсэхийг шалгах
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
    }
    
    // Дуу хоолойнуудыг ачаалах
    loadVoices();
    
    async function loadQuestions() {
      setLoading(true);
      try {
        const questionsWithImages = await getQuestionsWithImages(params.type);
        setQuestions(questionsWithImages);
        if (questionsWithImages.length > 0) {
          setCurrentQuestion(questionsWithImages[0]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadQuestions();
  }, [params.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;
    
    setIsAnswerSubmitted(true);
    
    try {
      // DeepSeek AI-тай холбогдох хэсэг
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion?.question,
          correctAnswer: currentQuestion?.answer,
          userAnswer: userAnswer,
        }),
      });
      
      const data = await response.json();
      
      setFeedback({
        correct: data.isCorrect,
        message: data.feedback,
      });
    } catch (error) {
      console.error('Error checking answer:', error);
      // Хэрэв API алдаа заавал энгийн шалгалт хийх
      const isCorrect = userAnswer.toLowerCase().includes(currentQuestion?.answer.toLowerCase() || '');
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? 'Зөв байна!' : 'Буруу байна. Дахин оролдоорой.',
      });
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setUserAnswer('');
      setFeedback(null);
      setIsAnswerSubmitted(false);
    } else {
      // Бүх асуултыг дууссан үед
      router.push('/completed');
    }
  };

  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  // Асуултыг дуут хэлбэрээр хэлэх функц
  const handleSpeakQuestion = () => {
    if (currentQuestion) {
      // Хэрэглэгчийн харилцан үйлдлээр дуу хоолойг идэвхжүүлэх
      speakText(currentQuestion.question);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="text-2xl text-gray-600">Зургуудыг ачааллаж байна...</div>
        <div className="mt-4 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-2xl text-gray-600 flex justify-center items-center min-h-screen">Асуултууд олдсонгүй</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 py-3 px-6 bg-gray-100 rounded-full text-gray-700 font-bold text-lg hover:bg-gray-200 transition">
        ← Буцах
      </Link>
      
      <div className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center">
        <div className="w-full flex justify-center mb-8">
          <div className="relative w-full h-64 md:h-80">
            {currentQuestion.imageUrl ? (
              <>
                <img 
                  src={currentQuestion.imageUrl} 
                  alt={currentQuestion.question}
                  className="rounded-lg object-contain w-full h-full"
                  onError={(e) => {
                    console.error('Image failed to load:', currentQuestion.imageUrl);
                    e.currentTarget.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(currentQuestion.answer)}`;
                  }}
                />
                {/* Зургийн URL-ийг хэвлэх (зөвхөн хөгжүүлэлтийн үед) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-gray-500 break-all">
                    URL: {currentQuestion.imageUrl}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Зураг олдсонгүй</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">{currentQuestion.question}</h2>
          <button 
            onClick={handleSpeakQuestion}
            className="ml-4 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
            aria-label="Асуултыг дахин хэлэх"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
        
        {!speechSupported && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            Таны хөтөч дуут хэлэх функцийг дэмжихгүй байна. Chrome, Safari, эсвэл Edge хөтөч ашиглана уу.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            className="w-full py-6 px-4 text-2xl border-3 border-gray-300 rounded-2xl mb-4 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Хариултаа бичнэ үү..."
            disabled={isAnswerSubmitted}
            autoFocus
          />
          
          {!isAnswerSubmitted && (
            <button 
              type="submit" 
              className="py-4 px-8 bg-primary text-white border-none rounded-2xl text-2xl cursor-pointer hover:bg-blue-700 transition"
            >
              Хариулах
            </button>
          )}
        </form>
        
        {feedback && (
          <div className={`mt-8 p-6 rounded-2xl w-full text-center ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="text-2xl mb-4">{feedback.message}</p>
            <button 
              onClick={handleNextQuestion} 
              className="py-4 px-8 bg-secondary text-white border-none rounded-2xl text-2xl cursor-pointer hover:bg-green-700 transition"
            >
              Дараагийн асуулт
            </button>
          </div>
        )}
        
        <button 
          onClick={handleSkipQuestion} 
          className="mt-4 py-3 px-6 bg-gray-100 text-gray-600 border-none rounded-2xl text-lg cursor-pointer hover:bg-gray-200 transition"
        >
          Алгасах
        </button>
        
        <div className="mt-8 text-lg text-gray-600">
          {questionIndex + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
} 