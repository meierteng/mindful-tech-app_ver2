import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';
import { MBRP_PROGRAMS } from '@/data/mbrpPrompts';
import { redirect } from 'next/navigation';

export default async function SessionPage(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const programId = params.id;
  const day = parseInt(searchParams.day) || 1;

  const program = MBRP_PROGRAMS[programId];
  if (!program) {
    redirect('/dashboard');
  }

  const sessionData = program.days.find(d => d.day === day);
  if (!sessionData) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-teal-700 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold">{sessionData.title}</h1>
            <p className="opacity-90 mt-2 text-teal-100">
              {programId === '5-day' ? 'Standard Program' : programId === '3-day' ? 'Compact Program' : 'Intensive'}
            </p>
          </div>
          
          <div className="p-6">
            <ChatInterface 
              programType={programId}
              day={day}
              systemPrompt={sessionData.systemPrompt}
              title={sessionData.title}
              audioKey={sessionData.audio}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

