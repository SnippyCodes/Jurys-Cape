import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useCases } from '../../context/CaseContext'; // Corrected path? No, wait.
// evidence/detail.tsx is in mobile/app/evidence/
// ../ is mobile/app/
// ../context/CaseContext is mobile/app/context/CaseContext
// So it should be '../context/CaseContext' like [id].tsx

import { useCases } from '../context/CaseContext';

export default function EvidenceDetail() {
    const { caseId, evidenceId } = useLocalSearchParams();
    const router = useRouter();
    const { getCaseById } = useCases();

    const caseData = getCaseById(Array.isArray(caseId) ? caseId[0] : caseId);
    const evidenceItem = caseData?.evidence.find((e: any) => e.id === (Array.isArray(evidenceId) ? evidenceId[0] : evidenceId));

    if (!caseData || !evidenceItem) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white items-center justify-center`}>
                <Text style={tw`text-slate-500`}>Evidence not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={tw`mt-4 bg-slate-100 px-4 py-2 rounded-lg`}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return 'image';
            case 'audio': return 'mic';
            case 'video': return 'video';
            default: return 'file-text';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'image': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'audio': return 'text-violet-600 bg-violet-50 border-violet-100';
            case 'video': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-amber-600 bg-amber-50 border-amber-100';
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            {/* Header */}
            <View style={tw`px-6 pt-2 pb-4 bg-white border-b border-slate-100 flex-row items-center gap-4 shadow-sm z-10`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`w-10 h-10 rounded-full bg-slate-50 items-center justify-center border border-slate-100`}>
                    <Feather name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wider`}>Forensic Report</Text>
                    <Text numberOfLines={1} style={tw`text-slate-900 text-xl font-bold tracking-tight`}>{evidenceItem.id}</Text>
                </View>
                <View style={tw`w-10 h-10 rounded-full items-center justify-center border ${getTypeColor(evidenceItem.type)}`}>
                    <Feather name={getTypeIcon(evidenceItem.type) as any} size={20} style={tw`${getTypeColor(evidenceItem.type).split(' ')[0]}`} />
                </View>
            </View>

            <ScrollView contentContainerStyle={tw`p-6 gap-6`}>
                {/* Media Preview Card */}
                <View style={tw`bg-white p-4 rounded-3xl border border-slate-200 shadow-sm items-center justify-center min-h-[200px]`}>
                    {evidenceItem.type === 'image' && evidenceItem.uri ? (
                        <Image source={{ uri: evidenceItem.uri }} style={tw`w-full h-64 rounded-2xl bg-slate-50`} resizeMode="contain" />
                    ) : (
                        <View style={tw`items-center justify-center opacity-50 gap-3`}>
                            <Feather name={getTypeIcon(evidenceItem.type) as any} size={48} color="#94a3b8" />
                            <Text style={tw`text-slate-400 font-bold`}>Preview Unavailable</Text>
                        </View>
                    )}
                    <Text style={tw`text-slate-900 font-bold text-lg mt-4 text-center`}>{evidenceItem.title}</Text>
                    <Text style={tw`text-slate-400 text-xs font-medium uppercase tracking-widest mt-1`}>{evidenceItem.date}</Text>
                </View>

                {/* AI Analysis Report */}
                <View style={tw`bg-white p-6 rounded-[24px] border border-indigo-100 shadow-lg shadow-indigo-100/50`}>
                    <View style={tw`flex-row items-center gap-3 mb-4`}>
                        <View style={tw`w-8 h-8 rounded-full bg-indigo-100 items-center justify-center`}>
                            <Feather name="activity" size={16} color="#4f46e5" />
                        </View>
                        <Text style={tw`text-indigo-900 font-bold text-lg`}>Forensic Analysis</Text>
                    </View>
                    <Text style={tw`text-slate-700 text-base leading-relaxed`}>
                        {evidenceItem.analysis || "Analysis pending or unavailable."}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
