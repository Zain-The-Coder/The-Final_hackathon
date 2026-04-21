import React, { useState } from 'react';
import { ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { cn } from '../utils/cn';
import FeedbackModal from '../components/FeedbackModal';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [urgency, setUrgency] = useState('Medium');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = currentTag.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setCurrentTag('');
    }
  };

  const handleApplyAi = async () => {
    if (!title && !description) return setAiError('Please add a title or description first.');
    setAiLoading(true);
    setAiError(null);
    setAiData(null);
    try {
      const { data } = await api.post('/help/ai-suggestions', { title, description });
      if (data.success && data.suggestions) {
        setAiData(data.suggestions);
        if (data.suggestions.suggestedCategory) setCategory(data.suggestions.suggestedCategory);
        if (data.suggestions.suggestedTags?.length > 0 && tags.length === 0) setTags(data.suggestions.suggestedTags);
      } else {
        setAiError(data.message || 'AI failed to generate suggestions. Are you logged in?');
      }
    } catch (error) {
      console.error('AI Suggestions failed', error);
      setAiError(error.response?.data?.message || 'Connection error. Please ensure you are logged in.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !description) {
      setModal({
        isOpen: true,
        type: 'warning',
        title: 'Incomplete Request',
        message: 'Please provide both a title and a description before publishing.'
      });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/help/create', {
        title,
        description,
        category,
        urgency,
        tags
      });
      if (data.success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: 'Published',
          message: 'Your help request is now live in the community feed!'
        });
        setTimeout(() => navigate('/explore'), 2500);
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'System Issue',
          message: data.message
        });
      }
    } catch (error) {
      console.error("Publish failed", error);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Something went wrong while publishing. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-12 pt-8 pb-32 space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="bg-charcoal text-white p-16 rounded-[2.5rem] relative overflow-hidden">
         <div className="space-y-6 relative z-10 max-w-4xl">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">CREATE REQUEST</p>
            <h1 className="text-[64px] font-display font-bold leading-[1.1] tracking-[-0.03em] text-white">
              Turn a rough problem into a clear help request.
            </h1>
            <p className="text-white/60 text-[15px] font-medium max-w-2xl leading-relaxed">
              Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite.
            </p>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
         {/* Form Section */}
         <div className="lg:col-span-7 bg-[#fbf9f5] p-12 rounded-[2.5rem] border border-charcoal/5 space-y-10 shadow-sm">
            <div className="space-y-8">
               {/* Title */}
               <div className="space-y-3">
                  <label className="text-[13px] font-bold text-charcoal/60 px-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Need review on my JavaScript quiz app before submission"
                    className="w-full bg-white border border-charcoal/10 rounded-2xl p-4 font-medium text-[15px] outline-none focus:border-secondary transition-all shadow-sm"
                  />
               </div>

               {/* Description */}
               <div className="space-y-3">
                  <label className="text-[13px] font-bold text-charcoal/60 px-1">Description</label>
                  <textarea 
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                    className="w-full bg-white border border-charcoal/10 rounded-2xl p-5 font-medium text-[15px] outline-none focus:border-secondary transition-all resize-none shadow-sm"
                  />
               </div>

               {/* Tags & Category */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[13px] font-bold text-charcoal/60 px-1">Tags (Enter for each)</label>
                     <div className="relative">
                        <input 
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="JavaScript, Debugging..."
                          className="w-full bg-white border border-charcoal/10 rounded-2xl p-4 font-medium text-[15px] outline-none focus:border-secondary shadow-sm transition-all"
                        />
                     </div>
                     {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-1">
                           {tags.map(tag => (
                              <span key={tag} className="text-[11px] font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full flex items-center gap-1">
                                 {tag}
                                 <button onClick={() => handleRemoveTag(tag)} className="hover:text-charcoal">×</button>
                              </span>
                           ))}
                        </div>
                     )}
                  </div>
                  <div className="space-y-3">
                     <label className="text-[13px] font-bold text-charcoal/60 px-1">Category</label>
                     <div className="relative">
                        <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white border border-charcoal/10 rounded-2xl p-4 font-medium text-[15px] outline-none appearance-none pr-12 focus:border-secondary transition-all shadow-sm"
                        >
                           <option>Web Development</option>
                           <option>Design</option>
                           <option>Data Science</option>
                           <option>Career</option>
                           <option>Marketing</option>
                           <option>Community</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
                     </div>
                  </div>
               </div>

               {/* Urgency */}
               <div className="space-y-3">
                  <label className="text-[13px] font-bold text-charcoal/60 px-1">Urgency</label>
                  <div className="relative">
                     <select 
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full bg-white border border-charcoal/10 rounded-2xl p-4 font-medium text-[15px] outline-none appearance-none pr-12 focus:border-secondary transition-all shadow-sm"
                     >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
                  </div>
               </div>
            </div>
            <div className="flex gap-4 pt-4">
               <button 
                  onClick={handleApplyAi}
                  disabled={aiLoading}
                  className="bg-white text-charcoal border border-charcoal/10 px-8 py-3.5 rounded-full font-bold text-[14px] hover:bg-surface-container transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
               >
                 {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} className="text-secondary" />}
                 Apply AI suggestions
               </button>
               <button 
                  onClick={handlePublish}
                  disabled={loading}
                  className="bg-secondary text-white px-10 py-3.5 rounded-full font-bold text-[14px] hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
               >
                 {loading && <Loader2 className="animate-spin" size={16} />}
                 Publish request
               </button>
            </div>
         </div>

         <div className="lg:col-span-5 bg-white p-12 rounded-[2.5rem] border border-charcoal/5 shadow-sm space-y-10 min-h-[600px] sticky top-8">
             <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">AI ASSISTANT</p>
                  <h3 className="text-[44px] font-display font-bold leading-[1.1] tracking-[-0.02em]">Smart request guidance</h3>
               </div>
               {aiLoading && (
                 <div className="flex items-center gap-3 py-4 text-charcoal/40">
                   <Loader2 className="animate-spin text-secondary" size={20} />
                   <span className="text-sm font-medium">Gemini is analyzing your request...</span>
                 </div>
               )}
               {aiError && !aiLoading && (
                 <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium px-5 py-4 rounded-2xl">
                   ⚠️ {aiError}
                 </div>
               )}
               <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center py-4 border-b border-charcoal/5">
                     <span className="text-[14px] font-medium text-charcoal/40">Suggested category</span>
                     <span className="text-[14px] font-bold text-charcoal">{aiData?.suggestedCategory || 'Determining...'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-charcoal/5">
                     <span className="text-[14px] font-medium text-charcoal/40">Detected urgency</span>
                     <span className="text-[14px] font-bold text-charcoal">
                        {aiData?.detectedUrgency || 'Analyzing...'}
                     </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-charcoal/5">
                     <span className="text-[14px] font-medium text-charcoal/40">Suggested tags</span>
                     <span className="text-[14px] font-bold text-charcoal">{aiData?.suggestedTags?.join(', ') || 'Waiting for detail...'}</span>
                  </div>
                  <div className="flex flex-col gap-4 py-4">
                     <span className="text-[14px] font-medium text-charcoal/40">Rewrite suggestion</span>
                     <div className="bg-secondary/5 border border-secondary/10 p-6 rounded-3xl">
                        <span className="text-[14px] font-bold text-charcoal leading-relaxed italic">
                           "{aiData?.rewriteSuggestion || 'Start describing the challenge to generate a stronger version.'}"
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
      <FeedbackModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default CreateRequest;
