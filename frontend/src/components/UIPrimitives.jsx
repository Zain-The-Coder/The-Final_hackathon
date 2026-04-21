import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn'; // I'll create this utility next

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  icon: Icon, 
  ...props 
}) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20",
    secondary: "bg-charcoal text-white hover:bg-charcoal-light shadow-lg shadow-charcoal/20",
    outline: "bg-white border-2 border-charcoal/5 hover:border-charcoal/10 text-charcoal",
    ghost: "bg-transparent hover:bg-charcoal/5 text-charcoal"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
      {Icon && <Icon size={18} className="transition-transform group-hover:translate-x-1" />}
    </button>
  );
};

const StatCard = ({ label, value, description }) => (
  <div className="bg-white p-8 rounded-[32px] border border-charcoal/5 shadow-sm space-y-2 flex flex-col justify-between h-full">
    <div>
      <div className="text-[#0D9488] text-[10px] font-bold uppercase tracking-widest mb-4">{label}</div>
      <div className="text-6xl font-black text-charcoal tracking-tighter mb-4">{value}</div>
    </div>
    <div className="text-charcoal/50 text-sm leading-relaxed">{description}</div>
  </div>
);

const FeatureCard = ({ title, description, dark = false, children }) => (
  <div className={cn(
    "p-12 rounded-[48px] h-full transition-transform hover:-translate-y-1 duration-500 relative overflow-hidden",
    dark ? "bg-charcoal text-white" : "bg-white text-charcoal/80 border border-charcoal/5 shadow-sm"
  )}>
    <div className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-sm", dark ? "text-[#94A3B8]" : "text-charcoal/40")}>
      Live Product Feel
    </div>
    <h3 className="text-5xl font-bold mb-8 leading-[1.1] tracking-tighter max-w-md">{title}</h3>
    <p className={cn("text-lg leading-relaxed mb-10", dark ? "text-white/40" : "text-charcoal/60")}>
      {description}
    </p>
    {children}
  </div>
);

export { Button, StatCard, FeatureCard };
