const Profile = () => {
    // Ye data Context API se aayega
    const user = { name: "Ali Ahmed", email: "ali@example.com", trustScore: 450, badges: ['Helpful Hand', 'Code Ninja'] };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-[#111113] border border-white/5 rounded-3xl p-10 flex items-center gap-8 mb-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                        {user.name[0]}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                        <p className="text-zinc-500 mb-4">{user.email}</p>
                        <div className="flex gap-3">
                            {user.badges.map(b => (
                                <span key={b} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm text-zinc-500 uppercase tracking-widest mb-1">Total Trust Score</p>
                        <h3 className="text-5xl font-black text-blue-500">{user.trustScore}</h3>
                    </div>
                </div>

                {/* Contribution Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#111113] border border-white/5 p-6 rounded-3xl">
                        <h4 className="text-lg font-semibold mb-4">Your Recent Help</h4>
                        <p className="text-zinc-500 text-sm">You haven't helped anyone recently. Start by exploring requests!</p>
                    </div>
                    <div className="bg-[#111113] border border-white/5 p-6 rounded-3xl">
                        <h4 className="text-lg font-semibold mb-4">Your Open Requests</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-sm">React Context API Bug</span>
                                <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-1 rounded">Open</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};