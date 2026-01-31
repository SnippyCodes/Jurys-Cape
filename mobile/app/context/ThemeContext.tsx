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
    background: '#000000',
    surface: '#0a0a0a',
    surfaceAlt: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textTertiary: '#808080',
    primary: '#6366f1',
    primaryLight: '#1e1b4b',
    border: '#1a1a1a',
    borderLight: '#2a2a2a',
    cardBg: '#0a0a0a',
    inputBg: '#000000',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',
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
