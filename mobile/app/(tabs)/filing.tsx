import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { useState } from 'react';
import { api } from '../services/api';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Filing() {
    const router = useRouter();
    const { addCase } = useCases();
    const { t } = useLanguage();
    const { colors, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [complainant, setComplainant] = useState('');
    const [suspect, setSuspect] = useState('');
    const [incidentType, setIncidentType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    // Date/Time State
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false); // Always dismiss on Android
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
        }
    };

    const onChangeTime = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false); // Always dismiss on Android
        if (event.type === 'set' && selectedTime) {
            setTime(selectedTime);
        }
    };

    const resetForm = () => {
        setTitle('');
        setComplainant('');
        setSuspect('');
        setIncidentType('');
        setLocation('');
        setDescription('');
        setDate(new Date());
        setTime(new Date());
    };

    const handleFileReport = async () => {
        if (!title || !description) {
            Alert.alert('Missing Fields', 'Please provide at least a Case Title and Description.');
            return;
        }

        setLoading(true);

        try {
            // 1. Analyze with AI
            const analysis = await api.analyzeCase(description);

            // 2. Create Case Object
            const newCase: any = {
                id: Math.floor(Math.random() * 10000).toString(),
                title: title,
                type: incidentType || 'General',
                priority: 'High', // Defaulting to High for new reports
                date: date.toLocaleDateString(),
                status: 'Active',
                description: description,
                summary: analysis.summary,
                aiAnalysis: analysis
            };

            // 3. Add to Global State
            addCase(newCase);

            // 4. Reset Form
            resetForm();

            // 5. Show Success & Navigate
            Alert.alert('Success', 'Case filed and AI report generated.', [
                { text: 'OK' },
                { text: 'View Dashboard', onPress: () => router.push('/(tabs)') }
            ]);

        } catch (error) {
            Alert.alert('Error', 'Failed to generate AI report. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-10`}>

                {/* Integrated Header - Medium Size */}
                <View style={tw`mt-2 mb-2`}>
                    <Text style={tw`text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>Incident Reporting</Text>
                    <Text style={[tw`text-3xl font-extrabold tracking-tight`, { color: colors.text }]}>{t('fileCase')}</Text>
                </View>

                {/* Form Content - Medium Size */}
                <View style={[tw`p-6 rounded-[24px] border shadow-md gap-6`, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>

                    {/* Case Title */}
                    <View>
                        <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>{t('caseTitle')}</Text>
                        <View style={[tw`flex-row items-center rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                            <Feather name="file-text" size={20} color="#4f46e5" style={tw`mr-3`} />
                            <TextInput
                                placeholder={t('enterCaseTitle')}
                                placeholderTextColor={colors.textTertiary}
                                style={[tw`flex-1 font-bold text-base`, { color: colors.text }]}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                    </View>

                    {/* Parties - Side by Side (Fixed Layout) */}
                    <View style={tw`flex-row gap-4`}>
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>{t('complainant')}</Text>
                            <View style={[tw`flex-row items-center rounded-2xl border px-3 py-4`, { backgroundColor: isDarkMode ? '#1e1b4b' : '#eef2ff', borderColor: isDarkMode ? '#312e81' : '#c7d2fe' }]}>
                                <Feather name="user" size={18} color="#4338ca" style={tw`mr-2`} />
                                <TextInput
                                    placeholder={t('enterComplainant')}
                                    placeholderTextColor={colors.textTertiary}
                                    style={[tw`flex-1 font-medium text-sm`, { color: colors.text }]}
                                    value={complainant}
                                    onChangeText={setComplainant}
                                />
                            </View>
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>{t('accused')}</Text>
                            <View style={[tw`flex-row items-center rounded-2xl border px-3 py-4`, { backgroundColor: isDarkMode ? '#7f1d1d' : '#fff1f2', borderColor: isDarkMode ? '#991b1b' : '#fecaca' }]}>
                                <Feather name="user-x" size={18} color="#e11d48" style={tw`mr-2`} />
                                <TextInput
                                    placeholder={t('enterAccused')}
                                    placeholderTextColor={colors.textTertiary}
                                    style={[tw`flex-1 font-medium text-sm`, { color: colors.text }]}
                                    value={suspect}
                                    onChangeText={setSuspect}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Incident Type */}
                    <View>
                        <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>Incident Type</Text>
                        <View style={[tw`flex-row items-center rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                            <Feather name="alert-triangle" size={20} color="#6366f1" style={tw`mr-3`} />
                            <TextInput
                                placeholder="e.g. Theft, Assault, Cyber Crime"
                                placeholderTextColor={colors.textTertiary}
                                style={[tw`flex-1 font-medium text-base`, { color: colors.text }]}
                                value={incidentType}
                                onChangeText={setIncidentType}
                            />
                        </View>
                    </View>

                    {/* Location */}
                    <View>
                        <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>Location</Text>
                        <View style={[tw`flex-row items-center rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                            <Feather name="map-pin" size={20} color="#8b5cf6" style={tw`mr-3`} />
                            <TextInput
                                placeholder="Enter location address"
                                placeholderTextColor={colors.textTertiary}
                                style={[tw`flex-1 font-medium text-base`, { color: colors.text }]}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>

                    {/* Date & Time Picker */}
                    <View style={tw`flex-row gap-4`}>
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={[tw`flex-row items-center rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}
                            >
                                <Feather name="calendar" size={18} color="#06b6d4" style={tw`mr-3`} />
                                <Text style={[tw`flex-1 font-medium text-base`, { color: colors.text }]}>
                                    {date.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>Time</Text>
                            <TouchableOpacity
                                onPress={() => setShowTimePicker(true)}
                                style={[tw`flex-row items-center rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}
                            >
                                <Feather name="clock" size={18} color="#06b6d4" style={tw`mr-3`} />
                                <Text style={[tw`flex-1 font-medium text-base`, { color: colors.text }]}>
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    display="default"
                                    onChange={onChangeTime}
                                />
                            )}
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text style={[tw`font-bold mb-2 text-xs uppercase tracking-wide`, { color: colors.textSecondary }]}>Description</Text>
                        <View style={[tw`rounded-2xl border px-4 py-4`, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                            <TextInput
                                placeholder="Describe the incident details..."
                                placeholderTextColor={colors.textTertiary}
                                multiline
                                numberOfLines={4}
                                style={[tw`font-medium h-24 text-base p-0`, { color: colors.text }]}
                                textAlignVertical="top"
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                    </View>
                </View>

                {/* Submit Button - Fixed Visibility & Size */}
                <TouchableOpacity
                    onPress={handleFileReport}
                    disabled={loading}
                    style={tw`shadow-xl shadow-indigo-500/40 active:scale-[0.98] transition-all ${loading ? 'opacity-80' : ''}`}
                >
                    <View style={tw`bg-indigo-600 p-5 rounded-[24px] flex-row items-center justify-center gap-3`}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={tw`text-white font-bold text-lg tracking-wide`}>File Report</Text>
                                <Feather name="arrow-right" size={24} color="#fff" />
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
