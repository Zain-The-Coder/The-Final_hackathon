import React, { useState, useEffect } from 'react';
import { Award, Zap, Loader2, Users, Flame, Star, Trophy, Target } from 'lucide-react';
import api from '../api/axios';
import { cn } from '../utils/cn';

const Leaderboard = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchLeaderboard = async () => {
        try {
           const { data } = await api.get('/user/leaderboard');
           if (data.success) {
              setTopPerformers(data.leaderboard.map((user, idx) => ({
                 rank: idx + 1,
                 ...user,
                 solved: user.contributions || 0,
                 primarySkill: user.skills?.length > 0 ? user.skills[0] : (user.signupRole || 'Member'),
                 badgesList: user.badges?.length > 0 ? user.badges : []
              })));
           }
        } catch (error) {
           console.error("Failed to fetch leaderboard", error);
        } finally {
           setLoading(false);
        }
     };
     fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
      <Loader2 className="animate-spin text-[#0D9488]" size={40} />
    </div>
  );

  return (
    <div className="space-y-10 pb-16">
       {/* Hero Banner Section */}
       <div className="max-w-6xl mx-auto px-12 pt-8 pb-12">
          <section className="bg-charcoal text-white p-14 rounded-[40px] relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="space-y-6 relative z-10 max-w-4xl">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Leaderboard</div>
                <h1 className="text-5xl font-display font-bold leading-[1.1] tracking-tighter text-white">
                   Recognize the people who keep the community moving.
                </h1>
                <p className="text-white/60 text-xl font-medium max-w-2xl leading-relaxed">
                   Trust score, contribution count, and badges create visible momentum for reliable helpers.
                </p>
             </div>
          </section>
       </div>

       {/* Main Grid Content */}
       <div className="max-w-6xl mx-auto px-12 grid grid-cols-12 gap-8">
          
          {/* Left Column: Rankings */}
          <div className="col-span-12 lg:col-span-6 space-y-8">
             <div className="space-y-6 bg-white p-10 rounded-[40px] shadow-sm border border-charcoal/5">
                <div className="space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#0D9488]">Top Helpers</div>
                   <h2 className="text-4xl font-display font-bold tracking-tighter text-charcoal">Rankings</h2>
                </div>

                <div className="space-y-4">
                   {topPerformers.map((user) => (
                      <div key={user._id} className="p-8 rounded-[32px] bg-[#fbf9f5] border border-charcoal/5 hover:border-charcoal/10 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="relative">
                               <div className={cn(
                                 "w-16 h-16 rounded-[22px] flex items-center justify-center text-white font-black text-2xl transition-transform group-hover:scale-105",
                                 user.rank === 1 ? "bg-[#0D9488]" : user.rank === 2 ? "bg-charcoal" : "bg-charcoal/40"
                               )}>
                                  {user.name[0]}
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-white w-8 h-8 rounded-full border border-charcoal/5 flex items-center justify-center text-[10px] font-black shadow-md">
                                  #{user.rank}
                                </div>
                            </div>
                            <div className="space-y-1">
                               <div className="font-display font-bold text-xl text-charcoal tracking-tight">#{user.rank} {user.name}</div>
                               {user.primarySkill && (
                                 <div className="text-[11px] font-bold text-charcoal/40 uppercase tracking-widest">{user.primarySkill}</div>
                               )}
                            </div>
                         </div>
                         <div className="text-right space-y-1">
                            <div className="text-xl font-display font-bold text-charcoal">{user.trustScore}%</div>
                            <div className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest">{user.solved} contributions</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column: Trust and Achievement */}
          <div className="col-span-12 lg:col-span-6 space-y-8">
             <div className="space-y-6 bg-white p-10 rounded-[40px] shadow-sm border border-charcoal/5">
                <div className="space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#0D9488]">Badge System</div>
                   <h2 className="text-4xl font-display font-bold tracking-tighter text-charcoal">Trust and achievement</h2>
                 </div>

                <div className="space-y-6">
                   {topPerformers.slice(0, 5).map((user) => (
                      <div key={user._id} className="p-10 rounded-[40px] bg-[#fbf9f5] space-y-6 border border-charcoal/5">
                         <div className="space-y-2">
                            <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">{user.name}</h4>
                            {user.badgesList?.length > 0 && (
                                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-charcoal/40 uppercase tracking-widest">
                                   {user.badgesList.map((badge, i) => (
                                     <React.Fragment key={i}>
                                        <span>{badge}</span>
                                        {i < user.badgesList.length - 1 && <span className="opacity-20">•</span>}
                                     </React.Fragment>
                                   ))}
                                </div>
                            )}
                         </div>
                         
                         <div className="h-2 w-full bg-charcoal/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-[#0D9488] rounded-full transition-all duration-1000"
                              style={{ width: `${user.trustScore}%` }}
                            ></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default Leaderboard;
