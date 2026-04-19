import DashboardLayout from '../components/layout/DashboardLayout';

const AiCenter = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">AI Analytics Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Insight Card 1 */}
        <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 p-8 rounded-3xl">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            🤖
          </div>
          <h3 className="text-xl font-bold mb-3">Skill Gap Analysis</h3>
          <p className="text-zinc-400 text-sm mb-6">
            AI has detected that 60% of requests are in "React Logic". We suggest focusing on State Management tutorials.
          </p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 w-[60%] h-full" />
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="bg-[#111113] border border-white/5 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Trending Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'Tailwind', 'Python', 'Machine Learning', 'Figma'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};