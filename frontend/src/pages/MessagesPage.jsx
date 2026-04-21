import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  User as UserIcon, 
  ChevronDown,
  Clock,
  ArrowRight,
  PlusCircle,
  Hash
} from 'lucide-react';
import { cn } from '../utils/cn';
import { formatDistanceToNow } from 'date-fns';

const MessagesPage = () => {
    const { user: currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Selection state
    const [selectedChat, setSelectedChat] = useState(null); // { otherUser, helpRequest, messages }
    const [history, setHistory] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);
    
    // New conversation state
    const [selectedReceiver, setSelectedReceiver] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [convsRes, usersRes] = await Promise.all([
                    api.get('/chat/conversations'),
                    api.get('/user/all')
                ]);

                if (convsRes.data.success) {
                    setConversations(convsRes.data.conversations);
                }
                if (usersRes.data.success) {
                    setAllUsers(usersRes.data.users);
                }
            } catch (error) {
                console.error("Failed to load messaging data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Polling for new messages in active chat
    useEffect(() => {
        let interval;
        if (selectedChat) {
            scrollToBottom();
            const fetchUpdate = async () => {
                try {
                    const requestId = selectedChat.helpRequest?._id || 'null';
                    const { data } = await api.get(`/chat/history/${requestId}/${selectedChat.otherUser._id}`);
                    if (data.success) {
                        setHistory(data.messages);
                    }
                } catch (e) {}
            };
            interval = setInterval(fetchUpdate, 5000);
        }
        return () => clearInterval(interval);
    }, [selectedChat]);

    const handleOpenChat = async (conv) => {
        setSelectedChat(conv);
        setFetchingHistory(true);
        setError(null);
        try {
            const requestId = conv.helpRequest?._id || 'null';
            const { data } = await api.get(`/chat/history/${requestId}/${conv.otherUser._id}`);
            if (data.success) {
                setHistory(data.messages);
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const content = messageContent.trim();
        if (!content) return;

        // Determine destination
        const receiverId = selectedChat ? selectedChat.otherUser._id : selectedReceiver;
        const requestId = selectedChat ? selectedChat.helpRequest?._id : null;

        if (!receiverId) {
            setError('Please select a recipient.');
            return;
        }

        setSending(true);
        setError(null);
        try {
            const { data } = await api.post('/chat/send', {
                receiverId,
                content,
                helpRequestId: requestId
            });

            if (data.success) {
                setMessageContent('');
                
                // If in active chat, append immediately for responsiveness
                if (selectedChat) {
                    setHistory(prev => [...prev, data.data]);
                    setTimeout(scrollToBottom, 100);
                } else {
                    // If starting new, switch to that chat
                    const newConv = {
                        otherUser: allUsers.find(u => u._id === receiverId),
                        helpRequest: null,
                        lastMessage: data.data
                    };
                    setSelectedChat(newConv);
                    setHistory([data.data]);
                }

                // Refresh conversation list
                const convsRes = await api.get('/chat/conversations');
                if (convsRes.data.success) setConversations(convsRes.data.conversations);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0]">
            <Loader2 className="animate-spin text-secondary" size={40} />
        </div>
    );

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header Banner */}
            <section className="bg-charcoal text-white p-14 rounded-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="space-y-4 relative z-10">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Interaction / Messaging</div>
                    <h1 className="text-5xl font-display font-bold tracking-tight leading-tight text-white mb-2">
                        Communication is the bridge to better support.
                    </h1>
                    <p className="text-white/40 font-medium text-lg max-w-2xl leading-relaxed">
                        Open your active dialogues, review history, and coordinate next steps with your community helpers.
                    </p>
                </div>
            </section>

            <div className="grid lg:grid-cols-12 gap-10">
                
                {/* Left Column: Conversations List (5/12) */}
                <div className="lg:col-span-5 bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm space-y-8 flex flex-col h-[750px]">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Conversations</div>
                            <h2 className="text-3xl font-display font-bold tracking-tight text-charcoal">Recent activity</h2>
                        </div>
                        <button 
                            onClick={() => { setSelectedChat(null); setError(null); setMessageContent(''); }}
                            className="p-3 bg-charcoal/5 hover:bg-secondary hover:text-white rounded-2xl transition-all group"
                            title="Start new conversation"
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-charcoal/5 rounded-[32px] space-y-4">
                                <MessageSquare size={32} className="text-charcoal/10 mx-auto" />
                                <p className="text-charcoal/40 font-bold uppercase tracking-widest text-[9px]">No recent signals</p>
                            </div>
                        ) : (
                            conversations.map((conv, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleOpenChat(conv)}
                                    className={cn(
                                        "p-6 rounded-[32px] border transition-all cursor-pointer group flex items-start gap-4",
                                        selectedChat?.otherUser?._id === conv.otherUser._id && (selectedChat?.helpRequest?._id === conv.helpRequest?._id)
                                            ? "bg-secondary/5 border-secondary/20 shadow-sm" 
                                            : "bg-[#fbf9f5] border-charcoal/5 hover:border-charcoal/10"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-charcoal/5 flex items-center justify-center text-charcoal font-black text-lg group-hover:scale-110 transition-transform">
                                        {conv.otherUser.name?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1 space-y-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-charcoal truncate">{conv.otherUser.name}</span>
                                            <span className="text-[9px] font-black text-charcoal/20 uppercase tracking-widest">
                                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-charcoal/40 truncate line-clamp-1 italic">
                                            {conv.lastMessage.content}
                                        </p>
                                        {conv.helpRequest && (
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-secondary uppercase tracking-[0.1em] pt-1 pt-1 overflow-hidden">
                                                <Hash size={8} />
                                                <span className="truncate">{conv.helpRequest.title}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Active Chat or New Form (7/12) */}
                <div className="lg:col-span-7 bg-white p-10 rounded-[40px] border border-charcoal/5 shadow-sm flex flex-col h-[750px]">
                    {!selectedChat ? (
                        /* MODE: START NEW CONVERSATION */
                        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <div className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Direct Connect</div>
                                <h2 className="text-4xl font-display font-bold tracking-tight text-charcoal leading-none">
                                    Start a conversation
                                </h2>
                                <p className="text-charcoal/40 text-sm font-medium">Reach out to any community member to begin coordinating support.</p>
                            </div>

                            <form onSubmit={handleSendMessage} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 px-1">To</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedReceiver}
                                            onChange={(e) => setSelectedReceiver(e.target.value)}
                                            className="w-full bg-[#fbf9f5] border border-charcoal/5 rounded-2xl p-5 font-bold text-[15px] outline-none appearance-none pr-12 focus:border-secondary transition-all"
                                        >
                                            <option value="">Select a community member</option>
                                            {allUsers.map(u => (
                                                <option key={u._id} value={u._id}>{u.name} (Trust: {u.trustScore}%)</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 px-1">Initial Message</label>
                                    <textarea 
                                        rows={6}
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        placeholder="Start describing how you want to help or what you need..."
                                        className="w-full bg-[#fbf9f5] border border-charcoal/5 rounded-[32px] p-6 font-medium text-[15px] outline-none focus:border-secondary transition-all resize-none h-[250px]"
                                    />
                                </div>

                                {error && <div className="p-5 bg-red-50 text-red-500 rounded-2xl text-xs font-bold leading-relaxed">⚠️ {error}</div>}

                                <button 
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-secondary text-white py-5 rounded-[24px] font-display font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {sending ? 'Initiating Link...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* MODE: ACTIVE CHAT SCREEN */
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                            {/* Chat Header */}
                            <div className="pb-6 border-b border-charcoal/5 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center font-black text-xl">
                                        {selectedChat.otherUser.name?.[0] || 'U'}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display font-bold text-charcoal tracking-tight">{selectedChat.otherUser.name}</h3>
                                        {selectedChat.helpRequest && (
                                            <div className="px-3 py-1 bg-secondary/5 text-[#0D9488] rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                                <Hash size={10} />
                                                {selectedChat.helpRequest.title}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedChat(null)}
                                    className="px-5 py-2 hover:bg-charcoal/5 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/20 hover:text-charcoal transition-all"
                                >
                                    New Search
                                </button>
                            </div>

                            {/* Message History area */}
                            <div className="flex-1 overflow-y-auto py-8 space-y-6 pr-2 custom-scrollbar">
                                {fetchingHistory ? (
                                    <div className="h-full flex items-center justify-center">
                                        <Loader2 className="animate-spin text-secondary/20" size={32} />
                                    </div>
                                ) : (
                                    history.map((msg, i) => {
                                        const isMe = msg.sender._id === currentUser._id;
                                        return (
                                            <div key={i} className={cn(
                                                "max-w-[85%] space-y-1.5",
                                                isMe ? "ml-auto" : "mr-auto"
                                            )}>
                                                <div className={cn(
                                                    "p-5 px-7 rounded-[30px] text-sm leading-relaxed shadow-sm font-medium",
                                                    isMe 
                                                        ? "bg-secondary text-white rounded-br-none" 
                                                        : "bg-[#fbf9f5] text-charcoal border border-charcoal/5 rounded-bl-none"
                                                )}>
                                                    {msg.content}
                                                </div>
                                                <div className={cn(
                                                    "text-[9px] font-black text-charcoal/20 uppercase tracking-widest",
                                                    isMe ? "text-right mr-2" : "text-left ml-2"
                                                )}>
                                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Reply Input */}
                            <form onSubmit={handleSendMessage} className="pt-6 border-t border-charcoal/5 flex gap-4">
                                <input 
                                    type="text"
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-[#fbf9f5] border border-charcoal/5 rounded-[24px] px-6 py-4 font-medium text-sm outline-none focus:border-secondary transition-all"
                                />
                                <button 
                                    type="submit"
                                    disabled={sending || !messageContent.trim()}
                                    className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center hover:shadow-lg disabled:opacity-20 transition-all active:scale-95"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
