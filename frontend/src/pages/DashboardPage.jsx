import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { StatCard } from '../components/UIPrimitives';
import { 
  Target, 
  Zap, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Bell, 
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const DashboardPage = () => {
   const { user } = useAuth();
   const [stats, setStats] = useState(null);
   const [requests, setRequests] = useState([]);
   const [pulse, setPulse] = useState(null);
   const [notifications, setNotifications] = useState([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            // Parallel fetching for performance
            const [statsRes, pulseRes, noticeRes] = await Promise.all([
               api.get('/user/stats'),
               api.get('/analytics/pulse'),
               api.get('/notifications')
            ]);

            if (statsRes.data.success) {
               setStats(statsRes.data.stats);
               setRequests(statsRes.data.activeRequests || []);
            }

            if (pulseRes.data.success) {
               setPulse(pulseRes.data.data);
            }

            if (noticeRes.data.success) {
               setNotifications(noticeRes.data.notifications.slice(0, 3));
            }
         } catch (error) {
            console.error("Failed to load dashboard data", error);
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
        <div className="text-center space-y-4">
           <Loader2 className="animate-spin text-secondary mx-auto" size={40} />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20">Initializing Command Center...</p>
        </div>
     </div>
   );

   const firstName = user?.name?.split(' ')[0] || 'Helper';
   const trustDriver = user?.trustScore > 80 ? 'Reliability King' : user?.trustScore > 60 ? 'Rising Star' : 'Community Resident';

   return (
      <div className="space-y-10 pb-20 animate-in fade-in duration-700">
         {/* Hero Banner Section - Matches Mockup */}
         <section className="bg-charcoal text-white p-14 rounded-[40px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="space-y-4 relative z-10">
               <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Dashboard</div>
               <h1 className="text-6xl font-display font-bold tracking-[-0.03em] leading-tight text-white mb-2">
                  Welcome back, {firstName}.
               </h1>
               <p className="text-white/40 font-medium text-lg max-w-2xl leading-relaxed">
                  Your command center for requests, AI insights, helper momentum, and live community activity.
               </p>
            </div>
         </section>

         {/* Metric Pulse Grid - Mockup 4 Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
               label="Trust Score" 
               value={`${user?.trustScore || 50}%`} 
               description="Driven by solved requests and consistent support." 
            />
            <StatCard 
               label="Helping" 
               value={stats?.helpProvidedCount || 0} 
               description="Requests where you are currently listed as a helper." 
            />
            <StatCard 
               label="Open Requests" 
               value={pulse?.totalRequests || 0} 
               description="Community requests currently active across the feed." 
            />
            <div className="bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm space-y-3">
               <div className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">AI Pulse</div>
               <div className="text-5xl font-display font-bold text-charcoal tracking-tighter">
                  {pulse?.categoryStats?.length || 0} <span className="text-xl">trends</span>
               </div>
               <p className="text-charcoal/40 text-[13px] font-medium leading-relaxed">
                  Trend count detected in the latest request activity. 
               </p>
            </div>
         </div>

         {/* Split Layout Feed + Insights */}
         <div className="grid lg:grid-cols-12 gap-10">
            
            {/* Left Column: Community Needs (7/12) */}
            <div className="lg:col-span-7 space-y-10">
               <div className="flex items-center justify-between">
                  <div className="space-y-2">
                     <div className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Recent Requests</div>
                     <h2 className="text-5xl font-display font-bold tracking-tight text-charcoal">
                        What the community<br />needs right now
                     </h2>
                  </div>
                  <Link to="/explore" className="group flex items-center gap-3 bg-white p-2 pr-6 rounded-full border border-charcoal/5 shadow-sm hover:shadow-md transition-all">
                     <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal group-hover:bg-secondary group-hover:text-white transition-colors">
                        <ArrowRight size={18} />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-charcoal/40 group-hover:text-charcoal">Go to feed</span>
                  </Link>
               </div>

               <div className="space-y-6">
                  {requests.length === 0 ? (
                     <div className="bg-white p-20 rounded-[40px] text-center space-y-4 border border-charcoal/5">
                        <Zap size={48} className="text-charcoal/10 mx-auto" />
                        <p className="text-charcoal/40 font-bold uppercase tracking-widest text-xs">Waiting for community signals...</p>
                     </div>
                  ) : (
                     requests.map(req => (
                        <div key={req._id} className="bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm hover:border-secondary/20 transition-all space-y-8 group">
                           <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                 <span className="px-5 py-2 bg-secondary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary">{req.category}</span>
                                 <span className={cn(
                                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    req.urgency === 'High' ? "bg-red-50 text-red-500" : "bg-charcoal/5 text-charcoal/40"
                                 )}>{req.urgency}</span>
                                 <span className="px-5 py-2 border border-charcoal/5 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/20">Open</span>
                              </div>
                              <h3 className="text-2xl font-display font-bold text-charcoal tracking-tight leading-tight group-hover:text-secondary transition-colors">
                                 {req.title}
                              </h3>
                              <p className="text-charcoal/40 text-sm font-medium leading-relaxed line-clamp-2">
                                 {req.description}
                              </p>
                           </div>

                           <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-2xl bg-charcoal/5 flex items-center justify-center text-charcoal font-black">
                                    {req.requester?.name?.[0] || 'U'}
                                 </div>
                                 <div className="space-y-0.5">
                                    <div className="text-sm font-black text-charcoal">{req.requester?.name || 'Community Member'}</div>
                                    <div className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">
                                       {req.requester?.location || 'Lahore'} • 0 helpers interested
                                    </div>
                                 </div>
                              </div>
                              <Link to={`/request/${req._id}`} className="px-8 py-3 bg-white border border-charcoal/10 rounded-full text-[12px] font-black text-charcoal hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm">
                                 Open details
                              </Link>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Right Column: AI Insights & Notifications (5/12) */}
            <div className="lg:col-span-5 space-y-10">
               
               {/* AI Insights Panel */}
               <div className="bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm space-y-8">
                  <div className="space-y-2">
                     <div className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">AI Insights</div>
                     <h3 className="text-3xl font-display font-bold tracking-tight text-charcoal leading-none">
                        Suggested actions for you
                     </h3>
                  </div>

                  <div className="space-y-6">
                     <InsightRow label="Most requested category" value={pulse?.risingCategory || 'Design'} />
                     <InsightRow label="Your strongest trust driver" value={trustDriver} />
                     <InsightRow 
                       label="AI says you can mentor in" 
                       value={user?.skills?.length > 0 ? user.skills.slice(0, 3).join(', ') : 'Add skills in profile'} 
                     />
                     <InsightRow label="Your active requests" value={stats?.myRequestsCount || 0} />
                  </div>
               </div>

               {/* Notifications Panel */}
               <div className="bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm space-y-8">
                  <div className="space-y-2">
                     <div className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Notifications</div>
                     <h3 className="text-3xl font-display font-bold tracking-tight text-charcoal leading-none">
                        Latest updates
                     </h3>
                  </div>

                  <div className="space-y-4">
                     {notifications.length === 0 ? (
                        <div className="py-12 border-2 border-dashed border-charcoal/5 rounded-[32px] text-center space-y-2">
                           <Bell size={24} className="text-charcoal/10 mx-auto" />
                           <p className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest">No recent signals</p>
                        </div>
                     ) : (
                        notifications.map(n => (
                           <div key={n._id} className="p-6 bg-[#fbf9f5] rounded-[32px] border border-charcoal/5 flex items-start justify-between gap-4 group hover:border-secondary/20 transition-all">
                              <div className="space-y-2">
                                 <p className="text-[14px] font-bold text-charcoal leading-[1.4]">
                                    {n.message}
                                 </p>
                                 <p className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest">
                                    {n.type === 'HelpOffered' ? 'Match' : 'Reputation'} • {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                 </p>
                              </div>
                              {!n.read && (
                                 <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest mt-1">
                                    Unread
                                 </span>
                              )}
                           </div>
                        ))
                     )}
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

const InsightRow = ({ label, value }) => (
   <div className="flex items-start justify-between py-4 border-b border-charcoal/5 last:border-0 group">
      <div className="text-[13px] font-medium text-charcoal/40">{label}</div>
      <div className="text-[13px] font-bold text-charcoal text-right leading-relaxed max-w-[180px]">
         {value}
      </div>
   </div>
);

export default DashboardPage;
