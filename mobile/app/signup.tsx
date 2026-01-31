import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Signup() {
    const router = useRouter();
    const { signup } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }

        const success = await signup(name, email, phone, password);
        if (success) {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } else {
            Alert.alert('Signup Failed', 'Could not create account. Please try again.');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`p-6 pb-10`}>

                    {/* Header */}
                    <View style={tw`mt-8 mb-8`}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`w-10 h-10 rounded-full bg-white items-center justify-center mb-6 shadow-sm`}>
                            <Feather name="arrow-left" size={20} color="#64748b" />
                        </TouchableOpacity>
                        <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight mb-2`}>Create Account</Text>
                        <Text style={tw`text-slate-500 text-base`}>Join Nav Sahayak today</Text>
                    </View>

                    {/* Signup Form */}
                    <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-50 shadow-xl shadow-indigo-100/50 gap-5 mb-6`}>

                        {/* Name Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Full Name *</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="user" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#94a3b8"
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Email *</Text>
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

                        {/* Phone Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Phone Number</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="phone" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="+91 XXXXX XXXXX"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="phone-pad"
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Password *</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="lock" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="Min. 6 characters"
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

                        {/* Confirm Password Input */}
                        <View>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Confirm Password *</Text>
                            <View style={tw`flex-row items-center bg-slate-50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="check-circle" size={20} color="#6366f1" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="Re-enter password"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showPassword}
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        {/* Signup Button */}
                        <TouchableOpacity
                            onPress={handleSignup}
                            style={tw`bg-indigo-600 p-5 rounded-[24px] shadow-xl shadow-indigo-500/40 active:scale-[0.98] mt-2`}
                        >
                            <Text style={tw`text-white font-bold text-lg text-center tracking-wide`}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Link */}
                    <View style={tw`flex-row items-center justify-center gap-2`}>
                        <Text style={tw`text-slate-500 font-medium`}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={tw`text-indigo-600 font-bold`}>Login</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
