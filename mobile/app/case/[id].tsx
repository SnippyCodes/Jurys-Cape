import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useCases } from '../context/CaseContext';

export default function CaseDetails() {
    const { id } = useLocalSearchParams();
    const { getCaseById } = useCases();
    const router = useRouter();

    const caseData = getCaseById(Array.isArray(id) ? id[0] : id);

    if (!caseData) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white items-center justify-center`}>
                <Text style={tw`text-slate-500`}>Case parameters missing or not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={tw`mt-4 bg-slate-100 px-4 py-2 rounded-lg`}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            {/* Header */}
            <View style={tw`px-6 pt-2 pb-4 bg-white border-b border-slate-100 flex-row items-center gap-4 shadow-sm`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`w-10 h-10 rounded-full bg-slate-50 items-center justify-center border border-slate-100`}>
                    <Feather name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wider`}>Case #{caseData.id}</Text>
                    <Text numberOfLines={1} style={tw`text-slate-900 text-xl font-bold tracking-tight`}>{caseData.title}</Text>
                </View>
                <View style={tw`bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100`}>
                    <Text style={tw`text-indigo-700 text-xs font-bold uppercase`}>{caseData.status}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-10`}>

                {/* AI Executive Summary */}
                {caseData.aiAnalysis && (
                    <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-100 shadow-md shadow-indigo-100/50`}>
                        <View style={tw`flex-row items-center gap-3 mb-4`}>
                            <View style={tw`w-8 h-8 rounded-full bg-indigo-100 items-center justify-center`}>
                                <Feather name="cpu" size={16} color="#4f46e5" />
                            </View>
                            <Text style={tw`text-indigo-900 font-bold text-lg`}>AI Executive Summary</Text>
                        </View>
                        <Text style={tw`text-slate-700 text-base leading-relaxed`}>
                            {caseData.aiAnalysis.summary || "No summary available."}
                        </Text>
                    </View>
                )}

                {/* Case Facts */}
                {caseData.aiAnalysis && caseData.aiAnalysis.chronological_facts && (
                    <View style={tw`bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm`}>
                        <Text style={tw`text-slate-900 font-bold text-lg mb-4`}>Key Facts</Text>
                        {caseData.aiAnalysis.chronological_facts.map((fact: string, index: number) => (
                            <View key={index} style={tw`flex-row gap-3 mb-3`}>
                                <View style={tw`w-6 h-6 rounded-full bg-slate-100 items-center justify-center mt-0.5`}>
                                    <Text style={tw`text-slate-500 text-xs font-bold`}>{index + 1}</Text>
                                </View>
                                <Text style={tw`text-slate-600 flex-1 leading-snug`}>{fact}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* BNS Sections */}
                {caseData.aiAnalysis && caseData.aiAnalysis.potential_bns_sections && (
                    <View style={tw`bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm`}>
                        <Text style={tw`text-slate-900 font-bold text-lg mb-4`}>Potential Charges (BNS)</Text>
                        {caseData.aiAnalysis.potential_bns_sections.map((section: string, index: number) => (
                            <View key={index} style={tw`bg-rose-50 border border-rose-100 p-3 rounded-xl mb-2 flex-row items-center gap-3`}>
                                <Feather name="alert-circle" size={18} color="#e11d48" />
                                <Text style={tw`text-rose-900 font-bold tracking-tight`}>{section}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Original Description */}
                <View style={tw`bg-slate-100 p-6 rounded-[24px]`}>
                    <Text style={tw`text-slate-500 font-bold text-xs uppercase tracking-widest mb-2`}>Original Report</Text>
                    <Text style={tw`text-slate-600 italic`}>{caseData.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
