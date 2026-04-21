import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  HeartHandshake, 
  Zap, 
  ChevronLeft, 
  Award, 
  Loader2, 
  Tag, 
  CheckCircle,
  HelpCircle,
  Users
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [solveLoading, setSolveLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSolvePanel, setShowSolvePanel] = useState(false);
  const [selectedHelperId, setSelectedHelperId] = useState(null);
  const [showOfferErrorModal, setShowOfferErrorModal] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(`/help/${id}`);
        if (data.success) {
          setRequest(data.request);
        }
      } catch (error) {
        console.error('Failed to fetch request', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleOfferHelp = async () => {
    if (hasOfferedHelp) {
      setShowOfferErrorModal(true);
      return;
    }
    setOfferLoading(true);
    try {
      const { data } = await api.post(`/help/offer/${id}`);
      if (!data.success && data.message.toLowerCase().includes('already')) {
        setShowOfferErrorModal(true);
      } else {
        setMessage({ type: data.success ? 'success' : 'error', text: data.message });
        if (data.success) {
          const { data: refreshed } = await api.get(`/help/${id}`);
          if (refreshed.success) setRequest(refreshed.request);
        }
      }
    } catch (error) {
       if (error.response?.data?.message?.toLowerCase().includes('already')) {
          setShowOfferErrorModal(true);
       } else {
          setMessage({ type: 'error', text: 'Failed to offer help. Are you logged in?' });
       }
    } finally {
      setOfferLoading(false);
    }
  };

  const handleSolve = async () => {
    setSolveLoading(true);
    try {
      const { data } = await api.post(`/help/solve/${id}`, {
        rewardedHelperId: selectedHelperId
      });
      setMessage({ type: data.success ? 'success' : 'error', text: data.message });
      if (data.success) {
        setRequest(prev => ({ ...prev, status: 'Solved' }));
        setShowSolvePanel(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark as solved.' });
    } finally {
      setSolveLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#0D9488]" size={40} />
        <p className="text-charcoal/40 font-bold text-xs uppercase tracking-widest">Parsing signal...</p>
      </div>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F8F7F0]">
      <HelpCircle size={64} className="text-charcoal/10" />
      <p className="text-2xl font-display font-bold text-charcoal/40 tracking-tight">Request Signal Lost.</p>
      <Link to="/explore" className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">Return to Explore</Link>
    </div>
  );

  const isRequester = user?._id && request.requester?._id && String(user._id) === String(request.requester._id);
  const hasOfferedHelp = user && request.helpers?.some(h => String(h._id) === String(user._id));

  return (
    <div className="space-y-8 pb-16">
       {/* Top Navigation */}
       <div className="max-w-5xl mx-auto px-8 pt-4 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors font-extrabold text-[11px] uppercase tracking-[0.2em]">
             <ChevronLeft size={16} /> Dashboard
          </button>
       </div>

       <div className="max-w-5xl mx-auto px-8 space-y-10">
          {/* Header Banner - Mockup Match */}
          <section className="bg-charcoal text-white p-12 rounded-[32px] relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="space-y-8 relative z-10 max-w-4xl">
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">Request Detail</div>
                   <div className="flex items-center gap-3">
                      <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#0D9488]">{request.category}</span>
                      <span className={cn(
                        "px-5 py-2 border rounded-full text-[10px] font-extrabold uppercase tracking-widest",
                        request.urgency === 'High' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/10 text-white/40"
                      )}>{request.urgency}</span>
                      <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white/40">{request.status}</span>
                   </div>
                </div>

                <h1 className="text-4xl font-display font-bold leading-[1.1] tracking-tighter text-white">
                   {request.title}
                </h1>
                
                <p className="text-white/60 text-lg font-medium max-w-2xl leading-relaxed">
                   {request.description}
                </p>
             </div>
          </section>

          <div className="grid grid-cols-12 gap-8">
             {/* Left Column: AI Summary & Actions */}
             <div className="col-span-12 lg:col-span-7 space-y-8">
                {/* AI Summary Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-6">
                   <div className="space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">AI Summary</div>
                      <h3 className="text-3xl font-display font-bold tracking-tight text-charcoal">What this request needs</h3>
                      <p className="text-charcoal/60 leading-relaxed font-medium">
                         {request.aiSummary || "The AI Context Engine is currently refining the technical requirements for this request."}
                      </p>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                      {request.tags?.length > 0 ? request.tags.map(tag => (
                        <span key={tag} className="px-6 py-2.5 bg-[#fbf9f5] border border-charcoal/5 rounded-full text-[11px] font-bold text-charcoal/60 uppercase tracking-widest">
                           {tag}
                        </span>
                      )) : (
                        <span className="text-xs text-charcoal/20 font-medium italic">Tag indexing in progress...</span>
                      )}
                   </div>
                </div>

                {/* Actions Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-6">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Actions</div>
                   <div className="flex flex-wrap gap-4">
                      {!isRequester && request.status !== 'Solved' && (
                         <button 
                           onClick={handleOfferHelp}
                           disabled={offerLoading || hasOfferedHelp}
                           className="px-10 py-5 bg-[#0D9488] text-white rounded-[24px] font-display font-bold text-lg hover:bg-[#0b7a6f] transition-all flex items-center gap-3 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50"
                         >
                            {offerLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            {hasOfferedHelp ? 'Application Sent' : 'I can help'}
                         </button>
                      )}
                      
                      {isRequester && request.status !== 'Solved' && (
                         <button 
                           onClick={() => setShowSolvePanel(true)}
                           disabled={solveLoading}
                           className="px-10 py-5 bg-white border-2 border-charcoal/5 text-charcoal rounded-[24px] font-display font-bold text-lg hover:border-charcoal/20 transition-all flex items-center gap-3"
                         >
                            {solveLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            Mark as solved
                         </button>
                      )}

                      {request.status === 'Solved' && (
                        <div className="px-10 py-5 bg-green-50 text-green-600 rounded-[24px] font-display font-bold text-lg flex items-center gap-3">
                           <ShieldCheck size={20} /> Mission Accomplished
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Right Column: Requester & Helpers */}
             <div className="col-span-12 lg:col-span-5 space-y-8">
                {/* Requester Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-6">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Requester</div>
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#0D9488] rounded-[24px] flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-[#0D9488]/10 group-hover:scale-105 transition-transform">
                         {request.requester?.name?.[0] || '?'}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">{request.requester?.name || 'Anonymous User'}</h4>
                         <p className="text-charcoal/40 text-sm font-medium">
                            {request.requester?.location || 'Community'} • Trust {request.requester?.trustScore ?? 0}%
                         </p>
                      </div>
                   </div>
                </div>

                {/* Helpers Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Helpers</div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                         <Users size={12} className="text-primary" />
                         <span className="text-[10px] font-black">{request.helpers?.length || 0}</span>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold tracking-tight">People ready to support</h3>
                   </div>

                   <div className="space-y-4">
                      {request.helpers?.length > 0 ? request.helpers.map(helper => (
                         <div key={helper._id} className="p-6 rounded-[32px] bg-[#fbf9f5] border border-charcoal/5 hover:border-charcoal/10 transition-all group">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-charcoal/10 flex items-center justify-center text-charcoal font-bold group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                                     {helper.name[0]}
                                  </div>
                                  <div>
                                     <div className="font-bold text-charcoal">{helper.name}</div>
                                     <div className="text-[11px] text-charcoal/40 font-medium">Mentor • {helper.trustScore}% Global Trust</div>
                                  </div>
                               </div>
                               <div className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#0D9488] shadow-sm border border-charcoal/5">
                                  Trust {helper.trustScore}%
                               </div>
                            </div>
                         </div>
                      )) : (
                         <div className="py-12 text-center border-2 border-dashed border-charcoal/5 rounded-[32px] space-y-3">
                            <Users size={32} className="mx-auto text-charcoal/10" />
                            <p className="text-charcoal/30 font-medium text-sm">No active mentors yet.</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Modals from previous turn */}
       {showOfferErrorModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-10 space-y-8 shadow-2xl text-center">
               <div className="w-20 h-20 bg-[#0D9488]/10 rounded-full flex items-center justify-center text-[#0D9488] mx-auto">
                  <ShieldCheck size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold">Already Applied</h3>
                  <p className="text-muted text-sm font-medium leading-relaxed">
                     You have already offered your support for this request. The requester will reach out to you if they need your assistance.
                  </p>
               </div>
               <button 
                 onClick={() => setShowOfferErrorModal(false)}
                 className="w-full bg-charcoal text-white py-4 rounded-full font-bold text-[14px] hover:bg-charcoal/90 transition-all"
               >
                  Got it
               </button>
            </div>
         </div>
       )}

       {showSolvePanel && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[40px] p-10 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/5 rounded-full blur-[60px]"></div>
               
               <div className="space-y-2 relative z-10">
                  <h3 className="text-3xl font-display font-bold tracking-tight">Resolve Request</h3>
                  <p className="text-muted text-[14px] font-medium">Select the helper who assisted you to award them <span className="text-[#0D9488] font-bold">+10 Trust Points</span>.</p>
               </div>

               <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {request.helpers?.length > 0 ? request.helpers.map(helper => (
                     <button 
                       key={helper._id}
                       onClick={() => setSelectedHelperId(helper._id)}
                       className={cn(
                         "w-full p-6 rounded-3xl border transition-all flex items-center justify-between text-left group",
                         selectedHelperId === helper._id 
                           ? "bg-[#0D9488]/5 border-[#0D9488] shadow-sm" 
                           : "bg-[#fbf9f5] border-charcoal/5 hover:border-charcoal/10"
                       )}
                     >
                        <div className="flex items-center gap-4">
                           <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors",
                             selectedHelperId === helper._id ? "bg-[#0D9488] text-white" : "bg-charcoal text-white"
                           )}>
                              {helper.name[0]}
                           </div>
                           <div>
                              <div className="font-bold text-charcoal">{helper.name}</div>
                              <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted">{helper.trustScore} Trust Score</div>
                           </div>
                        </div>
                        {selectedHelperId === helper._id && (
                           <div className="w-6 h-6 rounded-full bg-[#0D9488] flex items-center justify-center text-white">
                              <CheckCircle size={14} />
                           </div>
                        )}
                     </button>
                  )) : (
                     <p className="text-center text-muted font-medium py-8 italic">No helpers found for this request.</p>
                  )}
               </div>

               <div className="flex gap-4 relative z-10">
                  <button 
                    onClick={() => setShowSolvePanel(false)}
                    className="flex-1 bg-charcoal/5 text-charcoal py-4 rounded-full font-bold text-[14px] hover:bg-charcoal/10 transition-all"
                  >
                     Cancel
                  </button>
                  <button 
                    onClick={handleSolve}
                    disabled={solveLoading || (request.helpers?.length > 0 && !selectedHelperId)}
                    className="flex-[2] bg-[#0D9488] text-white py-4 rounded-full font-bold text-[14px] hover:bg-[#0b7a6f] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                     {solveLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                     Confirm & Solve
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default RequestDetailPage;
