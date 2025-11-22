import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-stone-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-bold text-teal-900 tracking-tight">Mindful Tech</h1>
        <p className="text-2xl text-gray-600 leading-relaxed">
          Regain control of your attention. <br/>
          Break free from the scroll and reconnect with reality.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/assessment" 
            className="bg-teal-600 hover:bg-teal-700 text-white text-xl font-semibold px-10 py-4 rounded-full shadow-xl transition transform hover:scale-105 inline-block"
          >
            Check your Smartphone Usage Score
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Takes less than 2 minutes • Based on scientific research
          </p>
        </div>
      </div>
    </main>
  );
}

