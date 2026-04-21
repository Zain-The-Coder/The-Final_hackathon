import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { cn } from '../utils/cn';

const Home = () => {
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/help/all');
        if (data.success) {
          setFeaturedRequests(data.requests.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  return (
    <div className="font-headline text-on-surface selection:bg-secondary-container min-h-screen">
      {/* Navigation (Replicated from prompt) */}
      <nav className="absolute top-0 w-full z-50">
        <div className="flex justify-between items-center px-12 py-6 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0d3b34] rounded-xl flex items-center justify-center text-white text-lg font-bold">H</div>
              <span className="text-xl font-extrabold text-[#0d3b34] tracking-tight">HelpHub AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#0d3b34]/60">
              <Link className="text-[#22b29e] bg-[#e3efe9] px-4 py-1.5 rounded-full" to="/">Home</Link>
              <Link className="hover:text-[#0d3b34] transition-colors" to="/explore">Explore</Link>
              <Link className="hover:text-[#0d3b34] transition-colors" to="/leaderboard">Leaderboard</Link>
              <Link className="hover:text-[#0d3b34] transition-colors" to="/ai-center">AI Center</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[11px] font-bold uppercase tracking-wider text-[#22b29e] border border-[#22b29e]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22b29e]"></span>
              Live community signals
            </div>
            <Link to="/auth" className="bg-[#0d3b34] text-white px-6 py-3 rounded-full font-bold text-sm tracking-tight hover:shadow-lg transition-all">Join the platform</Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-extrabold text-[#0d3b34]/40 uppercase tracking-[0.2em] mb-6">SMIT GRAND CODING NIGHT 2026</p>
            <h1 className="text-[72px] font-extrabold text-[#0d3b34] leading-[1] tracking-[-0.03em] mb-10">
              Find help faster.<br />Become help that matters.
            </h1>
            <p className="text-[15px] text-[#0d3b34]/60 max-w-xl leading-relaxed font-medium mb-12">
              HelpHub AI is a community-powered support network designed for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
            </p>
            <div className="flex flex-wrap gap-4 mb-16">
              <button className="bg-[#22b29e] text-white px-8 py-4 rounded-full font-bold text-[15px] tracking-tight hover:shadow-xl transition-all">
                Open product demo
              </button>
              <Link to="/create-request" className="inline-block bg-white text-[#0d3b34] px-8 py-4 rounded-full font-bold text-[15px] tracking-tight border border-[#0d3b34]/5 hover:bg-surface-container-low transition-all">
                Post a request
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl">
              <div className="bg-white p-8 rounded-[2rem] border border-[#0d3b34]/5">
                <p className="text-[10px] font-bold text-[#0d3b34]/40 uppercase tracking-[0.15em] mb-3">MEMBERS</p>
                <p className="text-4xl font-extrabold text-[#0d3b34] mb-4">384+</p>
                <p className="text-[13px] text-[#0d3b34]/60 leading-relaxed">Students, mentors, and helpers in the loop.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-[#0d3b34]/5">
                <p className="text-[10px] font-bold text-[#0d3b34]/40 uppercase tracking-[0.15em] mb-3">REQUESTS</p>
                <p className="text-4xl font-extrabold text-[#0d3b34] mb-4">72+</p>
                <p className="text-[13px] text-[#0d3b34]/60 leading-relaxed">Support posts shared across learning journeys.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-[#0d3b34]/5">
                <p className="text-[10px] font-bold text-[#0d3b34]/40 uppercase tracking-[0.15em] mb-3">SOLVED</p>
                <p className="text-4xl font-extrabold text-[#0d3b34] mb-4">69+</p>
                <p className="text-[13px] text-[#0d3b34]/60 leading-relaxed">Problems resolved through fast community action.</p>
              </div>
            </div>
          </div>

          {/* Dark Right Hero Block */}
          <div className="lg:col-span-5 bg-[#0d3b34] rounded-[2.5rem] p-12 flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute top-8 right-8 w-16 h-16 bg-[#faba6b] rounded-full blur-xl opacity-30"></div>
            <div className="absolute top-10 right-10 w-12 h-12 bg-[#faba6b] rounded-full shadow-[0_0_40px_rgba(250,186,107,0.4)]"></div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">LIVE PRODUCT FEEL</p>
              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-6">More than a form.<br />More like an ecosystem.</h2>
              <p className="text-white/60 text-[14px] leading-relaxed mb-10">A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-[#fbf9f5] p-6 rounded-2xl">
                <h3 className="font-bold text-[#0d3b34] mb-1">AI request intelligence</h3>
                <p className="text-[13px] text-[#0d3b34]/60">Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
              </div>
              <div className="bg-[#fbf9f5] p-6 rounded-2xl">
                <h3 className="font-bold text-[#0d3b34] mb-1">Community trust graph</h3>
                <p className="text-[13px] text-[#0d3b34]/60">Badges, helper rankings, trust score boosts, and visible contribution history.</p>
              </div>
              <div className="bg-[#fbf9f5] p-6 rounded-2xl">
                <h3 className="font-bold text-[#0d3b34] mb-1">100%</h3>
                <p className="text-[13px] text-[#0d3b34]/60">Top trust score currently active across the sample mentor network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Flow Section */}
        <section className="py-32">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[11px] font-extrabold text-[#0d3b34]/40 uppercase tracking-[0.2em] mb-4">CORE FLOW</p>
                <h2 className="text-[44px] font-extrabold text-[#0d3b34] tracking-tight">From struggling alone to solving together</h2>
              </div>
              <button className="bg-white text-[#0d3b34] px-6 py-3 rounded-full font-bold text-sm tracking-tight shadow-sm border border-[#0d3b34]/5">Try onboarding AI</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2rem] border border-[#0d3b34]/5">
                <h3 className="text-lg font-extrabold text-[#0d3b34] mb-6">Ask for help clearly</h3>
                <p className="text-[15px] text-[#0d3b34]/60 leading-relaxed">Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.</p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] border border-[#0d3b34]/5">
                <h3 className="text-lg font-extrabold text-[#0d3b34] mb-6">Discover the right people</h3>
                <p className="text-[15px] text-[#0d3b34]/60 leading-relaxed">Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.</p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] border border-[#0d3b34]/5">
                <h3 className="text-lg font-extrabold text-[#0d3b34] mb-6">Track real contribution</h3>
                <p className="text-[15px] text-[#0d3b34]/60 leading-relaxed">Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Requests */}
        <section className="py-24">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[11px] font-extrabold text-[#0d3b34]/40 uppercase tracking-[0.2em] mb-4">FEATURED REQUESTS</p>
                <h2 className="text-[44px] font-extrabold text-[#0d3b34] tracking-tight">Community problems currently in motion</h2>
              </div>
              <Link to="/explore" className="bg-white text-[#0d3b34] px-6 py-3 rounded-full font-bold text-sm tracking-tight shadow-sm border border-[#0d3b34]/5 inline-block">View full feed</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#fbf9f5] p-10 rounded-[2rem] border border-[#0d3b34]/5 flex flex-col min-h-[440px] animate-pulse">
                    <div className="w-24 h-6 bg-charcoal/5 rounded-full mb-6"></div>
                    <div className="w-full h-12 bg-charcoal/5 rounded-xl mb-4"></div>
                    <div className="w-2/3 h-4 bg-charcoal/5 rounded-lg mb-8"></div>
                    <div className="mt-auto flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="w-20 h-4 bg-charcoal/5 rounded-lg"></div>
                        <div className="w-32 h-3 bg-charcoal/5 rounded-lg"></div>
                      </div>
                      <div className="w-24 h-10 bg-charcoal/5 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : featuredRequests.length === 0 ? (
                <div className="col-span-3 py-20 text-center space-y-4 border-2 border-dashed border-[#0d3b34]/5 rounded-[2rem]">
                  <div className="text-3xl font-display font-bold text-[#0d3b34]/20">No active signals yet.</div>
                  <p className="text-[#0d3b34]/40 font-medium italic">New help requests will appear here as they are created.</p>
                </div>
              ) : (
                featuredRequests.map(req => (
                  <div key={req._id} className="bg-[#fbf9f5] p-10 rounded-[2rem] border border-[#0d3b34]/5 flex flex-col min-h-[440px] group hover:border-[#22b29e]/20 transition-all">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-4 py-1.5 bg-[#dbeae5] text-[#22b29e] text-[11px] font-bold rounded-full">{req.category}</span>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold",
                        req.urgency === 'High' ? "bg-red-50 text-red-400" : "bg-[#f3f0ea] text-charcoal/40"
                      )}>{req.urgency}</span>
                      <span className="px-4 py-1.5 bg-[#e3efe9] text-[#22b29e] text-[11px] font-bold rounded-full">{req.status}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0d3b34] mb-4 leading-tight group-hover:text-[#22b29e] transition-colors line-clamp-2">{req.title}</h3>
                    <p className="text-[14px] text-[#0d3b34]/60 leading-relaxed mb-8 line-clamp-3">{req.description}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {req.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white border border-[#0d3b34]/5 text-[#22b29e] text-[10px] font-bold rounded-full uppercase tracking-tighter shrink-0">{tag}</span>
                      ))}
                    </div>

                    <div className="mt-auto flex justify-between items-end pt-6 border-t border-[#0d3b34]/5">
                      <div>
                        <p className="font-extrabold text-[#0d3b34] text-[15px] mb-1">{req.requester?.name || 'Community Member'}</p>
                        <p className="text-[13px] text-[#0d3b34]/40 font-bold">
                          {req.requester?.location || 'Remote'} • {req.helpers?.length || 0} interested
                        </p>
                      </div>
                      <Link to={`/request/${req._id}`} className="bg-white text-[#0d3b34] px-6 py-3 rounded-full font-bold text-sm border border-[#0d3b34]/5 shadow-sm hover:bg-charcoal hover:text-white transition-all">Open details</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-12 max-w-[1440px] mx-auto bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#0d3b34]/10">
          <p className="text-[#0d3b34]/40 text-[14px] font-medium mb-6 md:mb-0">HelpHub AI is built as a premium-feel, multi-page community support product.</p>
          <div className="flex gap-8 text-[11px] font-extrabold text-[#0d3b34]/40 uppercase tracking-widest">
            <a className="hover:text-[#0d3b34] transition-colors" href="/#">Privacy Policy</a>
            <a className="hover:text-[#0d3b34] transition-colors" href="/#">Terms of Service</a>
            <a className="hover:text-[#0d3b34] transition-colors" href="/#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
