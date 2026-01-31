import { View, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import tw from 'twrnc';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { api } from '../services/api';

interface EvidenceItem {
    id: string;
    type: 'image' | 'video' | 'audio' | 'file';
    title: string;
    date: string;
    status: 'Analyzed' | 'Processing' | 'Pending' | 'Failed';
    uri?: string;
    analysis?: string;
}

export default function Evidence() {
    const [uploading, setUploading] = useState(false);
    const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
        { id: 'EVD-101', type: 'image', title: 'Crime Scene Photo A', date: '10:30 AM', status: 'Analyzed', analysis: 'Identified blunt force trauma markings.' },
        { id: 'EVD-102', type: 'audio', title: 'Witness Statement', date: 'Yesterday', status: 'Processing' },
    ]);

    const pickMedia = async (mediaType: 'image' | 'video') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false, // Videos don't support editing in some versions
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                await handleAnalyze(asset.uri, mediaType);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick media.');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });

            if (!result.canceled) {
                await handleAnalyze(result.assets[0].uri, 'doc'); // 'doc' maps to 'pdf' logic in api
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document.');
        }
    };

    const handleAnalyze = async (uri: string, type: 'image' | 'video' | 'doc') => {
        setUploading(true);
        const tempId = `EVD-${Math.floor(Math.random() * 1000)}`;

        // Add optimistic item
        const newItem: EvidenceItem = {
            id: tempId,
            type: type === 'doc' ? 'file' : type as any,
            title: `New Upload (${type})`,
            date: 'Just now',
            status: 'Processing',
            uri: uri
        };
        setEvidenceItems(prev => [newItem, ...prev]);

        try {
            const result = await api.analyzeMedia(uri, type);

            // Update item with result
            setEvidenceItems(prev => prev.map(item =>
                item.id === tempId ? {
                    ...item,
                    status: 'Analyzed',
                    title: 'Analyzed Evidence',
                    analysis: typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis)
                } : item
            ));

            Alert.alert('Analysis Complete', 'Evidence processed successfully.');

        } catch (error) {
            console.error(error);
            setEvidenceItems(prev => prev.map(item =>
                item.id === tempId ? { ...item, status: 'Failed' } : item
            ));
            Alert.alert('Upload Failed', 'Could not analyze evidence.');
        } finally {
            setUploading(false);
        }
    };

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

            {/* Upload Options */}
            <View style={tw`flex-row gap-4 mb-8`}>
                <TouchableOpacity
                    onPress={() => pickMedia('image')}
                    disabled={uploading}
                    style={tw`flex-1 bg-blue-50/50 border border-blue-100 rounded-[24px] p-6 items-center justify-center active:scale-[0.98] ${uploading ? 'opacity-50' : ''}`}
                >
                    <Feather name="image" size={24} color="#2563eb" style={tw`mb-2`} />
                    <Text style={tw`text-blue-700 font-bold text-xs uppercase tracking-wide`}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => pickDocument()}
                    disabled={uploading}
                    style={tw`flex-1 bg-amber-50/50 border border-amber-100 rounded-[24px] p-6 items-center justify-center active:scale-[0.98] ${uploading ? 'opacity-50' : ''}`}
                >
                    <Feather name="file-text" size={24} color="#d97706" style={tw`mb-2`} />
                    <Text style={tw`text-amber-700 font-bold text-xs uppercase tracking-wide`}>Document</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => pickMedia('video')}
                    disabled={uploading}
                    style={tw`flex-1 bg-rose-50/50 border border-rose-100 rounded-[24px] p-6 items-center justify-center active:scale-[0.98] ${uploading ? 'opacity-50' : ''}`}
                >
                    <Feather name="video" size={24} color="#e11d48" style={tw`mb-2`} />
                    <Text style={tw`text-rose-700 font-bold text-xs uppercase tracking-wide`}>Video</Text>
                </TouchableOpacity>
            </View>

            {uploading && (
                <View style={tw`bg-slate-900 p-4 rounded-xl mb-6 flex-row items-center gap-3 shadow-xl`}>
                    <ActivityIndicator color="#fff" />
                    <Text style={tw`text-white font-bold`}>Analyzing in Legal Lab...</Text>
                </View>
            )}

            <Text style={tw`text-slate-900 text-lg font-bold mb-4 tracking-tight`}>Analysis Reports</Text>
        </View>
    );

    const renderItem = ({ item }: { item: EvidenceItem }) => (
        <TouchableOpacity
            onPress={() => item.analysis && Alert.alert('Forensic Analysis', item.analysis)}
            style={tw`bg-white p-4.5 rounded-3xl border border-slate-100 shadow-sm mb-3.5 active:scale-[0.99] transition-all`}
        >
            <View style={tw`flex-row items-center gap-4`}>
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

                <View style={tw`w-3 h-3 rounded-full ${item.status === 'Analyzed' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : (item.status === 'Processing' ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500')}`} />
            </View>

            {/* Analysis Snippet */}
            {item.analysis && (
                <View style={tw`mt-3 pt-3 border-t border-slate-50`}>
                    <Text style={tw`text-slate-500 text-xs leading-relaxed`} numberOfLines={2}>
                        <Text style={tw`font-bold text-slate-700`}>AI Finding: </Text>
                        {item.analysis}
                    </Text>
                </View>
            )}
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
            />
        </SafeAreaView>
    );
}
