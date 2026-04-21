import React, { useState } from 'react';
import { Button } from '../components/UIPrimitives';
import { Sparkles, Target, Zap, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

const OnboardingPage = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    'Frontend', 'Backend', 'UI/UX Design', 'Branding', 'Python', 'Case Studies',
    'Machine Learning', 'SQL', 'Mobile Apps', 'Social Media', 'Content Writing'
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="bg-charcoal text-white p-12 rounded-[40px] space-y-6">
        <div className="text-white/40 text-xs font-bold uppercase tracking-widest text-[#B4B6B9]">Onboarding</div>
        <h1 className="text-6xl font-bold tracking-tighter leading-none max-w-4xl">
          Personalize your help experience.
        </h1>
        <p className="text-white/60 max-w-lg leading-relaxed text-lg text-[#B4B6B9]">
          Tell us what you're good at and what you want to learn so we can match you with the right community needs.
        </p>
      </section>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm space-y-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">What are your interests?</h3>
              <p className="text-charcoal/50 text-sm font-medium">Select a few topics to help our AI generate your profile map.</p>
              
              <div className="flex flex-wrap gap-3 pt-4">
                {interests.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={cn(
                      "px-6 py-3 rounded-full text-sm font-bold transition-all border-2",
                      selectedInterests.includes(item)
                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                        : "bg-white border-charcoal/5 text-charcoal/40 hover:border-charcoal/10"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="text-3xl font-bold tracking-tight">Where are you based?</h3>
               <input 
                 type="text" 
                 placeholder="Karachi, Lahore, Remote" 
                 className="w-full bg-charcoal/5 px-6 py-4 rounded-2xl border-none font-medium focus:ring-2 focus:ring-accent outline-none"
               />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
             <Button variant="outline">Skip for now</Button>
             <Button className="flex-1">Finish setup</Button>
          </div>
        </div>

        {/* AI Suggestion Panel */}
        <div className="lg:col-span-2 bg-[#EDEBDE] p-10 rounded-[40px] space-y-8 sticky top-36">
           <div className="space-y-2">
             <div className="text-accent font-bold text-xs tracking-widest uppercase">AI Suggestion</div>
             <h3 className="text-3xl font-bold tracking-tight leading-tight">Your likely contribution map</h3>
           </div>

           <div className="space-y-8">
              <AiMapItem 
                icon={Zap}
                label="You can help with"
                items={selectedInterests.length > 0 ? selectedInterests.slice(0, 2) : ["-"]}
                description="Based on your skills, you're a great fit for these community needs."
              />
              <AiMapItem 
                icon={Heart}
                label="You may need help with"
                items={["Advanced Concepts", "Career Guidance"]}
                description="We've identified areas where matching with a mentor would benefit you."
              />
           </div>

           {selectedInterests.length === 0 && (
             <div className="bg-charcoal/5 p-6 rounded-2xl flex gap-4">
                <Sparkles className="text-accent shrink-0" size={20} />
                <p className="text-charcoal/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                  Select your interests to generate AI insights.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const AiMapItem = ({ icon: Icon, label, items, description }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
       <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
         <Icon size={16} />
       </div>
       <label className="text-xs font-bold uppercase tracking-widest text-charcoal/40">{label}</label>
    </div>
    <div className="flex flex-wrap gap-2 text-sm font-black text-charcoal">
       {items.join(' • ')}
    </div>
    <p className="text-charcoal/40 text-xs leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

export default OnboardingPage;
