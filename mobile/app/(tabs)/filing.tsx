import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

export default function Filing() {
    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-10`}>

                {/* Integrated Header - Medium Size */}
                <View style={tw`mt-2 mb-2`}>
                    <Text style={tw`text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>Incident Reporting</Text>
                    <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight`}>New Case</Text>
                </View>

                {/* Form Content - Medium Size */}
                <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-50 shadow-md shadow-indigo-100/50 gap-6`}>

                    {/* Case Title */}
                    <View>
                        <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Case Title</Text>
                        <View style={tw`flex-row items-center bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4 focus:border-indigo-500`}>
                            <Feather name="file-text" size={20} color="#4f46e5" style={tw`mr-3`} />
                            <TextInput
                                placeholder="e.g. State vs. Information"
                                placeholderTextColor="#94a3b8"
                                style={tw`flex-1 text-slate-900 font-bold text-base`}
                            />
                        </View>
                    </View>

                    {/* Parties - Side by Side (Fixed Layout) */}
                    <View style={tw`flex-row gap-4`}>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Filing Party</Text>
                            <View style={tw`flex-row items-center bg-indigo-50/50 rounded-2xl border border-indigo-100 px-3 py-4`}>
                                <Feather name="user" size={18} color="#4338ca" style={tw`mr-2`} />
                                <TextInput
                                    placeholder="Complainant"
                                    placeholderTextColor="#94a3b8"
                                    style={tw`flex-1 text-slate-900 font-medium text-sm`}
                                />
                            </View>
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Accused Party</Text>
                            <View style={tw`flex-row items-center bg-rose-50/50 rounded-2xl border border-rose-100 px-3 py-4`}>
                                <Feather name="user-x" size={18} color="#e11d48" style={tw`mr-2`} />
                                <TextInput
                                    placeholder="Suspect"
                                    placeholderTextColor="#94a3b8"
                                    style={tw`flex-1 text-slate-900 font-medium text-sm`}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Incident Type */}
                    <View>
                        <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Incident Type</Text>
                        <View style={tw`flex-row items-center bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4`}>
                            <Feather name="alert-triangle" size={20} color="#6366f1" style={tw`mr-3`} />
                            <TextInput
                                placeholder="e.g. Theft, Assault, Cyber Crime"
                                placeholderTextColor="#94a3b8"
                                style={tw`flex-1 text-slate-900 font-medium text-base`}
                            />
                        </View>
                    </View>

                    {/* Location */}
                    <View>
                        <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Location</Text>
                        <View style={tw`flex-row items-center bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4`}>
                            <Feather name="map-pin" size={20} color="#8b5cf6" style={tw`mr-3`} />
                            <TextInput
                                placeholder="Enter location address"
                                placeholderTextColor="#94a3b8"
                                style={tw`flex-1 text-slate-900 font-medium text-base`}
                            />
                        </View>
                    </View>

                    {/* Date & Time */}
                    <View style={tw`flex-row gap-4`}>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Date</Text>
                            <View style={tw`flex-row items-center bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="calendar" size={18} color="#06b6d4" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="DD/MM/YY"
                                    placeholderTextColor="#94a3b8"
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                />
                            </View>
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Time</Text>
                            <View style={tw`flex-row items-center bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4`}>
                                <Feather name="clock" size={18} color="#06b6d4" style={tw`mr-3`} />
                                <TextInput
                                    placeholder="HH:MM"
                                    placeholderTextColor="#94a3b8"
                                    style={tw`flex-1 text-slate-900 font-medium text-base`}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text style={tw`text-slate-700 font-bold mb-2 text-xs uppercase tracking-wide`}>Description</Text>
                        <View style={tw`bg-slate-50/50 rounded-2xl border border-slate-200 px-4 py-4`}>
                            <TextInput
                                placeholder="Describe the incident details..."
                                placeholderTextColor="#94a3b8"
                                multiline
                                numberOfLines={4}
                                style={tw`text-slate-900 font-medium h-24 text-base p-0`}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>

                {/* Submit Button - Fixed Visibility & Size */}
                <TouchableOpacity style={tw`shadow-xl shadow-indigo-500/40 active:scale-[0.98] transition-all`}>
                    <View style={tw`bg-indigo-600 p-5 rounded-[24px] flex-row items-center justify-center gap-3`}>
                        <Text style={tw`text-white font-bold text-lg tracking-wide`}>File Report</Text>
                        <Feather name="arrow-right" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
