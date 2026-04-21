import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { cn } from '../utils/cn';
import { Award, Zap, ShieldCheck, MapPin, Loader2, Save, Sparkles, User as UserIcon, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
    const { user, setUserData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [stats, setStats] = useState({ contributions: 0 });
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        skills: '',
        interests: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                location: user.location || '',
                skills: user.skills?.join(', ') || '',
                interests: user.interests?.join(', ') || ''
            });
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/user/stats');
            if (data.success) {
                setStats({
                    contributions: data.stats.helpProvidedCount
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setShowSuccess(false);
        try {
            const formattedData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                interests: formData.interests.split(',').map(s => s.trim()).filter(s => s !== '')
            };
            
            const { data } = await api.post('/user/update-profile', formattedData);
            if (data.success) {
                setUserData(data.user);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading && !user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
            <Loader2 className="animate-spin text-[#0D9488]" size={40} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-8 pb-20">
            {/* Profile Hero */}
            <section className="bg-charcoal p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#0D9488]/10 rounded-full blur-[90px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="space-y-4 relative z-10">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Profile Overview</div>
                    <div className="space-y-1">
                        {user?.name ? (
                            <h1 className="text-5xl font-display font-bold tracking-tighter animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {user.name}
                            </h1>
                        ) : (
                            <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse"></div>
                        )}
                        <p className="text-white/50 text-base font-medium">
                            {user?.signupRole || 'Community Member'} • {user?.location || 'Global'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Public Profile & Reputation */}
                <div className="lg:col-span-5 h-full">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-charcoal/5 h-full space-y-10">
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Public Record</div>
                            <h2 className="text-4xl font-display font-bold text-charcoal tracking-tighter">Skills and reputation</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-charcoal/5 pb-5">
                                <span className="text-charcoal/50 text-sm font-medium">Trust score</span>
                                <span className="text-2xl font-display font-bold text-charcoal">{user?.trustScore || 0}%</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-charcoal/5 pb-5">
                                <span className="text-charcoal/50 text-sm font-medium">Contributions</span>
                                <span className="text-2xl font-display font-bold text-charcoal">{stats.contributions}</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Primary Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user?.skills?.length > 0 ? user.skills.map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-[#EAE8DB]/40 text-[#0D9488] text-[10px] font-black rounded-full uppercase tracking-widest border border-charcoal/5">
                                            {skill}
                                        </span>
                                    )) : <span className="text-charcoal/30 italic text-sm">Identifying skills...</span>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Unlocked Badges</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(user?.badges || []).length > 0 ? user.badges.map(badge => (
                                        <div key={badge} className="flex items-center gap-2 px-4 py-2 bg-[#0D9488]/5 text-[#0D9488] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#0D9488]/10">
                                            <ShieldCheck size={12} /> {badge}
                                        </div>
                                    )) : (
                                        <div className="px-4 py-2 bg-charcoal/5 text-charcoal/30 text-[9px] font-black rounded-full uppercase tracking-widest border border-charcoal/5 italic">
                                            New Member
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Profile */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-charcoal/5 space-y-10 relative">
                        {/* Success Message Overlay */}
                        {showSuccess && (
                            <div className="absolute top-10 right-10 flex items-center gap-2 bg-[#0D9488] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in slide-in-from-top-4 duration-300 shadow-xl shadow-[#0D9488]/20 z-20">
                                <CheckCircle2 size={14} /> Profile Saved
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0D9488]">Edit Profile</div>
                            <h2 className="text-4xl font-display font-bold text-charcoal tracking-tighter">Update your identity</h2>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-1">Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-[18px] bg-[#F8F7F0] border border-charcoal/5 focus:border-[#0D9488]/40 focus:ring-4 focus:ring-[#0D9488]/5 outline-none transition-all font-bold text-sm text-charcoal"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-1">Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-[18px] bg-[#F8F7F0] border border-charcoal/5 focus:border-[#0D9488]/40 focus:ring-4 focus:ring-[#0D9488]/5 outline-none transition-all font-bold text-sm text-charcoal"
                                        placeholder="e.g. Karachi, PK"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-1">Skills</label>
                                <textarea 
                                    value={formData.skills}
                                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-[18px] bg-[#F8F7F0] border border-charcoal/5 focus:border-[#0D9488]/40 focus:ring-4 focus:ring-[#0D9488]/5 outline-none transition-all font-bold text-sm text-charcoal min-h-[90px]"
                                    placeholder="React, Design, Figma..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-1">Interests</label>
                                <textarea 
                                    value={formData.interests}
                                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-[18px] bg-[#F8F7F0] border border-charcoal/5 focus:border-[#0D9488]/40 focus:ring-4 focus:ring-[#0D9488]/5 outline-none transition-all font-bold text-sm text-charcoal min-h-[90px]"
                                    placeholder="Hackathons, AI, Open Source..."
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white py-4.5 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#0D9488]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
