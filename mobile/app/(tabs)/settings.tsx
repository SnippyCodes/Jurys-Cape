import { View, Text, Switch, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import tw from 'twrnc';
import { useState } from 'react';

export default function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-10`}>

                {/* Integrated Header - Medium (Reduced) */}
                <View style={tw`mt-2`}>
                    <Text style={tw`text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>Preferences</Text>
                    <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight`}>Settings</Text>
                </View>

                {/* Profile Card - Medium */}
                <View style={tw`bg-white p-5 rounded-[24px] border border-indigo-50 shadow-md shadow-indigo-100/50 flex-row items-center gap-4`}>
                    <View style={tw`w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full items-center justify-center shadow-md shadow-indigo-300 border-4 border-indigo-50`}>
                        <Text style={tw`text-white font-bold text-xl`}>K</Text>
                    </View>
                    <View>
                        <Text style={tw`text-slate-900 text-xl font-bold tracking-tight`}>Krushna</Text>
                        <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wider mb-2`}>ID: 8829-AZ</Text>
                        <View style={tw`bg-indigo-50 self-start px-2.5 py-1 rounded-full border border-indigo-100`}>
                            <Text style={tw`text-indigo-700 text-[10px] font-bold uppercase`}>Senior Inspector</Text>
                        </View>
                    </View>
                </View>

                {/* Preferences Section - Medium */}
                <View style={tw`rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white`}>
                    {/* Dark Mode */}
                    <View style={tw`flex-row items-center justify-between p-5 bg-white`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-purple-50 p-3 rounded-2xl`}>
                                <Feather name="moon" size={20} color="#7c3aed" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    {/* Notifications */}
                    <View style={tw`flex-row items-center justify-between p-5 bg-white`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-amber-50 p-3 rounded-2xl`}>
                                <Feather name="bell" size={20} color="#d97706" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>Notifications</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    {/* Language */}
                    <TouchableOpacity style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-cyan-50 p-3 rounded-2xl`}>
                                <Feather name="globe" size={20} color="#0891b2" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>Language</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                {/* Support Section - Medium */}
                <View style={tw`rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white`}>
                    <TouchableOpacity style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-emerald-50 p-3 rounded-2xl`}>
                                <Feather name="help-circle" size={20} color="#059669" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>Help Center</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    <TouchableOpacity style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-blue-50 p-3 rounded-2xl`}>
                                <Feather name="shield" size={20} color="#2563eb" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>Privacy & Security</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={tw`mt-4 bg-red-50 border border-red-100 p-5 rounded-3xl flex-row items-center justify-center gap-3 active:bg-red-100`}>
                    <Feather name="log-out" size={20} color="#ef4444" />
                    <Text style={tw`text-red-600 font-bold text-base`}>Log Out</Text>
                </TouchableOpacity>

                <Text style={tw`text-slate-400 text-center text-xs mt-4 font-bold tracking-wide uppercase`}>App Version 1.0.8 (Stable)</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
