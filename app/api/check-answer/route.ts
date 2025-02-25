import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer } = await request.json();

    // DeepSeek AI API-тай холбогдох хэсэг
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
        ]
      }),
    });

    const aiResponse = await deepseekResponse.json();
    const feedback = aiResponse.choices[0].message.content;
    
    // Хариулт зөв эсэхийг шалгах энгийн логик
    const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase());

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