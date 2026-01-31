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

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-20`}>

                {caseData.aiAnalysis ? (
                    <>
                        {/* Summary Card */}
                        <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-100 shadow-md shadow-indigo-100/50`}>
                            <View style={tw`flex-row items-center gap-3 mb-4`}>
                                <View style={tw`w-10 h-10 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100`}>
                                    <Feather name="cpu" size={20} color="#4f46e5" />
                                </View>
                                <Text style={tw`text-indigo-950 font-bold text-xl`}>AI Summary</Text>
                            </View>
                            <Text style={tw`text-slate-600 text-base leading-relaxed`}>
                                {caseData.aiAnalysis.summary || "No summary available."}
                            </Text>
                        </View>

                        {/* Charges Grid */}
                        {caseData.aiAnalysis.potential_bns_sections && (
                            <View>
                                <Text style={tw`text-slate-900 font-bold text-lg mb-4 ml-1`}>Potential Charges</Text>
                                <View style={tw`flex-row flex-wrap gap-3`}>
                                    {caseData.aiAnalysis.potential_bns_sections.map((section: string, index: number) => (
                                        <View key={index} style={tw`bg-rose-50 border border-rose-100 px-4 py-3 rounded-2xl flex-row items-center gap-2`}>
                                            <Feather name="alert-triangle" size={16} color="#e11d48" />
                                            <Text style={tw`text-rose-900 font-bold text-sm`}>{section}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Timeline */}
                        {caseData.aiAnalysis.chronological_facts && (
                            <View style={tw`bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm`}>
                                <Text style={tw`text-slate-900 font-bold text-lg mb-6`}>Chronology</Text>
                                <View style={tw`gap-6 pl-2 border-l-2 border-slate-100 ml-2`}>
                                    {caseData.aiAnalysis.chronological_facts.map((fact: string, index: number) => (
                                        <View key={index} style={tw`pl-4 relative`}>
                                            {/* Dot */}
                                            <View style={tw`absolute -left-[13px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500`} />
                                            <Text style={tw`text-slate-600 leading-snug text-base`}>{fact}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={tw`bg-white p-8 rounded-[24px] items-center justify-center border border-slate-100 dashed border-2`}>
                        <Feather name="loader" size={32} color="#94a3b8" style={tw`mb-4 animate-spin`} />
                        <Text style={tw`text-slate-400 font-bold`}>Waiting for AI Analysis...</Text>
                    </View>
                )}

                {/* Original Description Accordion */}
                <View style={tw`bg-slate-50 p-6 rounded-[24px] border border-slate-100`}>
                    <Text style={tw`text-slate-400 font-bold text-xs uppercase tracking-widest mb-3`}>Raw Case File</Text>
                    <Text style={tw`text-slate-600 italic leading-relaxed`}>{caseData.description}</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
