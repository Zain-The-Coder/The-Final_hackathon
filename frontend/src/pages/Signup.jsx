import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Both' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20 text-xl font-bold">H</div>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-zinc-500 mt-2">Enter your details to join the community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Full Name</label>
            <input 
              type="text" required
              className="w-full bg-[#111113] border border-white/5 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              placeholder="John Doe"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {['Need Help', 'Can Help', 'Both'].map((r) => (
                <button
                  key={r} type="button"
                  onClick={() => setFormData({...formData, role: r})}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${formData.role === r ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/5 text-zinc-500'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email</label>
            <input 
              type="email" required
              className="w-full bg-[#111113] border border-white/5 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              placeholder="m@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <input 
              type="password" required
              className="w-full bg-[#111113] border border-white/5 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-white text-black font-bold py-3 rounded-xl mt-6 hover:bg-zinc-200 transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;