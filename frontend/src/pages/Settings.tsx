import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    System Configuration
                </h1>
                <p className="text-slate-400 mt-2">Manage interface preferences and system parameters.</p>
            </div>

            {/* Appearance Section */}
            <section className="glass-panel p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-3 border-b pb-4 border-[var(--glass-border)]">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Monitor className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">Interface Appearance</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium text-[var(--text-main)]">Theme Preference</h3>
                        <p className="text-sm text-[var(--text-muted)]">Toggle between system standard (Light) and high-contrast (Dark) modes.</p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                            theme === 'dark' ? "bg-slate-700" : "bg-blue-200"
                        )}
                    >
                        <motion.div
                            layout
                            className={cn(
                                "absolute top-1 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all bg-white",
                                theme === 'dark' ? "left-1 text-slate-900" : "right-1 text-amber-500"
                            )}
                        >
                            {theme === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-4 w-4" />}
                        </motion.div>
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section className="glass-panel p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-3 border-b pb-4 border-[var(--glass-border)]">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <Shield className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">System Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-[var(--bg-card)] border-[var(--glass-border)]">
                        <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Version</p>
                        <p className="font-mono text-sm mt-1 text-[var(--text-main)]">v2.4.0 (Stable)</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-[var(--bg-card)] border-[var(--glass-border)]">
                        <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Security Protocol</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="font-mono text-sm text-emerald-400">Encrypted (AES-256)</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
