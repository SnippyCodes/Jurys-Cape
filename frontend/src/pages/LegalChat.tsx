import { useState, useRef, useEffect } from 'react';
import { caseService } from '../api/client';
import { Send, User, Bot, Sparkles, ShieldCheck, CircuitBoard } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function LegalChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Connection Established. Authorized officer detected. How may I assist with legal queries today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const data = await caseService.chat(userMsg);
            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Secure connection lost. Retry handshake.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col glass-panel rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black"></div>

            {/* Header */}
            <div className="bg-[var(--bg-panel)] theme-border border-b p-4 flex items-center justify-between backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 rounded-lg p-2 text-blue-400 border border-blue-500/20">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-wide text-[var(--text-main)]">LEGAL ADVISOR BOT</h1>
                        <p className="text-[10px] flex items-center gap-2 text-[var(--text-muted)]">
                            <CircuitBoard className="h-3 w-3" /> RAG Enabled • BNS 2023 Database
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Secure</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 custom-scrollbar bg-[var(--bg-app)]">
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn(
                            "flex gap-4 max-w-[85%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-lg",
                            msg.role === 'user' ? "bg-slate-800 text-slate-300 border-white/10" : "bg-blue-600 text-white border-blue-500 shadow-blue-500/20"
                        )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm border",
                            msg.role === 'user'
                                ? "bg-slate-800/80 text-slate-200 rounded-tr-none border-white/5"
                                : "theme-bg-surface theme-border backdrop-blur-md rounded-tl-none text-[var(--text-main)]"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex gap-4 max-w-[80%]">
                        <div className="h-9 w-9 rounded-xl bg-blue-600 text-white border border-blue-500 shadow-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="glass-panel p-4 rounded-2xl rounded-tl-none flex gap-3 items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accessing Database</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-75" />
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 theme-border bg-[var(--bg-panel)] border-t z-10">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3 relative"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Query legal precedents or section details..."
                        className="flex-1 bg-[var(--bg-card)] theme-border border rounded-xl px-4 py-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 focus:outline-none text-sm transition-all text-[var(--text-main)] placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!input || loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-xl transition-all disabled:opacity-50 disabled:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
