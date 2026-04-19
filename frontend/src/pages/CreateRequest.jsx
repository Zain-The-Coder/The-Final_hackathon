// Form ke andar description handle karte waqt
const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescription(text);
    
    // AI Hint Logic (UI Only for instant feel)
    if(text.toLowerCase().includes('react')) setAiHint('Detected: Web Development');
    if(text.toLowerCase().includes('urgent')) setAiHint('Urgency: High detected');
};

return (
    <div className="max-w-2xl mx-auto py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">What do you need help with?</h2>
        <div className="bg-[#111113] p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-zinc-400 mb-2 block">Problem Title</label>
                    <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" placeholder="e.g. Help needed with MongoDB aggregation" />
                </div>
                <div>
                    <label className="text-sm font-medium text-zinc-400 mb-2 block">Description</label>
                    <textarea 
                        rows="5" 
                        onChange={handleDescriptionChange}
                        className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                        placeholder="Explain your problem in detail..."
                    />
                    {aiHint && <p className="text-[10px] text-blue-400 mt-2 font-mono">✨ AI Hint: {aiHint}</p>}
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition">Post Request</button>
            </div>
        </div>
    </div>
);