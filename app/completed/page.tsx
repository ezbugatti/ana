import Link from 'next/link';

export default function CompletedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-12 shadow-lg text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Баяр хүргэе!</h1>
        <p className="text-2xl text-gray-700 mb-8">Та бүх асуултыг амжилттай гүйцэтгэлээ!</p>
        
        <div className="flex justify-center">
          <Link href="/" className="py-4 px-8 bg-primary text-white rounded-2xl text-2xl hover:bg-blue-700 transition">
            Эхлэл хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
} 