// Аудио тоглуулах хялбар функц
export function playAudio(type: 'correct' | 'wrong' | 'next') {
  // Хөтөч дээр ажиллаж байгаа эсэхийг шалгах
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Аудио файлын зам
    const audioPath = `/audio/${type}.mp3`;
    
    // Аудио элемент үүсгэх
    const audio = new Audio(audioPath);
    
    // Аудио тоглуулах
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      
      // iOS дээр хэрэглэгчийн харилцан үйлдэл шаардагддаг
      console.log('Audio playback requires user interaction on iOS devices');
    });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}

// Тодорхой аудио файл тоглуулах
export function playCustomAudio(audioPath: string) {
  // Хөтөч дээр ажиллаж байгаа эсэхийг шалгах
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Аудио элемент үүсгэх
    const audio = new Audio(audioPath);
    
    // Аудио тоглуулах
    return audio.play().catch(error => {
      console.error('Error playing audio:', error);
      
      // iOS дээр хэрэглэгчийн харилцан үйлдэл шаардагддаг
      console.log('Audio playback requires user interaction on iOS devices');
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    return Promise.reject(error);
  }
}

// Асуултыг дуут хэлбэрээр хэлэх функц (хэрэглэхгүй)
export function speakText(text: string, language: string = 'mn-MN') {
  // Энэ функцийг хэрэглэхгүй
  console.log('Text-to-speech is disabled, using pre-recorded audio instead');
}

// Дуу хоолой тохируулж, хэлэх функц
function setVoiceAndSpeak(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], language: string) {
  // Монгол хэлний дуу хоолой байгаа эсэхийг шалгах
  let voice = voices.find(v => v.lang.includes('mn'));
  
  // Монгол хэлний дуу хоолой байхгүй бол англи хэлний дуу хоолой ашиглах
  if (!voice) {
    voice = voices.find(v => v.lang.includes('en'));
    if (voice) {
      utterance.lang = 'en-US'; // Хэлийг англи болгох
    }
  }
  
  // Хэрэв тохирох дуу хоолой олдвол тохируулах
  if (voice) {
    utterance.voice = voice;
    console.log('Selected voice:', voice.name, voice.lang);
  } else {
    console.warn('No suitable voice found, using default voice');
  }
  
  // Дуут хэлэх
  window.speechSynthesis.speak(utterance);
  
  // Chrome дээрх алдааг засах (15 секундээс урт текст хэлэхэд зогсдог)
  const resumeSpeaking = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(resumeSpeaking);
    } else {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);
} 