import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { login, toggleDevMode, devMode } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDevToggle, setShowDevToggle] = useState(false);
    const [logoTapCount, setLogoTapCount] = useState(0);

    const handleLogoTap = () => {
        const newCount = logoTapCount + 1;
        setLogoTapCount(newCount);

        if (newCount >= 3) {
            setShowDevToggle(true);
            setTimeout(() => setLogoTapCount(0), 3000);
        } else {
            setTimeout(() => setLogoTapCount(0), 1000);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter both email and password.');
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
        }
    };

    const handleDevMode = () => {
        toggleDevMode();
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-1 p-6 justify-center`}>

                    {/* Logo/Title Section */}
                    <TouchableOpacity
                        onPress={handleLogoTap}
                        activeOpacity={0.8}
                        style={tw`items-center mb-12`}
                    >
                        <View style={tw`w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mb-4 shadow-lg shadow-indigo-500/50`}>
                            <Feather name="shield" size={40} color="#fff" />
                        </View>
                        <Text style={tw`text-slate-900 text-4xl font-extrabold tracking-tight mb-2`}>Nav Sahayak</Text>
                        <Text style={tw`text-slate-500 text-sm font-medium`}>Legal Intelligence Platform</Text>
                    </TouchableOpacity>

                    {/* Login Form */}
                    <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-50 shadow-xl shadow-indigo-100/50 gap-5 mb-6`}>
                        <Text style={tw`text-slate-900 text-2xl font-bold mb-2`}>Welcome Back</Text>

                        {/* Email Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Email</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="mail" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="your.email@example.com"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Password</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="lock" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showPassword}
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={tw`bg-indigo-600 p-5 rounded-[24px] shadow-xl shadow-indigo-500/40 active:scale-[0.98] mt-2`}
                        >
                            <Text style={tw`text-white font-bold text-lg text-center tracking-wide`}>Login</Text>
                        </TouchableOpacity>

                        {/* Dev Mode Toggle (Hidden by default) */}
                        {showDevToggle && (
                            <TouchableOpacity
                                onPress={handleDevMode}
                                style={tw`bg-amber-50 p-4 rounded-2xl border border-amber-200 flex-row items-center gap-3`}
                            >
                                <Feather name="zap" size={20} color="#f59e0b" />
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-amber-900 font-bold`}>Developer Mode</Text>
                                    <Text style={tw`text-amber-600 text-xs`}>Skip authentication</Text>
                                </View>
                                <View style={tw`w-8 h-8 rounded-full ${devMode ? 'bg-amber-500' : 'bg-slate-300'} items-center justify-center`}>
                                    {devMode && <Feather name="check" size={16} color="#fff" />}
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Sign Up Link */}
                    <View style={tw`flex-row items-center justify-center gap-2`}>
                        <Text style={tw`text-slate-500 font-medium`}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text style={tw`text-indigo-600 font-bold`}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
