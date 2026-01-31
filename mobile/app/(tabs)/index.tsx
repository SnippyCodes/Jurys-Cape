import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const cases = [
    { id: '402', title: 'State v. Sharma', type: 'Criminal Theft', priority: 'Critical', date: 'Today, 10:00 AM', status: 'Active' },
    { id: '399', title: 'Land Dispute: Patil Estimate', type: 'Civil Litigation', priority: 'Medium', date: 'Yesterday', status: 'Pending' },
    { id: '388', title: 'Traffic Violation #2991', type: 'Traffic', priority: 'Low', date: 'Jan 29', status: 'Review' },
    { id: '375', title: 'Cyber Fraud Investigation', type: 'Cyber Crime', priority: 'High', date: 'Jan 25', status: 'Active' },
    { id: '362', title: 'Noise Complaint: Metro', type: 'Civil', priority: 'Low', date: 'Jan 22', status: 'Closed' },
];

export default function Dashboard() {
    const router = useRouter();
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

    const renderItem = ({ item }: { item: typeof cases[0] }) => (
        <TouchableOpacity style={tw`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between active:scale-[0.99] transition-all mb-3`}>
            <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center gap-2 mb-1.5`}>
                    <View style={tw`bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200`}>
                        <Text style={tw`text-slate-500 text-[10px] font-bold`}>#{item.id}</Text>
                    </View>
                    <Text style={tw`text-slate-400 text-xs font-medium`}>{item.date}</Text>
                </View>
                <Text style={tw`text-slate-900 font-bold text-base mb-0.5 tracking-tight`}>{item.title}</Text>
                <Text style={tw`text-slate-500 text-xs font-medium`}>{item.type}</Text>
            </View>

            <View style={tw`items-end justify-center pl-4 border-l border-slate-50`}>
                <View style={tw`w-10 h-10 rounded-full items-center justify-center ${item.priority === 'Critical' ? 'bg-red-50 border border-red-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <Feather name="arrow-right" size={18} color={item.priority === 'Critical' ? '#ef4444' : '#94a3b8'} />
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
