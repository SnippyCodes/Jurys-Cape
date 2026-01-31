import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import tw from 'twrnc';

const quickActions = [
    { label: 'Draft FIR', icon: 'file-text' },
    { label: 'Summarize', icon: 'align-left' },
    { label: 'BNS Codes', icon: 'book' },
    { label: 'Case Law', icon: 'search' },
];

const messages = [
    { id: '1', type: 'ai', text: 'Hello Officer. I am trained on the new BNS codes. How can I assist you today?' },
    { id: '2', type: 'user', text: 'What is the punishment for theft under Section 303 of BNS?' },
    { id: '3', type: 'ai', text: 'Punishable with imprisonment up to 3 years, or fine, or both. For repeat offenders, severity increases specifically under subsection (2).', isResponse: true },
];

export default function Chat() {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof messages[0] }) => {
        if (item.type === 'ai') {
            return (
                <View style={tw`flex-row gap-3 mb-6`}>
                    <View style={tw`w-8 h-8 rounded-full bg-slate-100 items-center justify-center border border-slate-200`}>
                        <Feather name="cpu" size={16} color="#64748b" />
                    </View>
                    <View style={tw`bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 max-w-[85%]`}>
                        {item.id === '1' && (
                            <>
                                <Text style={tw`text-slate-700 text-sm leading-relaxed font-medium`}>
                                    Hello Officer. I am ready to assist.
                                </Text>
                                {/* Uniform Quick Actions */}
                                <View style={tw`flex-row flex-wrap gap-2 mt-4`}>
                                    {quickActions.map((action, index) => (
                                        <TouchableOpacity key={index} style={tw`px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 flex-row items-center gap-1.5`}>
                                            <Feather name={action.icon as any} size={12} color="#475569" />
                                            <Text style={tw`text-[10px] font-bold text-slate-600`}>{action.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                        {item.isResponse && (
                            <>
                                <Text style={tw`text-slate-900 font-bold mb-1`}>Section 303 BNS (Theft)</Text>
                                <Text style={tw`text-slate-600 text-sm leading-relaxed`}>
                                    Punishable with imprisonment up to <Text style={tw`font-bold text-slate-900`}>3 years</Text>, or fine, or both.
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={tw`flex-row gap-3 self-end flex-row-reverse mb-6`}>
                    <View style={tw`bg-indigo-600 p-4 rounded-2xl rounded-tr-none px-5 max-w-[85%]`}>
                        <Text style={tw`text-white font-medium text-sm`}>{item.text}</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={tw`flex-1 bg-slate-50`}>
                {/* Header - Refined & Spaced */}
                <View style={tw`px-5 pt-0 pb-3 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-sm z-10`}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`w-9 h-9 rounded-full bg-slate-50 items-center justify-center border border-slate-100 active:bg-slate-100`}>
                            <Feather name="arrow-left" size={18} color="#0f172a" />
                        </TouchableOpacity>
                        <View>
                            <Text style={tw`text-slate-900 text-2xl font-bold tracking-tight`}>Consult</Text>
                            <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wide`}>AI Legal Assistant</Text>
                        </View>
                    </View>
                    <View style={tw`bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex-row items-center gap-1.5`}>
                        <View style={tw`w-1.5 h-1.5 bg-emerald-500 rounded-full`} />
                        <Text style={tw`text-emerald-700 text-[10px] font-bold uppercase`}>Online</Text>
                    </View>
                </View>

                {/* Chat Content */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={tw`flex-1`}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={tw`p-5 pb-4`}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input Area - Compact & Removed Extra Padding */}
                    <View style={tw`px-4 pt-2 pb-2 bg-white border-t border-slate-100`}>
                        <View style={tw`flex-row items-center gap-3`}>
                            <TouchableOpacity style={tw`p-3 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100`}>
                                <Feather name="plus" size={20} color="#64748b" />
                            </TouchableOpacity>
                            <View style={tw`flex-1 bg-slate-50 rounded-xl border border-slate-200 flex-row items-center px-4`}>
                                <TextInput
                                    style={tw`flex-1 text-slate-900 py-3 text-base font-medium`}
                                    placeholder="Message AI..."
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <TouchableOpacity style={tw`bg-indigo-600 w-11 h-11 rounded-xl items-center justify-center active:bg-indigo-700 shadow-lg shadow-indigo-200`}>
                                <Feather name="send" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
