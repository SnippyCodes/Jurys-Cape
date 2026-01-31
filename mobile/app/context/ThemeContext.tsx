import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeColors {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    border: string;
    borderLight: string;
    cardBg: string;
    inputBg: string;
    success: string;
    warning: string;
    error: string;
    info: string;
}

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: ThemeColors;
}

const lightColors: ThemeColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    primary: '#4f46e5',
    primaryLight: '#eef2ff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    cardBg: '#ffffff',
    inputBg: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
};

const darkColors: ThemeColors = {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceAlt: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    primary: '#6366f1',
    primaryLight: '#312e81',
    border: '#334155',
    borderLight: '#475569',
    cardBg: '#1e293b',
    inputBg: '#0f172a',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
