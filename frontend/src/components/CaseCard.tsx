import { FileText, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface CaseCardProps {
    id: string;
    title: string;
    status: 'pending' | 'analyzed' | 'closed';
    date: string;
    priority: 'high' | 'medium' | 'low';
    onClick: (id: string) => void;
}

export function CaseCard({ id, title, status, date, priority, onClick }: CaseCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => onClick(id)}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer",
                "dark:border-slate-800 dark:bg-slate-900"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "rounded-full p-2",
                    status === 'analyzed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                    <FileText className="h-5 w-5" />
                </div>
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
                    priority === 'high' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                )}>
                    {priority}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span className="capitalize">{status}</span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
                <div className={cn(
                    "h-full transition-all duration-300 w-0 group-hover:w-full",
                    status === 'analyzed' ? "bg-emerald-500" : "bg-blue-500"
                )} />
            </div>

            <div className="absolute right-4 bottom-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-slate-400" />
            </div>
        </motion.div>
    );
}
