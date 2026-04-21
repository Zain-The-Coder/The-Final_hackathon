import React, { useState, useEffect } from 'react';
import { Bell, Info, CheckCircle, Zap, ShieldCheck, Loader2, Clock, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { cn } from '../utils/cn';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
     try {
        const { data } = await api.get('/notifications');
        if (data.success) {
           setNotifications(data.notifications);
        }
     } catch (error) {
        console.error("Failed to fetch notifications", error);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
     try {
        const { data } = await api.put(`/notifications/${id}/read`);
        if (data.success) {
           setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        }
     } catch (error) {
        console.error("Failed to mark notification as read", error);
     }
  };

  const getIcon = (type) => {
     switch (type) {
        case 'HelpOffered': return <Zap size={20} className="text-[#0D9488]" />;
        case 'RequestSolved': return <ShieldCheck size={20} className="text-[#0D9488]" />;
        case 'SystemAlert': return <Info size={20} className="text-orange-400" />;
        default: return <Bell size={20} className="text-charcoal/40" />;
     }
  };

  const getLabel = (type) => {
     switch (type) {
        case 'HelpOffered': return 'Match';
        case 'RequestSolved': return 'Reputation';
        case 'SystemAlert': return 'Insight';
        default: return 'Notification';
     }
  };

  return (
    <div className="space-y-8 pb-16">
       {/* Hero Banner Area */}
       <div className="max-w-5xl mx-auto px-8 pt-6">
          <section className="bg-charcoal text-white p-12 rounded-[32px] relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="space-y-4 relative z-10 max-w-3xl">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Notifications</div>
                <h1 className="text-4xl font-display font-bold leading-[1.1] tracking-tighter text-white">
                   Stay updated on requests, helpers, and trust signals.
                </h1>
                <p className="text-white/60 text-lg font-medium max-w-xl leading-relaxed">
                   Track new matches, solved items, AI insights, and reputation changes in one place.
                </p>
             </div>
          </section>
       </div>

       {/* Notifications Feed Area */}
       <div className="max-w-5xl mx-auto px-8">
          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-8">
             <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Live Updates</div>
                <h2 className="text-3xl font-display font-bold tracking-tighter text-charcoal leading-none">Notification feed</h2>
             </div>

             <div className="space-y-4">
                {loading ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-[#0D9488]" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/20">Syncing updates...</p>
                   </div>
                ) : notifications.length === 0 ? (
                   <div className="py-20 text-center space-y-4 border-2 border-dashed border-charcoal/5 rounded-[32px]">
                      <div className="text-3xl font-display font-bold text-charcoal/20">All quiet for now.</div>
                      <p className="text-muted font-medium italic">We'll alert you here as community signals arrive.</p>
                   </div>
                ) : (
                   notifications.map(n => (
                      <div key={n._id} className={cn(
                        "p-6 rounded-[24px] border transition-all flex items-center justify-between group",
                        n.read ? "bg-[#fbf9f5] border-charcoal/5" : "bg-white border-[#0D9488]/20 shadow-md"
                      )}>
                         <div className="flex items-center gap-5">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0",
                              n.read ? "bg-charcoal/5" : "bg-[#0D9488]/10"
                            )}>
                               {getIcon(n.type)}
                            </div>
                            <div className="space-y-1">
                               <div className={cn(
                                 "font-display font-bold text-base tracking-tight leading-tight",
                                 n.read ? "text-charcoal/60" : "text-charcoal"
                               )}>
                                 {n.message}
                               </div>
                               <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-charcoal/30">
                                  <span className="text-[#0D9488]">{getLabel(n.type)}</span>
                                  <span className="opacity-20">•</span>
                                  <span>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                               </div>
                            </div>
                         </div>
                         
                         <button 
                            onClick={() => !n.read && handleMarkAsRead(n._id)}
                            className={cn(
                               "px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all",
                               n.read 
                                ? "bg-charcoal/5 text-charcoal/20 cursor-default" 
                                : "bg-white border-2 border-charcoal/5 text-charcoal hover:bg-charcoal hover:text-white"
                            )}
                         >
                            {n.read ? 'Read' : 'Unread'}
                         </button>
                      </div>
                   ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Notifications;
