import { View, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import tw from 'twrnc';

const evidenceItems = [
    { id: 'EVD-101', type: 'image', title: 'Crime Scene Photo A', date: '10:30 AM', status: 'Analyzed' },
    { id: 'EVD-102', type: 'audio', title: 'Witness Statement', date: 'Yesterday', status: 'Processing' },
    { id: 'EVD-103', type: 'file', title: 'Forensic Report', date: 'Jan 28', status: 'Pending' },
    { id: 'EVD-104', type: 'image', title: 'Suspect Lineup', date: 'Jan 28', status: 'Analyzed' },
    { id: 'EVD-105', type: 'video', title: 'CCTV Footage Main St', date: 'Jan 27', status: 'Failed' },
    { id: 'EVD-106', type: 'file', title: 'Lab Results: DNA', date: 'Jan 26', status: 'Analyzed' },
];

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

export default function Evidence() {

    const renderHeader = () => (
        <View style={tw`mb-2`}>
            {/* Integrated Header - Medium */}
            <View style={tw`mb-8 mt-2 flex-row justify-between items-end`}>
                <View>
                    <Text style={tw`text-cyan-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>Forensic Lab</Text>
                    <Text style={tw`text-slate-900 text-3xl font-extrabold tracking-tight`}>Evidence</Text>
                </View>
                <TouchableOpacity style={tw`w-12 h-12 rounded-full items-center justify-center bg-white border border-slate-100 shadow-sm`}>
                    <Feather name="filter" size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* Upload Action - Medium */}
            <TouchableOpacity style={tw`bg-cyan-50/30 border-2 border-dashed border-cyan-200 rounded-[28px] p-7 items-center justify-center mb-8 active:scale-[0.99] transition-all`}>
                <View style={tw`bg-white p-4 rounded-2xl mb-3 shadow-sm border border-cyan-100`}>
                    <Feather name="upload-cloud" size={28} color="#0891b2" />
                </View>
                <Text style={tw`text-cyan-800 font-bold uppercase tracking-widest text-xs`}>Upload Secure Evidence</Text>
            </TouchableOpacity>

            {/* Filter Tabs - Medium */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3 mb-6 pr-6`}>
                <TouchableOpacity style={tw`bg-cyan-600 px-5 py-2.5 rounded-full shadow-lg shadow-cyan-200`}>
                    <Text style={tw`text-white font-bold text-xs tracking-wide`}>All Files</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm`}>
                    <Text style={tw`text-slate-600 font-bold text-xs tracking-wide`}>Photos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm`}>
                    <Text style={tw`text-slate-600 font-bold text-xs tracking-wide`}>Audio</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    const renderItem = ({ item }: { item: typeof evidenceItems[0] }) => (
        <TouchableOpacity style={tw`bg-white p-4.5 rounded-3xl border border-slate-100 shadow-sm flex-row items-center gap-4 mb-3.5 active:scale-[0.99] transition-all`}>
            {/* Medium Icon Box */}
            <View style={tw`w-12 h-12 rounded-2xl items-center justify-center border ${getTypeColor(item.type)}`}>
                <Feather name={getTypeIcon(item.type) as any} size={20} style={tw`${getTypeColor(item.type).split(' ')[0]}`} />
            </View>

            <View style={tw`flex-1`}>
                <Text style={tw`text-slate-900 font-bold text-base mb-0.5 tracking-tight`}>{item.title}</Text>
                <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100`}>
                        <Text style={tw`text-slate-500 text-[10px] font-bold uppercase tracking-wide`}>{item.id}</Text>
                    </View>
                    <Text style={tw`text-slate-400 text-xs font-medium`}>{item.date}</Text>
                </View>
            </View>

            {/* Status Indicator */}
            <View style={tw`w-3 h-3 rounded-full ${item.status === 'Analyzed' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-amber-500 shadow-lg shadow-amber-200'}`} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Stack.Screen options={{ headerShown: false }} />
            <FlatList
                data={evidenceItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={tw`p-6 pb-10`}
                showsVerticalScrollIndicator={false}
                initialNumToRender={6}
            />
        </SafeAreaView>
    );
}
