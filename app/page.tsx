import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-800 text-center">Хүүхдийн танин мэдэхүйн карт</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link href="/category/animals" className="p-8 rounded-2xl bg-white shadow-lg text-center border-4 border-gray-200 hover:border-primary hover:-translate-y-2 transition-all duration-300">
          <h2 className="mb-4 text-2xl font-bold text-primary">Амьтад</h2>
          <p className="text-lg text-gray-700">Янз бүрийн амьтдыг таньж мэдэх</p>
        </Link>

        <Link href="/category/flags" className="p-8 rounded-2xl bg-white shadow-lg text-center border-4 border-gray-200 hover:border-primary hover:-translate-y-2 transition-all duration-300">
          <h2 className="mb-4 text-2xl font-bold text-primary">Орны далбаа</h2>
          <p className="text-lg text-gray-700">Улс орнуудын далбааг таньж мэдэх</p>
        </Link>

        <Link href="/category/knowledge" className="p-8 rounded-2xl bg-white shadow-lg text-center border-4 border-gray-200 hover:border-primary hover:-translate-y-2 transition-all duration-300">
          <h2 className="mb-4 text-2xl font-bold text-primary">Танин мэдэхүй</h2>
          <p className="text-lg text-gray-700">Ерөнхий танин мэдэхүйн мэдлэг</p>
        </Link>

        <Link href="/category/colors" className="p-8 rounded-2xl bg-white shadow-lg text-center border-4 border-gray-200 hover:border-primary hover:-translate-y-2 transition-all duration-300">
          <h2 className="mb-4 text-2xl font-bold text-primary">Үндсэн өнгө</h2>
          <p className="text-lg text-gray-700">Өнгөнүүдийг таньж мэдэх</p>
        </Link>
      </div>
    </main>
  );
}