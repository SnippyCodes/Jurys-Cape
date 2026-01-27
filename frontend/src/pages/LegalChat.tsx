import { useState, useRef, useEffect } from 'react';
import { caseService } from '../api/client';
import { Send, User, Bot, Sparkles, ShieldCheck } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-lg p-2 text-white">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900">LEGAL ADVISOR BOT</h1>
                        <p className="text-xs text-slate-500">RAG Enabled • BNS 2023 Database</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Secure</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-100/50">
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
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm",
                            msg.role === 'user' ? "bg-slate-900 text-white border-slate-800" : "bg-white text-blue-600 border-slate-200"
                        )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-slate-900 text-white rounded-tr-none"
                                : "bg-white text-slate-700 rounded-tl-none border border-slate-200"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex gap-4 max-w-[80%]">
                        <div className="h-8 w-8 rounded-full bg-white text-blue-600 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accessing Database</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75" />
                                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3 relative"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Query legal precedents or section details..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all hover:bg-white"
                    />
                    <button
                        type="submit"
                        disabled={!input || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition-all disabled:opacity-50 disabled:scale-95 shadow-md shadow-blue-200"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
