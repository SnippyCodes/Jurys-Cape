import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';


export default function Dashboard() {
    const router = useRouter();
    const { cases, updateCaseStatus } = useCases();
    const { t } = useLanguage();
    const { colors, isDarkMode } = useTheme();
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    const statusOptions = [
        { value: 'Active', label: 'Active', icon: 'play-circle', color: '#3b82f6' },
        { value: 'Pending', label: 'Pending', icon: 'clock', color: '#f59e0b' },
        { value: 'Under Investigation', label: 'Under Investigation', icon: 'search', color: '#8b5cf6' },
        { value: 'Closed', label: 'Closed', icon: 'check-circle', color: '#10b981' },
    ];

    const handleStatusUpdate = (newStatus: string) => {
        if (selectedCase) {
            updateCaseStatus(selectedCase, newStatus);
            Alert.alert(t('statusUpdated'), `${t('caseMarkedAs')} ${newStatus}`);
        }
        setShowStatusMenu(false);
        setSelectedCase(null);
    };

    const activeCases = cases.filter(c => c.status !== 'Closed').length;
    const pendingCases = cases.filter(c => c.status === 'Pending').length;

    const renderHeader = () => (
        <View style={tw`mb-2`}>
            {/* Integrated Header - Medium Size */}
            <View style={tw`mb-8 mt-2`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={[tw`text-[10px] font-bold uppercase tracking-widest`, { color: colors.textSecondary }]}>{t('stationCommand')}</Text>
                    <View style={[tw`px-2.5 py-1 rounded-lg border`, { backgroundColor: isDarkMode ? colors.primaryLight : '#eef2ff', borderColor: isDarkMode ? '#4338ca' : '#c7d2fe' }]}>
                        <Text style={[tw`text-[10px] font-bold`, { color: isDarkMode ? '#a5b4fc' : '#4f46e5' }]}>{date}</Text>
                    </View>
                </View>
                <Text style={[tw`text-3xl font-extrabold tracking-tight`, { color: colors.text }]}>{t('navSahayak')}</Text>
            </View>

            {/* Stats Cards - Medium Tint */}
            <View style={tw`flex-row gap-4 mb-8`}>
                <View style={[tw`flex-1 p-5 rounded-3xl border shadow-sm justify-between h-36`, { backgroundColor: isDarkMode ? colors.cardBg : '#eff6ff', borderColor: isDarkMode ? colors.border : '#dbeafe' }]}>
                    <View style={[tw`w-10 h-10 rounded-2xl items-center justify-center shadow-sm`, { backgroundColor: isDarkMode ? '#1e3a8a' : '#ffffff' }]}>
                        <Feather name="briefcase" size={20} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={[tw`text-3xl font-bold mb-0.5 tracking-tight`, { color: colors.text }]}>{activeCases}</Text>
                        <Text style={[tw`text-xs font-bold uppercase tracking-wide`, { color: colors.textSecondary }]}>{t('activeCases')}</Text>
                    </View>
                </View>
                <View style={[tw`flex-1 p-5 rounded-3xl border shadow-sm justify-between h-36`, { backgroundColor: isDarkMode ? colors.cardBg : '#fffbeb', borderColor: isDarkMode ? colors.border : '#fef3c7' }]}>
                    <View style={[tw`w-10 h-10 rounded-2xl items-center justify-center shadow-sm`, { backgroundColor: isDarkMode ? '#78350f' : '#ffffff' }]}>
                        <Feather name="clock" size={20} color="#f59e0b" />
                    </View>
                    <View>
                        <Text style={[tw`text-3xl font-bold mb-0.5 tracking-tight`, { color: colors.text }]}>{pendingCases}</Text>
                        <Text style={[tw`text-xs font-bold uppercase tracking-wide`, { color: colors.textSecondary }]}>{t('pendingAction')}</Text>
                    </View>
                </View>
            </View>

            {/* AI Consult Action - Medium Gradient */}
            <TouchableOpacity
                onPress={() => router.push('/chat')}
                style={tw`bg-indigo-600 p-1 rounded-[26px] shadow-xl shadow-indigo-500/30 mb-8 active:scale-[0.98] transition-all`}
            >
                <View style={tw`bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 p-5 rounded-[22px] flex-row items-center gap-5 border border-white/10`}>
                    <View style={tw`bg-white/20 p-4 rounded-full backdrop-blur-xl border border-white/20 shadow-inner`}>
                        <Feather name="message-square" size={22} color="#fff" />
                    </View>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-indigo-100 font-bold text-xs uppercase tracking-widest mb-0.5`}>AI Legal Assistant</Text>
                        <Text style={tw`text-white text-xl font-bold leading-tight tracking-tight`}>{t('startConsult')}</Text>
                    </View>
                    <View style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20`}>
                        <Feather name="arrow-right" size={20} color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Recent Activity Header */}
            <View style={tw`flex-row items-center justify-between mb-4`}>
                <Text style={[tw`text-xl font-bold tracking-tight`, { color: colors.text }]}>Recent Filings</Text>
                <TouchableOpacity style={[tw`px-3 py-1.5 rounded-full`, { backgroundColor: isDarkMode ? colors.surfaceAlt : '#f1f5f9' }]}>
                    <Text style={[tw`text-xs font-bold`, { color: colors.textSecondary }]}>View All</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const getPriorityColor = (priority: string) => {
        if (isDarkMode) {
            switch (priority) {
                case 'Critical': return { text: '#fca5a5', bg: '#7f1d1d', border: '#991b1b' };
                case 'High': return { text: '#fdba74', bg: '#7c2d12', border: '#9a3412' };
                case 'Medium': return { text: '#fcd34d', bg: '#78350f', border: '#92400e' };
                default: return { text: '#a3a3a3', bg: '#171717', border: '#262626' };
            }
        } else {
            switch (priority) {
                case 'Critical': return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
                case 'High': return { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
                case 'Medium': return { text: '#d97706', bg: '#fffbeb', border: '#fef3c7' };
                default: return { text: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
            }
        }
    };

    const renderItem = ({ item }: { item: typeof cases[0] }) => {
        const priorityColors = getPriorityColor(item.priority);

        return (
            <TouchableOpacity
                onPress={() => router.push({ pathname: '/case/[id]', params: { id: item.id } })}
                onLongPress={() => {
                    setSelectedCase(item.id);
                    setShowStatusMenu(true);
                }}
                style={[tw`p-5 rounded-[24px] border shadow-lg mb-4 active:scale-[0.99] transition-all`, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            >
                {/* Card Header: Case ID & Priority */}
                <View style={tw`flex-row justify-between items-start mb-3`}>
                    <View style={[tw`px-3 py-1 rounded-full border`, { backgroundColor: isDarkMode ? colors.surfaceAlt : '#f8fafc', borderColor: colors.border }]}>
                        <Text style={[tw`text-[10px] font-bold tracking-wider uppercase`, { color: colors.textSecondary }]}>Case #{item.id}</Text>
                    </View>
                    <View style={tw`flex-row items-center gap-2`}>
                        <View style={[tw`px-2.5 py-0.5 rounded-full border`, { backgroundColor: priorityColors.bg, borderColor: priorityColors.border }]}>
                            <Text style={[tw`text-[10px] font-bold uppercase tracking-wide`, { color: priorityColors.text }]}>{item.priority}</Text>
                        </View>
                        <Feather name="more-vertical" size={18} color={colors.textTertiary} />
                    </View>
                </View>

                {/* Case Title */}
                <Text style={[tw`text-lg font-bold mb-2 leading-tight tracking-tight`, { color: colors.text }]}>{item.title}</Text>

                {/* Meta Info Row */}
                <View style={tw`flex-row flex-wrap items-center gap-4 mb-3`}>
                    <View style={tw`flex-row items-center gap-1.5`}>
                        <Feather name="calendar" size={14} color={colors.textTertiary} />
                        <Text style={[tw`text-xs font-bold`, { color: colors.textSecondary }]}>{item.date}</Text>
                    </View>
                    <View style={tw`flex-row items-center gap-1.5`}>
                        <Feather name="folder" size={14} color={colors.textTertiary} />
                        <Text style={[tw`text-xs font-bold`, { color: colors.textSecondary }]}>{item.type}</Text>
                    </View>
                </View>

                {/* Description Preview */}
                <Text style={[tw`leading-relaxed mb-4`, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Footer: Status Badge & Action */}
                <View style={[tw`flex-row items-center justify-between pt-4 border-t`, { borderColor: colors.border }]}>
                    <View style={[tw`px-3 py-1.5 rounded-full border`, { backgroundColor: isDarkMode ? colors.primaryLight : '#eef2ff', borderColor: isDarkMode ? '#4338ca' : '#c7d2fe' }]}>
                        <Text style={[tw`text-xs font-bold`, { color: isDarkMode ? '#a5b4fc' : '#4f46e5' }]}>{item.status}</Text>
                    </View>
                    <View style={tw`flex-row items-center gap-1.5`}>
                        <Text style={[tw`text-xs font-bold uppercase tracking-wide`, { color: colors.textTertiary }]}>{t('viewCase')}</Text>
                        <Feather name="arrow-right" size={16} color={colors.textTertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={tw`items-center justify-center py-20`}>
            <View style={[tw`w-20 h-20 rounded-full items-center justify-center mb-4`, { backgroundColor: isDarkMode ? colors.surfaceAlt : '#f1f5f9' }]}>
                <Feather name="inbox" size={40} color={colors.textTertiary} />
            </View>
            <Text style={[tw`text-lg font-bold mb-1`, { color: colors.text }]}>{t('noCases')}</Text>
            <Text style={[tw`text-center px-10`, { color: colors.textSecondary }]}>{t('noCasesDesc')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <FlatList
                data={cases}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={tw`px-6 pt-6 pb-10`}
                showsVerticalScrollIndicator={false}
            />

            {/* Status Update Modal */}
            <Modal
                visible={showStatusMenu}
                transparent
                animationType="slide"
                onRequestClose={() => setShowStatusMenu(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={[tw`rounded-t-3xl p-6`, { backgroundColor: colors.surface }]}>
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={[tw`text-2xl font-bold`, { color: colors.text }]}>Update Status</Text>
                            <TouchableOpacity onPress={() => setShowStatusMenu(false)}>
                                <Feather name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {statusOptions.map((status) => (
                            <TouchableOpacity
                                key={status.value}
                                onPress={() => handleStatusUpdate(status.value)}
                                style={[tw`flex-row items-center gap-4 p-4 rounded-2xl mb-2`, { backgroundColor: isDarkMode ? colors.cardBg : '#f8fafc' }]}
                            >
                                <View style={[tw`w-12 h-12 rounded-full items-center justify-center`, { backgroundColor: `${status.color}15` }]}>
                                    <Feather name={status.icon as any} size={22} color={status.color} />
                                </View>
                                <Text style={[tw`flex-1 font-bold text-base`, { color: colors.text }]}>{status.label}</Text>
                                <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
