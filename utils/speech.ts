// Текстийг дуут хэлбэрээр хэлэх хялбаршуулсан функц
export function speakText(text: string, language: string = 'mn-MN') {
  // Хөтөч дээр ажиллаж байгаа эсэхийг шалгах
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error('Speech synthesis is not supported');
    return;
  }

  try {
    // Хэлэх үйлдлийг зогсоох
    window.speechSynthesis.cancel();

    // Шинэ дуут хэлэх үйлдэл үүсгэх
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Хэл тохируулах
    utterance.lang = language;
    
    // Дуут хэлэх
    window.speechSynthesis.speak(utterance);
    
    console.log('Speaking text:', text);
  } catch (error) {
    console.error('Error speaking text:', error);
  }
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