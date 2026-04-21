import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

const FeedbackModal = ({ isOpen, onClose, type = 'success', title, message }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  const icons = {
    success: <CheckCircle2 className="text-[#0D9488]" size={32} />,
    error: <XCircle className="text-red-500" size={32} />,
    warning: <AlertCircle className="text-amber-500" size={32} />
  };

  const bgColors = {
    success: 'bg-[#0D9488]/5 border-[#0D9488]/10',
    error: 'bg-red-50 border-red-100',
    warning: 'bg-amber-50 border-amber-100'
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/20 backdrop-blur-sm transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "bg-white w-full max-w-[440px] rounded-[40px] shadow-2xl border border-charcoal/5 overflow-hidden transition-all duration-500",
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
        )}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="p-8 space-y-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-charcoal/20 hover:text-charcoal transition-colors"
          >
            <X size={20} />
          </button>

          <div className="pt-4">
            <div className={cn(
              "w-20 h-20 rounded-[28px] mx-auto flex items-center justify-center border-2 mb-6 shadow-xl shadow-black/5",
              bgColors[type]
            )}>
              {icons[type]}
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-display font-bold text-charcoal tracking-tighter capitalize">{title || type}</h3>
              <p className="text-charcoal/50 text-[15px] font-medium leading-relaxed max-w-[80%] mx-auto">
                {message}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={cn(
              "w-full py-4.5 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-lg",
              type === 'success' ? "bg-[#0D9488] text-white shadow-[#0D9488]/20" : 
              type === 'error' ? "bg-red-500 text-white shadow-red-500/20" :
              "bg-amber-500 text-white shadow-amber-500/20"
            )}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
