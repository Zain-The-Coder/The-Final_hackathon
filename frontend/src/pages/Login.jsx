import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 mt-2">Enter your email to sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email</label>
            <input 
              type="email" required
              className="w-full bg-[#111113] border border-white/5 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <a href="#" className="text-xs text-blue-500 hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" required
              className="w-full bg-[#111113] border border-white/5 p-3 rounded-xl focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-white text-black font-bold py-3 rounded-xl mt-4 hover:bg-zinc-200 transition">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;