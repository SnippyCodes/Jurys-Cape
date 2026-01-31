import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import tw from 'twrnc';
import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const quickActions = [
    { label: 'Draft FIR', icon: 'file-text' },
    { label: 'Summarize', icon: 'align-left' },
    { label: 'BNS Codes', icon: 'book' },
    { label: 'Case Law', icon: 'search' },
];

interface Message {
    id: string;
    type: 'user' | 'ai';
    text: string;
    isResponse?: boolean;
}

export default function Chat() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', type: 'ai', text: 'Hello Officer. I am trained on the new BNS codes. How can I assist you today?' }
    ]);
    const flatListRef = useRef<FlatList>(null);

    const scrollToBottom = () => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        scrollToBottom();

        try {
            const responseText = await api.chatWithAI(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                text: responseText,
                isResponse: true
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                text: "I'm having trouble connecting to the server. Please check your connection."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        if (item.type === 'ai') {
            return (
                <View style={tw`flex-row gap-3 mb-6`}>
                    <View style={tw`w-8 h-8 rounded-full bg-slate-100 items-center justify-center border border-slate-200`}>
                        <Feather name="cpu" size={16} color="#64748b" />
                    </View>
                    <View style={tw`bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 max-w-[85%]`}>
                        {item.id === '1' && (
                            <Text style={tw`text-slate-700 text-sm leading-relaxed font-medium`}>
                                {item.text}
                            </Text>
                        )}

                        {item.id !== '1' && (
                            <Text style={tw`text-slate-700 text-sm leading-relaxed`}>{item.text}</Text>
                        )}

                        {item.id === '1' && (
                            <View style={tw`flex-row flex-wrap gap-2 mt-4`}>
                                {quickActions.map((action, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setInput(action.label + " ")}
                                        style={tw`px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 flex-row items-center gap-1.5`}
                                    >
                                        <Feather name={action.icon as any} size={12} color="#475569" />
                                        <Text style={tw`text-[10px] font-bold text-slate-600`}>{action.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
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
                {/* Header */}
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

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={tw`flex-1`}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={tw`p-5 pb-4`}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input Area */}
                    <View style={tw`px-4 pt-2 pb-2 bg-white border-t border-slate-100`}>
                        <View style={tw`flex-row items-center gap-3`}>
                            <TouchableOpacity style={tw`p-3 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100`}>
                                <Feather name="plus" size={20} color="#64748b" />
                            </TouchableOpacity>
                            <View style={tw`flex-1 bg-slate-50 rounded-xl border border-slate-200 flex-row items-center px-4`}>
                                <TextInput
                                    value={input}
                                    onChangeText={setInput}
                                    style={tw`flex-1 text-slate-900 py-3 text-base font-medium`}
                                    placeholder="Message AI..."
                                    placeholderTextColor="#94a3b8"
                                    onSubmitEditing={handleSend}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={loading}
                                style={tw`bg-indigo-600 w-11 h-11 rounded-xl items-center justify-center active:bg-indigo-700 shadow-lg shadow-indigo-200 ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Feather name="send" size={18} color="#fff" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
