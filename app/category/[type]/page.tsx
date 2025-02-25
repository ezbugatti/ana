'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getQuestionsWithImages } from '@/utils/questions';
import { playAudio } from '@/utils/speech';
import { QuestionType } from '@/types';

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
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const answerTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // iOS дээр аудио тоглуулахыг идэвхжүүлэх
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    
    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      
      // Таймерийг цэвэрлэх
      if (answerTimeout.current) {
        clearTimeout(answerTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    // Дуу хоолой дэмжигдэж байгаа эсэхийг шалгах
    if (typeof window !== 'undefined') {
      loadVoices();
    }
    
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

  // Хариулт өөрчлөгдөх үед автоматаар илгээх
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    // Хэрэв хариулт бичиж эхэлсэн бол таймер тохируулах
    if (value.trim().length > 0) {
      // Өмнөх таймерийг цэвэрлэх
      if (answerTimeout.current) {
        clearTimeout(answerTimeout.current);
      }
      
      // Шинэ таймер тохируулах - 1.5 секундын дараа хариултыг илгээх
      answerTimeout.current = setTimeout(() => {
        if (!isAnswerSubmitted && value.trim().length > 0) {
          handleSubmit(new Event('submit') as any);
        }
      }, 1500);
    }
  };

  // Энтер дарах үед хариултыг илгээх
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (userAnswer.trim().length > 0 && !isAnswerSubmitted) {
        handleSubmit(new Event('submit') as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim() || isAnswerSubmitted || isCheckingAnswer) return;
    
    setIsAnswerSubmitted(true);
    setIsCheckingAnswer(true);
    
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
      
      const feedbackMessage = {
        correct: data.isCorrect,
        message: data.feedback,
      };
      
      setFeedback(feedbackMessage);
      
      // Зөв эсвэл буруу аудио тоглуулах
      if (audioEnabled) {
        playAudio(data.isCorrect ? 'correct' : 'wrong');
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      // Хэрэв API алдаа заавал энгийн шалгалт хийх
      const isCorrect = userAnswer.toLowerCase().includes(currentQuestion?.answer.toLowerCase() || '');
      const feedbackMessage = {
        correct: isCorrect,
        message: isCorrect ? 'Зөв байна! Маш сайн!' : 'Буруу байна. Дахин оролдоорой.',
      };
      
      setFeedback(feedbackMessage);
      
      // Зөв эсвэл буруу аудио тоглуулах
      if (audioEnabled) {
        playAudio(isCorrect ? 'correct' : 'wrong');
      }
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      // Дараагийн асуулт руу шилжих аудио тоглуулах
      if (audioEnabled) {
        playAudio('next');
      }
      
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setUserAnswer('');
      setFeedback(null);
      setIsAnswerSubmitted(false);
      
      // Фокусыг хариулт оруулах талбар руу шилжүүлэх
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Бүх асуултыг дууссан бол эхлэл хуудас руу буцах
      router.push('/');
    }
  };

  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-12 shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="mt-4 text-xl text-gray-600">Ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-12 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Алдаа гарлаа</h1>
          <p className="text-xl text-gray-700 mb-8">Асуултууд олдсонгүй.</p>
          <Link href="/" className="py-4 px-8 bg-primary text-white border-none rounded-2xl text-xl cursor-pointer hover:bg-blue-700 transition">
            Эхлэл хуудас руу буцах
          </Link>
        </div>
      </div>
    );
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
                    {/* URL: {currentQuestion.imageUrl} */}
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
        </div>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full py-6 px-4 text-2xl border-3 border-gray-300 rounded-2xl mb-4 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Хариултаа бичнэ үү..."
            disabled={isAnswerSubmitted}
            autoFocus
          />
          
          {!isAnswerSubmitted && !isCheckingAnswer && userAnswer.trim().length > 0 && (
            <div className="text-sm text-gray-500 mb-4">
              Хариулт бичиж дууссан бол хүлээнэ үү...
            </div>
          )}
          
          {isCheckingAnswer && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
              <span className="ml-3 text-gray-600">Хариултыг шалгаж байна...</span>
            </div>
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