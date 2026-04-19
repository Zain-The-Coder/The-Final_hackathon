import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';

const Explore = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const res = await axios.get('http://localhost:5000/api/requests');
            setRequests(res.data);
        };
        fetchRequests();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Explore Help</h1>
                        <p className="text-zinc-400 text-lg">Browse community requests and offer your expertise.</p>
                    </div>
                    {/* Filter UI - Premium Style */}
                    <div className="flex gap-3 bg-[#111113] p-1.5 rounded-xl border border-white/5">
                        <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">All</button>
                        <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm text-zinc-400">High Urgency</button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {requests.map((req) => (
                        <div key={req._id} className="bg-[#111113] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                                            {req.category}
                                        </span>
                                        {req.urgency === 'High' && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/20">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">{req.title}</h3>
                                    <p className="text-zinc-400 line-clamp-2 mb-4">{req.description}</p>
                                    
                                    {/* AI Suggested Tags */}
                                    <div className="flex gap-2 mb-4">
                                        {req.tags.map(tag => (
                                            <span key={tag} className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">#{tag}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-zinc-500 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">👤</div>
                                            <span>{req.user?.name}</span>
                                        </div>
                                        <span>🕒 {new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="ml-6 px-6 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition whitespace-nowrap">
                                    I can help
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Explore;