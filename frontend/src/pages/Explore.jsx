import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Clock, MapPin, Tag, ChevronRight, ChevronDown, CheckCircle, HeartHandshake, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { cn } from '../utils/cn';

const Explore = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filters, setFilters] = useState({
     category: 'All categories',
     urgency: 'All urgency levels',
     skills: '',
     location: ''
  });

  const categories = ['All categories', 'Web Development', 'Design', 'Career', 'Data Science', 'Marketing', 'Community', 'Other'];
  const urgencies = ['All urgency levels', 'Low', 'Medium', 'High'];
  
  useEffect(() => {
     const fetchRequests = async () => {
        try {
           const { data } = await api.get('/help/all');
           if (data.success) {
              setRequests(data.requests);
           }
        } catch (error) {
           console.error("Failed to fetch requests", error);
        } finally {
           setLoading(false);
        }
     };
     fetchRequests();
  }, []);

  const filteredRequests = requests.filter(req => {
     const matchCategory = filters.category === 'All categories' || req.category === filters.category;
     const matchUrgency = filters.urgency === 'All urgency levels' || req.urgency === filters.urgency;
     const matchSkills = !filters.skills || req.tags?.some(tag => tag.toLowerCase().includes(filters.skills.toLowerCase()));
     const matchLocation = !filters.location || req.requester?.location?.toLowerCase().includes(filters.location.toLowerCase());
     
     return matchCategory && matchUrgency && matchSkills && matchLocation;
  });

  return (
    <div className="min-h-screen pb-16 space-y-10">
       {/* Hero Banner Area */}
       <div className="max-w-6xl mx-auto px-8 pt-8">
          <section className="bg-charcoal text-white p-14 rounded-[32px] relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="space-y-4 relative z-10 max-w-3xl">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Explore / Feed</div>
                <h1 className="text-5xl font-display font-bold leading-[1.1] tracking-tighter text-white">
                   Browse help requests with filterable community context.
                </h1>
                <p className="text-white/60 text-lg font-medium max-w-2xl leading-relaxed">
                   Filter by category, urgency, skills, and location to surface the best matches.
                </p>
             </div>
          </section>
       </div>

       {/* Main Content Grid */}
       <div className="max-w-6xl mx-auto px-8 grid grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="col-span-12 lg:col-span-4 space-y-6 sticky top-32">
             <div className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 space-y-8">
                <div className="space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Filters</div>
                   <h2 className="text-3xl font-display font-bold tracking-tighter text-charcoal leading-none">Refine the feed</h2>
                </div>

                <div className="space-y-8">
                   {/* Category Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-charcoal/60">Category</label>
                      <div className="relative group">
                         <select 
                           value={filters.category}
                           onChange={(e) => setFilters({...filters, category: e.target.value})}
                           className="w-full appearance-none bg-[#fbf9f5] border-2 border-charcoal/5 group-hover:border-charcoal/10 px-6 py-5 rounded-[24px] font-bold text-sm outline-none transition-all cursor-pointer pr-12"
                         >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                         <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" size={18} />
                      </div>
                   </div>

                   {/* Urgency Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-charcoal/60">Urgency</label>
                      <div className="relative group">
                         <select 
                           value={filters.urgency}
                           onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                           className="w-full appearance-none bg-[#fbf9f5] border-2 border-charcoal/5 group-hover:border-charcoal/10 px-6 py-5 rounded-[24px] font-bold text-sm outline-none transition-all cursor-pointer pr-12"
                         >
                            {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                         </select>
                         <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" size={18} />
                      </div>
                   </div>

                   {/* Skills Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-charcoal/60">Skills</label>
                      <input 
                         type="text"
                         placeholder="React, Figma, Git/GitHub"
                         value={filters.skills}
                         onChange={(e) => setFilters({...filters, skills: e.target.value})}
                         className="w-full bg-[#fbf9f5] border-2 border-charcoal/5 hover:border-charcoal/10 px-6 py-5 rounded-[24px] font-bold text-sm outline-none transition-all placeholder:text-charcoal/20"
                      />
                   </div>

                   {/* Location Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-charcoal/60">Location</label>
                      <input 
                         type="text"
                         placeholder="Karachi, Lahore, Remote"
                         value={filters.location}
                         onChange={(e) => setFilters({...filters, location: e.target.value})}
                         className="w-full bg-[#fbf9f5] border-2 border-charcoal/5 hover:border-charcoal/10 px-6 py-5 rounded-[24px] font-bold text-sm outline-none transition-all placeholder:text-charcoal/20"
                      />
                   </div>
                </div>
             </div>
          </aside>

          {/* Right Column: Request Feed */}
          <main className="col-span-12 lg:col-span-8 space-y-4">
             {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                   <Loader2 className="animate-spin text-[#0D9488]" size={40} />
                   <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/20">Refining technical feed...</div>
                </div>
             ) : filteredRequests.length === 0 ? (
                <div className="bg-white p-20 rounded-[48px] text-center space-y-4 border-2 border-dashed border-charcoal/5">
                   <div className="text-4xl font-display font-bold text-charcoal/20">No matching signals.</div>
                   <p className="text-muted font-medium italic">Adjust your filters to find community members in need.</p>
                </div>
             ) : (
                filteredRequests.map(req => (
                   <div key={req._id} className="bg-white p-10 rounded-[32px] shadow-sm border border-charcoal/5 flex flex-col group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                      {/* Card Content Stack */}
                      <div className="space-y-5 relative z-10">
                         {/* Badges */}
                         <div className="flex items-center gap-3">
                            <span className="px-5 py-2 bg-[#fbf9f5] border border-charcoal/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0D9488]">{req.category}</span>
                            <span className={cn(
                               "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                               req.urgency === 'High' ? "bg-red-50 text-red-400 border-red-100" : "bg-[#fbf9f5] border-charcoal/5 text-charcoal/40"
                            )}>
                               {req.urgency}
                            </span>
                            <span className="px-5 py-2 bg-[#fbf9f5] border border-charcoal/5 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/20">{req.status}</span>
                         </div>

                         {/* Info */}
                         <div className="space-y-1 max-w-2xl">
                            <h3 className="text-3xl font-display font-bold tracking-tight text-charcoal leading-none">{req.title}</h3>
                            <p className="text-charcoal/60 leading-relaxed font-medium line-clamp-2 pt-2">{req.description}</p>
                         </div>

                         {/* Tags */}
                         <div className="flex flex-wrap gap-2 pt-2">
                            {req.tags?.map(tag => (
                               <span key={tag} className="px-5 py-1.5 bg-[#fbf9f5] rounded-xl text-[10px] font-black text-[#0D9488] uppercase tracking-widest border border-charcoal/5">
                                  {tag}
                               </span>
                            ))}
                         </div>
                      </div>

                      {/* Footer: Requester & Button */}
                      <div className="pt-10 mt-10 border-t border-charcoal/5 flex items-end justify-between relative z-10">
                         <div className="space-y-2">
                            <div className="font-display font-bold text-xl text-charcoal">{req.requester?.name || 'Community Member'}</div>
                            <div className="text-[11px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-3">
                               <span>{req.requester?.location || 'Remote'}</span>
                               <span className="opacity-20">•</span>
                               <span>{req.helpers?.length || 0} helpers interested</span>
                            </div>
                         </div>
                         
                         <Link 
                            to={`/request/${req._id}`} 
                            className="bg-white px-8 py-4 rounded-full border-2 border-charcoal/5 text-charcoal font-black text-xs uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-sm"
                         >
                            Open details
                         </Link>
                      </div>
                      
                      {/* Hover Accent */}
                      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#0D9488]/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                ))
             )}
          </main>
       </div>
    </div>
  );
};

export default Explore;
