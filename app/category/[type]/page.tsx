'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Хуруугаар чирэх үед ашиглах хувьсагчид
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Хуруугаар чирэх минимум зай
  const minSwipeDistance = 50;

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

  // Амьтны категорид зориулсан өөрчлөлт
  useEffect(() => {
    if (currentQuestion && params.type === 'animals' && currentQuestion.audioFile) {
      // Амьтны дууг тоглуулах
      const audio = new Audio(currentQuestion.audioFile);
      audio.play().catch(error => {
        console.error('Error playing animal sound:', error);
      });
    }
  }, [currentQuestion, params.type]);

  // Асуулт өөрчлөгдөх үед дуу тоглуулах
  useEffect(() => {
    // Хуучин аудиог зогсоох
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Шинэ асуулт ачаалагдсан үед л аудио тоглуулах
    if (currentQuestion && currentQuestion.audioFile && params.type === 'animals') {
      // Хүлээх
      setTimeout(() => {
        // Шинэ аудиог тоглуулах
        const audio = new Audio(currentQuestion.audioFile);
        audioRef.current = audio;
        
        if (audioEnabled) {
          audio.play().catch(error => {
            console.error('Error playing animal sound:', error);
          });
        }
      }, 300); // Бага зэрэг хүлээх
    }
    
    // Цэвэрлэх функц
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentQuestion, params.type, audioEnabled]);

  // Хуруугаар чирэх үйлдлийг боловсруулах функцууд
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Зөв хариулсан эсвэл буруу хариулсан ч дараагийн асуулт руу шилжих боломжтой
    if (isLeftSwipe && isAnswerSubmitted) {
      handleNextQuestion();
    }
    
    // Баруун тийш чирвэл өмнөх асуулт руу буцах (хэрэгтэй бол)
    if (isRightSwipe && questionIndex > 0) {
      handlePreviousQuestion();
    }
  };

  // Өмнөх асуулт руу буцах
  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  // Сонголт сонгох функц
  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted && currentQuestion?.options && selectedOption !== null && currentQuestion.options[selectedOption].isCorrect) {
      // Хэрэв зөв хариулсан бол дахин хариулах боломжгүй
      return;
    }
    
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    
    if (!currentQuestion?.options) return;
    
    const isCorrect = currentQuestion.options[index].isCorrect;
    
    // Зөв эсвэл буруу дуу тоглуулах
    playAudio(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      // Зөв хариулт
      setFeedback({
        correct: true,
        message: 'Зөв байна! Маш сайн!'
      });
    } else {
      // Буруу хариулт - дахин оролдох боломжтой
      setFeedback({
        correct: false,
        message: 'Буруу байна. Дахин оролдоорой.'
      });
      
      // 2 секундын дараа feedback-ийг арилгах
      setTimeout(() => {
        setFeedback(null);
        setIsAnswerSubmitted(false); // Дахин хариулах боломжтой болгох
      }, 2000);
    }
  };

  // Дуу дахин тоглуулах функц
  const replaySound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error replaying animal sound:', error);
      });
    }
  };

  // Дараагийн асуулт руу шилжих
  const handleNextQuestion = () => {
    // Одоогийн аудиог зогсоох
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setFeedback(null);
    } else {
      // Бүх асуултыг дууссан
      router.push('/');
    }
  };

  // Асуулт алгасах
  const handleSkipQuestion = () => {
    // Одоогийн аудиог зогсоох
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
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
    <div 
      className="flex flex-col items-center p-6 min-h-screen"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Link href="/" className="absolute top-8 left-8 py-3 px-6 bg-gray-100 rounded-full text-gray-700 font-bold text-lg hover:bg-gray-200 transition">
        ← Буцах
      </Link>
      
      <div className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">{currentQuestion.question}</h2>
          
          {/* Дуу дахин тоглуулах товч */}
          {params.type === 'animals' && (
            <button
              title="Дуу дахин сонсох"
              onClick={replaySound}
              className="ml-4 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Амьтны категорид зориулсан харагдах байдал */}
        {params.type === 'animals' && (
          <div className="w-full mb-8">
            <div className="flex justify-center mb-4">
              <button 
                onClick={replaySound}
                className="py-3 px-6 bg-blue-500 text-white rounded-full flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Дуу дахин сонсох
              </button>
            </div>
            
            {/* Сонголтууд */}
            {currentQuestion.options && (
              <div className="grid grid-cols-2 gap-4 w-full">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswerSubmitted}
                    className={`p-4 rounded-xl border-4 transition ${
                      selectedOption === index 
                        ? (option.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="relative w-full h-40 mb-2">
                      <img 
                        src={option.imageUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(option.text)}`} 
                        alt={option.text}
                        className="rounded-lg object-cover w-full h-full"
                        onError={(e) => {
                          console.error('Image failed to load:', option.imageUrl);
                          e.currentTarget.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(option.text)}`;
                        }}
                      />
                    </div>
                    <p className="text-center mt-2 text-lg font-medium">{option.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Хуучин хариулт бичих хэсэг (амьтны категори биш үед) */}
        {params.type !== 'animals' && (
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
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                  <p className="text-gray-500">Зураг олдсонгүй</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Зөв хариултын хувьд дараагийн асуулт руу шилжих товч харуулах */}
        {feedback && feedback.correct && (
          <div className="mt-8 p-6 rounded-2xl w-full text-center bg-green-100 text-green-800">
            <p className="text-2xl mb-4">{feedback.message}</p>
            <button 
              title="Дараагийн асуулт руу шилжих"
              onClick={handleNextQuestion} 
              className="py-4 px-8 bg-secondary text-white border-none rounded-2xl text-2xl cursor-pointer hover:bg-green-700 transition flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
            <p className="mt-2 text-sm text-gray-600">Дараагийн асуулт руу шилжихийн тулд зүүн тийш чирнэ үү</p>
          </div>
        )}
        
        {/* Буруу хариултын хувьд зөвхөн мессеж харуулах */}
        {feedback && !feedback.correct && (
          <div className="mt-8 p-6 rounded-2xl w-full text-center bg-red-100 text-red-800">
            <p className="text-2xl mb-4">{feedback.message}</p>
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
        
        {/* Хуруугаар чирэх заавар */}
        {isAnswerSubmitted && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>Дараагийн асуулт руу шилжихийн тулд зүүн тийш чирнэ үү</p>
            <div className="flex justify-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 