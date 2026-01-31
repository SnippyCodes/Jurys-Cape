import { View, Text, Switch, TouchableOpacity, ScrollView, SafeAreaView, Alert, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import tw from 'twrnc';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../i18n/translations';

export default function Settings() {
    const router = useRouter();
    const { logout, devMode, user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            t('logout'),
            t('logoutConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logout'),
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const languages = [
        { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
        { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr' as Language, name: 'मराठी', flag: '🇮🇳' },
    ];

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={tw`p-6 gap-6 pb-10`}>

                {/* Header */}
                <View style={tw`mt-2`}>
                    <Text style={tw`text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5`}>{t('preferences')}</Text>
                    <Text style={[tw`text-3xl font-extrabold tracking-tight`, { color: colors.text }]}>{t('settings')}</Text>
                </View>

                {/* Dev Mode Indicator */}
                {devMode && (
                    <View style={tw`bg-amber-50 p-4 rounded-2xl border border-amber-200 flex-row items-center gap-3`}>
                        <Feather name="zap" size={20} color="#f59e0b" />
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-amber-900 font-bold`}>{t('devMode')}</Text>
                            <Text style={tw`text-amber-600 text-xs`}>{t('devModeDesc')}</Text>
                        </View>
                    </View>
                )}

                {/* Profile Card */}
                <View style={tw`bg-white p-5 rounded-[24px] border border-indigo-50 shadow-md shadow-indigo-100/50 flex-row items-center gap-4`}>
                    <View style={tw`w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full items-center justify-center shadow-md shadow-indigo-300 border-4 border-indigo-50`}>
                        <Text style={tw`text-white font-bold text-xl`}>{user?.name.charAt(0).toUpperCase() || 'K'}</Text>
                    </View>
                    <View>
                        <Text style={tw`text-slate-900 text-xl font-bold tracking-tight`}>{user?.name || 'Krushna'}</Text>
                        <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wider mb-2`}>ID: {user?.id || '8829-AZ'}</Text>
                        <View style={tw`bg-indigo-50 self-start px-2.5 py-1 rounded-full border border-indigo-100`}>
                            <Text style={tw`text-indigo-700 text-[10px] font-bold uppercase`}>Senior Inspector</Text>
                        </View>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={tw`rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white`}>
                    {/* Dark Mode */}
                    <View style={tw`flex-row items-center justify-between p-5 bg-white`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-purple-50 p-3 rounded-2xl`}>
                                <Feather name="moon" size={20} color="#7c3aed" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>{t('darkMode')}</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    {/* Notifications */}
                    <View style={tw`flex-row items-center justify-between p-5 bg-white`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-amber-50 p-3 rounded-2xl`}>
                                <Feather name="bell" size={20} color="#d97706" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>{t('notifications')}</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    {/* Language */}
                    <TouchableOpacity
                        onPress={() => setShowLanguagePicker(true)}
                        style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}
                    >
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-cyan-50 p-3 rounded-2xl`}>
                                <Feather name="globe" size={20} color="#0891b2" />
                            </View>
                            <View>
                                <Text style={tw`text-slate-900 font-bold text-base`}>{t('language')}</Text>
                                <Text style={tw`text-slate-500 text-xs`}>{languages.find(l => l.code === language)?.name}</Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                {/* Privacy & Security Section */}
                <View style={tw`rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white`}>
                    <TouchableOpacity
                        onPress={() => setShowPrivacyModal(true)}
                        style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}
                    >
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-blue-50 p-3 rounded-2xl`}>
                                <Feather name="shield" size={20} color="#2563eb" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>{t('privacySecurity')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>

                    <View style={tw`h-[1px] bg-slate-50 mx-20`} />

                    <TouchableOpacity style={tw`flex-row items-center justify-between p-5 bg-white active:bg-slate-50`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={tw`bg-emerald-50 p-3 rounded-2xl`}>
                                <Feather name="file-text" size={20} color="#059669" />
                            </View>
                            <Text style={tw`text-slate-900 font-bold text-base`}>{t('regulations')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    style={tw`mt-4 bg-red-50 border border-red-100 p-5 rounded-3xl flex-row items-center justify-center gap-3 active:bg-red-100`}
                >
                    <Feather name="log-out" size={20} color="#ef4444" />
                    <Text style={tw`text-red-600 font-bold text-base`}>{t('logout')}</Text>
                </TouchableOpacity>

                <Text style={tw`text-slate-400 text-center text-xs mt-4 font-bold tracking-wide uppercase`}>App Version 1.0.9 (i18n)</Text>
            </ScrollView>

            {/* Language Picker Modal */}
            <Modal
                visible={showLanguagePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowLanguagePicker(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={tw`bg-white rounded-t-3xl p-6`}>
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={tw`text-slate-900 text-2xl font-bold`}>{t('selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                                <Feather name="x" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                onPress={() => {
                                    setLanguage(lang.code);
                                    setShowLanguagePicker(false);
                                }}
                                style={tw`flex-row items-center justify-between p-4 rounded-2xl mb-2 ${language === lang.code ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-slate-50'}`}
                            >
                                <View style={tw`flex-row items-center gap-3`}>
                                    <Text style={tw`text-3xl`}>{lang.flag}</Text>
                                    <Text style={tw`text-slate-900 font-bold text-lg`}>{lang.name}</Text>
                                </View>
                                {language === lang.code && (
                                    <Feather name="check-circle" size={24} color="#4f46e5" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Privacy & Security Modal */}
            <Modal
                visible={showPrivacyModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPrivacyModal(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={tw`bg-white rounded-t-3xl p-6 max-h-[80%]`}>
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={tw`text-slate-900 text-2xl font-bold`}>{t('privacySecurity')}</Text>
                            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                                <Feather name="x" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Privacy Policy */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={tw`bg-blue-50 p-2 rounded-xl`}>
                                        <Feather name="lock" size={20} color="#2563eb" />
                                    </View>
                                    <Text style={tw`text-slate-900 font-bold text-lg`}>{t('privacyPolicy')}</Text>
                                </View>
                                <Text style={tw`text-slate-600 leading-relaxed`}>
                                    Nav Sahayak is committed to protecting your privacy. All case data is encrypted and stored securely. We do not share your information with third parties without consent.
                                </Text>
                            </View>

                            {/* Data Protection */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={tw`bg-emerald-50 p-2 rounded-xl`}>
                                        <Feather name="database" size={20} color="#059669" />
                                    </View>
                                    <Text style={tw`text-slate-900 font-bold text-lg`}>{t('dataProtection')}</Text>
                                </View>
                                <Text style={tw`text-slate-600 leading-relaxed`}>
                                    Compliant with Digital Personal Data Protection Act (DPDP), 2023. Your data is processed lawfully and stored within India.
                                </Text>
                            </View>

                            {/* Legal Compliance */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={tw`bg-amber-50 p-2 rounded-xl`}>
                                        <Feather name="file-text" size={20} color="#d97706" />
                                    </View>
                                    <Text style={tw`text-slate-900 font-bold text-lg`}>{t('legalCompliance')}</Text>
                                </View>
                                <Text style={tw`text-slate-600 leading-relaxed`}>
                                    Nav Sahayak operates in accordance with Indian legal framework including IT Act, 2000 and Evidence Act, 1872. All AI-generated content is advisory only.
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
