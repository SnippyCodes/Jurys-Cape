import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import tw from 'twrnc';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { CaseProvider } from './context/CaseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { isAuthenticated, devMode } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(tabs)';
        const inAuthPages = segments[0] === 'login' || segments[0] === 'signup';

        if (!isAuthenticated && !devMode && inAuthGroup) {
            // Redirect to login if not authenticated and trying to access tabs
            router.replace('/login');
        } else if ((isAuthenticated || devMode) && inAuthPages) {
            // Redirect to app if authenticated and on login/signup pages
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, devMode, segments]);

    return (
        <View style={tw`flex-1 bg-black`}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="case/[id]" options={{ presentation: 'modal' }} />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null; // Keep splash screen visible
    }

    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <CaseProvider>
                        <RootLayoutNav />
                    </CaseProvider>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
