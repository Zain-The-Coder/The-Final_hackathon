const Dashboard = () => {
  return (
    <DashboardLayout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-500">Welcome back! Here's what's happening in the community.</p>
      </header>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Contributions', value: '24', detail: '+2 this week', color: 'blue' },
          { label: 'Active Requests', value: '12', detail: '3 urgent', color: 'orange' },
          { label: 'Trust Score', value: '1,250', detail: 'Top 5%', color: 'purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111113] border border-white/5 p-6 rounded-2xl">
            <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold">{stat.value}</h3>
            <p className={`text-xs mt-2 text-${stat.color}-500`}>{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Recent Requests Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Help Requests</h2>
          <button className="text-sm text-blue-500 hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {/* Card Component */}
          <div className="bg-[#111113] border border-white/5 p-5 rounded-2xl hover:border-white/20 transition group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Web Development</span>
                <h3 className="text-lg font-medium mt-2 group-hover:text-blue-400 transition">Need help with React Context API debugging</h3>
              </div>
              <span className="text-red-500 text-xs font-bold px-2 py-1 bg-red-500/10 rounded-lg">High Urgency</span>
            </div>
            <p className="text-zinc-400 text-sm line-clamp-2">I am struggling with passing state through multiple components and getting re-rendering issues...</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">👤 Ali Khan</span>
              <span className="flex items-center gap-1">🕒 2 hours ago</span>
              <span className="flex items-center gap-1">💬 4 replies</span>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};