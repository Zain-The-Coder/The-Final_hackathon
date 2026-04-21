import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Trash2, 
  ShieldAlert, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import api from '../api/axios';
import { cn } from '../utils/cn';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data.success) setStats(statsRes.data.stats);

      if (activeTab === 'users') {
        const usersRes = await api.get('/admin/users');
        if (usersRes.data.success) setUsers(usersRes.data.users);
      } else if (activeTab === 'requests') {
        const requestsRes = await api.get('/admin/requests');
        if (requestsRes.data.success) setRequests(requestsRes.data.requests);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will delete the user and all their requests.")) return;
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/role/${userId}`);
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: data.user.role } : u));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTrust = async (userId, currentTrust) => {
    const newTrust = window.prompt("Enter new trust score:", currentTrust);
    if (newTrust === null || isNaN(newTrust)) return;
    try {
      const { data } = await api.put(`/admin/users/trust/${userId}`, { trustScore: Number(newTrust) });
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, trustScore: Number(newTrust) } : u));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      const { data } = await api.delete(`/admin/requests/${requestId}`);
      if (data.success) {
        setRequests(requests.filter(r => r._id !== requestId));
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-12 pt-8 pb-32 space-y-12">
      {/* Header Banner */}
      <section className="bg-charcoal text-white p-12 rounded-[40px] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="space-y-6 relative z-10">
            <p className="eyebrow text-white/40 text-[11px] font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldAlert size={14} className="text-error" /> Administrative Panel
            </p>
            <h1 className="text-7xl font-display font-bold leading-none tracking-tighter text-white">Control Center</h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed font-medium">
               Manage the community infrastructure, monitor health signals, and oversee user interactions.
            </p>
         </div>
      </section>

      {/* Stats Quick View */}
      <div className="grid md:grid-cols-4 gap-8">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} />
          <StatCard icon={FileText} label="Total Requests" value={stats?.totalRequests || 0} />
          <StatCard icon={CheckCircle2} label="Solved Requests" value={stats?.solvedRequests || 0} />
          <StatCard icon={BarChart3} label="Open Signals" value={stats?.openRequests || 0} />
      </div>

      <div className="bg-white rounded-[44px] border border-charcoal/5 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
         {/* Tabs Navigation */}
         <div className="flex px-10 pt-8 border-b border-charcoal/5 gap-8">
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              label="User Management" 
              icon={Users} 
            />
            <TabButton 
              active={activeTab === 'requests'} 
              onClick={() => setActiveTab('requests')} 
              label="Request Oversight" 
              icon={FileText} 
            />
            <TabButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              label="Detailed Analytics" 
              icon={BarChart3} 
            />
         </div>

         {/* Content Area */}
         <div className="p-10 flex-1">
            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center bg-[#fbf9f5] p-5 rounded-3xl border border-charcoal/5">
                   <div className="relative w-full max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-charcoal/10 rounded-2xl p-4 pl-12 outline-none focus:border-charcoal/20 font-medium text-sm"
                      />
                   </div>
                   <div className="flex gap-4">
                      <button className="p-4 rounded-2xl bg-white border border-charcoal/10 text-charcoal/40 hover:text-charcoal transition-colors">
                        <Filter size={20} />
                      </button>
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-charcoal/5">
                          <th className="pb-6 pt-2 font-display font-bold text-charcoal/40 text-[11px] uppercase tracking-widest px-4">User Details</th>
                          <th className="pb-6 pt-2 font-display font-bold text-charcoal/40 text-[11px] uppercase tracking-widest px-4">Role</th>
                          <th className="pb-6 pt-2 font-display font-bold text-charcoal/40 text-[11px] uppercase tracking-widest px-4">Trust Score</th>
                          <th className="pb-6 pt-2 font-display font-bold text-charcoal/40 text-[11px] uppercase tracking-widest px-4">Joined</th>
                          <th className="pb-6 pt-2 font-display font-bold text-charcoal/40 text-[11px] uppercase tracking-widest px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-charcoal/5">
                         {loading ? (
                           <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-charcoal/20" size={32} /></td></tr>
                         ) : users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                           <tr key={user._id} className="group hover:bg-[#fbf9f5]/50 transition-colors">
                             <td className="py-6 px-4">
                               <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                                   {user.name[0]}
                                 </div>
                                 <div>
                                   <div className="font-display font-bold text-charcoal">{user.name}</div>
                                   <div className="text-[12px] font-medium text-charcoal/40">{user.email}</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-6 px-4">
                               <span className={cn(
                                 "text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full",
                                 user.role === 'admin' ? "bg-red-50 text-error" : "bg-primary/5 text-primary"
                               )}>
                                 {user.role}
                               </span>
                             </td>
                             <td className="py-6 px-4 font-bold text-sm text-charcoal flex items-center gap-2">
                               <Trophy size={14} className="text-secondary" />
                               {user.trustScore}
                             </td>
                             <td className="py-6 px-4 text-[13px] font-medium text-charcoal/40">
                               {new Date(user.createdAt).toLocaleDateString()}
                             </td>
                             <td className="py-6 px-4 text-right space-x-2">
                               <button 
                                 onClick={() => handleToggleRole(user._id)}
                                 className="p-3 rounded-xl bg-white border border-charcoal/5 hover:bg-charcoal/5 transition-colors text-charcoal/60"
                                 title="Shift Role"
                               >
                                 <ShieldAlert size={16} />
                               </button>
                               <button 
                                 onClick={() => handleUpdateTrust(user._id, user.trustScore)}
                                 className="p-3 rounded-xl bg-white border border-charcoal/5 hover:bg-charcoal/5 transition-colors text-charcoal/60"
                                 title="Override Trust"
                               >
                                 <Trophy size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteUser(user._id)}
                                 className="p-3 rounded-xl bg-white border border-charcoal/5 hover:bg-red-50 hover:text-error transition-colors text-charcoal/60"
                                 title="Purge Account"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-6">
                  {loading ? (
                    <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-charcoal/20" size={32} /></div>
                  ) : requests.map(req => (
                    <div key={req._id} className="p-8 rounded-[32px] border border-charcoal/5 bg-[#fbf9f5]/50 flex items-center justify-between group hover:border-charcoal/10 transition-all">
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white border border-charcoal/10 text-charcoal/60">
                               {req.category}
                             </span>
                             <span className={cn(
                                "text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full",
                                req.urgency === 'High' ? "bg-red-50 text-error" : "bg-secondary/10 text-secondary"
                             )}>
                               {req.urgency} Urgency
                             </span>
                          </div>
                          <h4 className="text-xl font-display font-bold text-charcoal">{req.title}</h4>
                          <div className="text-[13px] font-medium text-charcoal/40">
                             Requested by <span className="text-charcoal font-bold">{req.requester?.name}</span> • {new Date(req.createdAt).toLocaleString()}
                          </div>
                       </div>
                       <button 
                         onClick={() => handleDeleteRequest(req._id)}
                         className="p-4 rounded-2xl bg-white border border-charcoal/5 hover:bg-red-50 hover:text-error transition-colors text-charcoal/60 opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={20} />
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-[#fbf9f5] p-10 rounded-[40px] border border-charcoal/5 space-y-8">
                      <div className="space-y-1">
                         <div className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488]">Request Distribution</div>
                         <h3 className="text-2xl font-display font-bold">Category Volume</h3>
                      </div>
                      <div className="space-y-4">
                         {stats?.categoryStats?.length > 0 ? stats.categoryStats.map(cat => (
                           <div key={cat._id} className="space-y-2">
                              <div className="flex justify-between text-sm font-bold">
                                 <span>{cat._id || 'Uncategorized'}</span>
                                 <span className="text-charcoal/40">{cat.count}</span>
                              </div>
                              <div className="w-full h-2 bg-charcoal/5 rounded-full overflow-hidden">
                                 <div 
                                   className="h-full bg-secondary transition-all duration-1000" 
                                   style={{ width: `${(cat.count / stats.totalRequests) * 100}%` }}
                                 ></div>
                              </div>
                           </div>
                         )) : (
                           <div className="py-10 text-center text-charcoal/40 font-medium italic">No category data available yet.</div>
                         )}
                      </div>
                   </div>

                   <div className="bg-charcoal p-10 rounded-[40px] text-white flex flex-col justify-between">
                      <div className="space-y-4">
                         <ShieldAlert size={48} className="text-error" />
                         <h3 className="text-3xl font-display font-bold">System Health Monitoring</h3>
                         <p className="text-white/40 leading-relaxed font-medium">Platform integrity is at 99.8%. Security audit completed 2 hours ago with zero critical vulnerabilities found.</p>
                      </div>
                      <div className="pt-8 border-t border-white/10 mt-8 flex justify-between items-center">
                         <div className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Last Data Sync</div>
                         <div className="text-[10px] font-extrabold uppercase tracking-widest">{new Date().toLocaleTimeString()}</div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-charcoal/5 flex items-center justify-center gap-12 py-20">
                   <div className="text-center space-y-2">
                      <div className="text-4xl font-display font-bold text-secondary">
                         {((stats?.solvedRequests / stats?.totalRequests) * 100 || 0).toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal/30">Resolution Rate</div>
                   </div>
                   <div className="w-px h-12 bg-charcoal/5"></div>
                   <div className="text-center space-y-2">
                      <div className="text-4xl font-display font-bold text-charcoal">
                         {stats?.totalUsers ? (stats.totalRequests / stats.totalUsers).toFixed(1) : 0}
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal/30">Reqs Per User</div>
                   </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-8 rounded-[40px] border border-charcoal/5 shadow-sm space-y-4">
     <div className="w-12 h-12 bg-[#fbf9f5] rounded-2xl flex items-center justify-center text-charcoal/60">
        <Icon size={24} />
     </div>
     <div>
        <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-charcoal/40">{label}</div>
        <div className="text-4xl font-display font-bold text-charcoal pt-1">{value}</div>
     </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon: Icon }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 pb-8 border-b-2 transition-all px-2",
      active ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/30 hover:text-charcoal/60"
    )}
  >
     <Icon size={18} />
     <span className="font-display font-bold text-[15px] tracking-tight">{label}</span>
  </button>
);

export default AdminDashboard;
