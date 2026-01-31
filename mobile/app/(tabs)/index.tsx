import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useCases } from '../context/CaseContext';



export default function Dashboard() {
    const router = useRouter();
    const { cases } = useCases();
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const renderHeader = () => (
        <View style={tw`mb-2`}>
            {/* Integrated Header - Medium Size */}
            <View style={tw`mb-8 mt-2`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={tw`text-slate-500 text-[10px] font-bold uppercase tracking-widest`}>Station Command</Text>
                    <View style={tw`bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100`}>
                        <Text style={tw`text-indigo-600 text-[10px] font-bold`}>{date}</Text>
                    </View>
                </View>
                <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight`}>Nav Sahayak</Text>
            </View>

            {/* Stats Cards - Medium Tint */}
            <View style={tw`flex-row gap-4 mb-8`}>
                <View style={tw`flex-1 bg-blue-50/50 p-5 rounded-3xl border border-blue-100 shadow-sm justify-between h-36`}>
                    <View style={tw`bg-white w-10 h-10 rounded-2xl items-center justify-center shadow-sm`}>
                        <Feather name="briefcase" size={20} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={tw`text-slate-900 text-3xl font-bold mb-0.5 tracking-tight`}>12</Text>
                        <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wide`}>Active Cases</Text>
                    </View>
                </View>
                <View style={tw`flex-1 bg-amber-50/50 p-5 rounded-3xl border border-amber-100 shadow-sm justify-between h-36`}>
                    <View style={tw`bg-white w-10 h-10 rounded-2xl items-center justify-center shadow-sm`}>
                        <Feather name="clock" size={20} color="#f59e0b" />
                    </View>
                    <View>
                        <Text style={tw`text-slate-900 text-3xl font-bold mb-0.5 tracking-tight`}>5</Text>
                        <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wide`}>Pending Action</Text>
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
                        <Text style={tw`text-white text-xl font-bold leading-tight tracking-tight`}>Start Consult</Text>
                    </View>
                    <View style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20`}>
                        <Feather name="arrow-right" size={20} color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Recent Activity Header */}
            <View style={tw`flex-row items-center justify-between mb-4`}>
                <Text style={tw`text-slate-900 text-xl font-bold tracking-tight`}>Recent Filings</Text>
                <TouchableOpacity style={tw`bg-slate-100 px-3 py-1.5 rounded-full`}>
                    <Text style={tw`text-slate-600 text-xs font-bold`}>View All</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const renderItem = ({ item }: { item: typeof cases[0] }) => (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '/case/[id]', params: { id: item.id } })}
            style={tw`bg-white p-5 rounded-[24px] border border-slate-100 shadow-lg shadow-indigo-100/30 mb-4 active:scale-[0.99] transition-all`}
        >
            {/* Card Header: Case ID & Priority */}
            <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`bg-slate-50 px-3 py-1 rounded-full border border-slate-100`}>
                    <Text style={tw`text-slate-500 text-[10px] font-bold tracking-wider uppercase`}>Case #{item.id}</Text>
                </View>
                <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`px-2.5 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                        <Text style={tw`${getPriorityColor(item.priority).split(' ')[0]} text-[10px] font-bold uppercase tracking-wide`}>{item.priority}</Text>
                    </View>
                </View>
            </View>

            {/* Content: Title & Type */}
            <View style={tw`mb-4`}>
                <Text style={tw`text-slate-900 font-bold text-lg leading-tight tracking-tight mb-1`}>{item.title}</Text>
                <Text style={tw`text-slate-400 text-xs font-semibold uppercase tracking-wide`}>{item.type}</Text>
            </View>

            {/* Footer: Date & Status */}
            <View style={tw`flex-row items-center justify-between pt-3 border-t border-slate-50`}>
                <View style={tw`flex-row items-center gap-2`}>
                    <Feather name="calendar" size={14} color="#94a3b8" />
                    <Text style={tw`text-slate-500 text-xs font-medium`}>{item.date}</Text>
                </View>

                <View style={tw`flex-row items-center gap-1.5`}>
                    <Text style={tw`text-slate-600 text-xs font-bold`}>{item.status}</Text>
                    <Feather name="chevron-right" size={14} color="#cbd5e1" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={cases}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={tw`p-6 pb-10`}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
            />
        </SafeAreaView>
    );
}
