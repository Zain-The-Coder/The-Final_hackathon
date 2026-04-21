import React, { useState, useEffect } from 'react';
import { Sparkles, Target, Zap, Activity, Users, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AiCenterPage = () => {
  const { user } = useAuth();
  const [pulse, setPulse] = useState(null);
  const [highUrgencyRequests, setHighUrgencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
        try {
           const [pulseRes, reqRes] = await Promise.all([
              api.get('/analytics/pulse'),
              api.get('/help/all?status=Open')
           ]);
           
           if (pulseRes.data.success) {
              setPulse(pulseRes.data.data);
           }
           if (reqRes.data.success) {
              // Filter out own requests and sort by urgency (High first)
              const othersRequests = reqRes.data.requests
                .filter(r => r.requester?._id !== user?._id)
                .sort((a, b) => {
                   if (a.urgency === 'High' && b.urgency !== 'High') return -1;
                   if (a.urgency !== 'High' && b.urgency === 'High') return 1;
                   return 0;
                });
              setHighUrgencyRequests(othersRequests.slice(0, 6));
           }
        } catch (error) {
           console.error("Failed to fetch AI Center data", error);
        } finally {
           setLoading(false);
        }
     };
     fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#0D9488]" size={40} />
        <p className="text-charcoal/40 font-bold text-xs uppercase tracking-widest">Inference engine active...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto px-8 pt-8">
       {/* AI Center Hero Section */}
       <section className="bg-charcoal text-white p-14 rounded-[40px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="space-y-6 relative z-10 max-w-4xl">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">AI Center</div>
             <h1 className="text-6xl font-display font-bold leading-[1.05] tracking-tighter text-white">
                See what the platform intelligence is noticing.
             </h1>
             <p className="text-white/60 text-lg font-medium max-w-2xl leading-relaxed">
                AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.
             </p>
          </div>
       </section>

       {/* Metrics Pulse Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            eyebrow="Trend Pulse" 
            title={pulse?.risingCategory || 'General'} 
            desc="Most common support area based on active community requests."
          />
          <StatCard 
            eyebrow="Urgency Watch" 
            title={pulse?.urgencyStats?.find(u => u._id === 'High')?.count || 0} 
            desc="Requests currently flagged high priority by the urgency detector."
          />
          <StatCard 
            eyebrow="Mentor Pool" 
            title={pulse?.totalRequests > 0 ? Math.ceil(pulse.totalRequests / 3) : 2} 
            desc="Trusted helpers with strong response history and contribution signals."
          />
       </div>

       {/* Requests Needing Attention Section */}
       <div className="bg-white p-10 rounded-[40px] shadow-sm border border-charcoal/5 space-y-10">
          <div className="space-y-2">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">AI Recommendations</div>
             <h2 className="text-5xl font-display font-bold tracking-tighter text-charcoal leading-none">Requests needing attention</h2>
          </div>

          <div className="space-y-4">
             {highUrgencyRequests.length > 0 ? highUrgencyRequests.map(req => (
               <div key={req._id} className="p-10 rounded-[40px] bg-[#fbf9f5] space-y-8 border border-charcoal/5 group hover:border-[#0D9488]/20 transition-all relative overflow-hidden">
                  <div className="space-y-4">
                     <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight group-hover:text-[#0D9488] transition-colors">{req.title}</h4>
                     
                     <div className="bg-white/50 p-6 rounded-[24px] border border-charcoal/5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                           <Zap size={14} className="text-[#0D9488]" /> AI Intelligence Insight
                        </div>
                        <p className="text-charcoal/60 text-sm font-medium leading-relaxed max-w-3xl italic">
                           "{req.aiSummary || `Urgent request in ${req.category}. Best suited for members with expertise in community support.`}"
                        </p>
                     </div>

                     <div className="flex items-start gap-4 p-4 bg-[#0D9488]/5 rounded-[24px]">
                        <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                           <Sparkles size={16} />
                        </div>
                        <p className="text-[13px] font-bold text-charcoal/70 leading-relaxed italic">
                           Hey {user?.name?.split(' ')[0] || 'Helper'}, based on your trust score of {user?.trustScore || 0}%, you have the precision this requester needs. A few minutes of your time could resolve this blocker!
                        </p>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                     <div className="flex items-center gap-3">
                        <span className="px-5 py-2 bg-white border border-charcoal/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0D9488] shadow-sm">{req.category}</span>
                        <span className="px-5 py-2 bg-red-50 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest text-red-400 shadow-sm">{req.urgency}</span>
                     </div>
                     
                     <Link to={`/request/${req._id}`} className="text-[#0D9488] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                        Support this member <ChevronRight size={14} strokeWidth={3} />
                     </Link>
                  </div>
               </div>
             )) : (
               <div className="py-20 text-center space-y-4 border-2 border-dashed border-charcoal/5 rounded-[40px]">
                  <div className="text-3xl font-display font-bold text-charcoal/20">All calm on the horizon.</div>
                  <p className="text-muted font-medium italic">High-priority requests will appear here as they are detected.</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const StatCard = ({ eyebrow, title, desc }) => (
  <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-6 flex flex-col justify-between hover:shadow-lg transition-all">
     <div className="space-y-6">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">{eyebrow}</div>
        <h3 className="text-5xl font-display font-bold tracking-tighter text-charcoal">{title}</h3>
     </div>
     <p className="text-charcoal/40 text-[14px] leading-relaxed font-medium">{desc}</p>
  </div>
);

export default AiCenterPage;
