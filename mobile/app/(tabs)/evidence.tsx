import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import tw from 'twrnc';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Evidence() {
    const router = useRouter();
    const { cases } = useCases();
    const { t } = useLanguage();
    const { colors } = useTheme();

    const activeCases = cases.filter(c => c.status !== 'Closed');

    const renderHeader = () => (
        <View style={tw`mb-2`}>
            {/* Integrated Header - Medium */}
            <View style={tw`mb-8 mt-2 flex-row justify-between items-end`}>
                <View>
                    <Text style={tw`text-cyan-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>Forensic Lab</Text>
                    <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight`}>{t('evidence')}</Text>
                </View>
                <View style={tw`bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100`}>
                    <Text style={tw`text-cyan-700 text-xs font-bold`}>{activeCases.length} Open Cases</Text>
                </View>
            </View>

            <Text style={tw`text-slate-500 font-bold text-xs uppercase tracking-widest mb-4`}>{t('selectCase')}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: typeof cases[0] }) => (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '/evidence/[id]', params: { id: item.id } })}
            style={tw`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-3.5 active:scale-[0.99] transition-all`}
        >
            <View style={tw`flex-row justify-between items-start mb-2`}>
                <View>
                    <Text style={tw`text-slate-900 font-bold text-lg tracking-tight mb-1`}>{item.title}</Text>
                    <Text style={tw`text-slate-400 text-xs font-medium uppercase tracking-wide`}>Case #{item.id}</Text>
                </View>
                <View style={tw`bg-slate-50 w-10 h-10 rounded-full items-center justify-center border border-slate-100`}>
                    <Feather name="folder" size={18} color="#64748b" />
                </View>
            </View>

            <View style={tw`flex-row items-center gap-4 mt-2 pt-3 border-t border-slate-50`}>
                <View style={tw`flex-row items-center gap-1.5`}>
                    <Feather name="file-text" size={14} color="#94a3b8" />
                    <Text style={tw`text-slate-500 text-xs font-bold`}>{item.evidence ? item.evidence.length : 0} Files</Text>
                </View>
                <View style={tw`flex-row items-center gap-1.5`}>
                    <Feather name="clock" size={14} color="#94a3b8" />
                    <Text style={tw`text-slate-500 text-xs font-medium`}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <FlatList
                data={activeCases}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={tw`p-6 pb-10`}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={tw`items-center justify-center py-10`}>
                        <Feather name="folder" size={48} color="#cbd5e1" />
                        <Text style={tw`text-slate-400 font-bold mt-4`}>No Active Cases</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
