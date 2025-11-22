import SurveyComponent from '@/components/SurveyComponent';

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Smartphone Addiction Assessment</h1>
        <p className="text-gray-600 mt-2">Based on the Smartphone Addiction Scale: Short Version (SAS-SV)</p>
      </div>
      <SurveyComponent />
    </main>
  );
}

