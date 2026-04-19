import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';

const Leaderboard = () => {
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const res = await axios.get('http://localhost:5000/api/users/leaderboard');
            setTopUsers(res.data);
        };
        fetchLeaderboard();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                        Community Champions
                    </h1>
                    <p className="text-zinc-500 text-lg">Top helpers who are making an impact.</p>
                </div>

                <div className="bg-[#111113] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-zinc-400 text-xs uppercase tracking-widest">
                                <th className="px-8 py-5 font-semibold">Rank</th>
                                <th className="px-8 py-5 font-semibold">User</th>
                                <th className="px-8 py-5 font-semibold">Badges</th>
                                <th className="px-8 py-5 font-semibold text-right">Trust Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {topUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-xs text-zinc-500">{user.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            {user.badges.map(badge => (
                                                <span key={badge} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20 font-medium">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-mono text-blue-400 font-bold">
                                        {user.trustScore} XP
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Leaderboard;