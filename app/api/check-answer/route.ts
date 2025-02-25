import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer } = await request.json();

    // Хариултыг шалгах энгийн логик
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() || 
                      userAnswer.toLowerCase().includes(correctAnswer.toLowerCase());
    
    // Хариултыг шалгахад зарцуулах хугацааг симуляци хийх (хөгжүүлэлтийн үед)
    // Бодит орчинд энэ хэсгийг устгана
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // DeepSeek API-тай холбогдох хэсэг
    let feedback = '';
    try {
      // Хариултыг шалгах хурдыг сайжруулах
      // Хэрэв хариулт маш тодорхой зөв эсвэл буруу бол DeepSeek API-г дуудахгүй
      if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
        feedback = 'Зөв байна! Маш сайн!';
      } else if (isCorrect) {
        // Хэрэв хариулт ойролцоо зөв бол DeepSeek API-г дуудах
        const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'Та 3-4 насны хүүхдэд зориулсан танин мэдэхүйн аппликейшний хариултыг шалгаж байна. Хариулт зөв эсэхийг шалгаад, энгийн үгээр хариу өгнө үү. Хариулт нь богино, хүүхдэд ойлгомжтой байх ёстой.'
              },
              {
                role: 'user',
                content: `Асуулт: "${question}"\nЗөв хариулт: "${correctAnswer}"\nХүүхдийн хариулт: "${userAnswer}"\n\nХүүхдийн хариулт зөв эсэхийг шалгаад, хариу өгнө үү. Хариулт нь богино, хүүхдэд ойлгомжтой байх ёстой.`
              }
            ],
            max_tokens: 100, // Хариултын урт хязгаарлах
            temperature: 0.3, // Хариултын тодорхой байдлыг нэмэгдүүлэх
          }),
          // Хариултыг хүлээх хугацааг хязгаарлах
          signal: AbortSignal.timeout(3000), // 3 секундын дотор хариулт ирэхгүй бол цуцлах
        });

        const aiResponse = await deepseekResponse.json();
        feedback = aiResponse.choices[0].message.content;
      } else {
        feedback = 'Буруу байна. Дахин оролдоорой.';
      }
    } catch (error) {
      console.error('Error with DeepSeek API:', error);
      // DeepSeek API алдаа гарвал энгийн хариулт ашиглах
      feedback = isCorrect ? 'Зөв байна! Маш сайн!' : 'Буруу байна. Дахин оролдоорой.';
    }

    return NextResponse.json({
      isCorrect,
      feedback: feedback || (isCorrect ? 'Зөв байна! Маш сайн!' : 'Буруу байна. Дахин оролдоорой.'),
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { 
        isCorrect: false,
        feedback: 'Хариултыг шалгахад алдаа гарлаа. Дахин оролдоорой.' 
      },
      { status: 500 }
    );
  }
} 