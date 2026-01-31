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
                    <View style={[tw`p-4 rounded-2xl border flex-row items-center gap-3`, { backgroundColor: isDarkMode ? colors.primaryLight : '#fffbeb', borderColor: isDarkMode ? '#92400e' : '#fde68a' }]}>
                        <Feather name="zap" size={20} color="#f59e0b" />
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold`, { color: isDarkMode ? '#fbbf24' : '#78350f' }]}>{t('devMode')}</Text>
                            <Text style={[tw`text-xs`, { color: isDarkMode ? '#fcd34d' : '#a16207' }]}>{t('devModeDesc')}</Text>
                        </View>
                    </View>
                )}

                {/* Profile Card */}
                <View style={[tw`p-5 rounded-[24px] border shadow-md flex-row items-center gap-4`, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                    <View style={tw`w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-md border-4 border-indigo-100`}>
                        <Text style={tw`text-white font-bold text-xl`}>{user?.name.charAt(0).toUpperCase() || 'K'}</Text>
                    </View>
                    <View>
                        <Text style={[tw`text-xl font-bold tracking-tight`, { color: colors.text }]}>{user?.name || 'Krushna'}</Text>
                        <Text style={[tw`text-xs font-bold uppercase tracking-wider mb-2`, { color: colors.textSecondary }]}>ID: {user?.id || '8829-AZ'}</Text>
                        <View style={[tw`self-start px-2.5 py-1 rounded-full border`, { backgroundColor: colors.primaryLight, borderColor: isDarkMode ? '#4338ca' : '#e0e7ff' }]}>
                            <Text style={[tw`text-[10px] font-bold uppercase`, { color: isDarkMode ? '#a5b4fc' : '#4338ca' }]}>Senior Inspector</Text>
                        </View>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={[tw`rounded-3xl border overflow-hidden shadow-sm`, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                    {/* Dark Mode */}
                    <View style={[tw`flex-row items-center justify-between p-5`, { backgroundColor: colors.cardBg }]}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={[tw`p-3 rounded-2xl`, { backgroundColor: isDarkMode ? colors.primaryLight : '#faf5ff' }]}>
                                <Feather name="moon" size={20} color="#7c3aed" />
                            </View>
                            <Text style={[tw`font-bold text-base`, { color: colors.text }]}>{t('darkMode')}</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={[tw`h-[1px] mx-20`, { backgroundColor: colors.border }]} />

                    {/* Notifications */}
                    <View style={[tw`flex-row items-center justify-between p-5`, { backgroundColor: colors.cardBg }]}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={[tw`p-3 rounded-2xl`, { backgroundColor: isDarkMode ? '#78350f' : '#fffbeb' }]}>
                                <Feather name="bell" size={20} color="#d97706" />
                            </View>
                            <Text style={[tw`font-bold text-base`, { color: colors.text }]}>{t('notifications')}</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <View style={[tw`h-[1px] mx-20`, { backgroundColor: colors.border }]} />

                    {/* Language */}
                    <TouchableOpacity
                        onPress={() => setShowLanguagePicker(true)}
                        style={[tw`flex-row items-center justify-between p-5`, { backgroundColor: colors.cardBg }]}
                    >
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={[tw`p-3 rounded-2xl`, { backgroundColor: isDarkMode ? '#164e63' : '#ecfeff' }]}>
                                <Feather name="globe" size={20} color="#0891b2" />
                            </View>
                            <View>
                                <Text style={[tw`font-bold text-base`, { color: colors.text }]}>{t('language')}</Text>
                                <Text style={[tw`text-xs`, { color: colors.textSecondary }]}>{languages.find(l => l.code === language)?.name}</Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Privacy & Security Section */}
                <View style={[tw`rounded-3xl border overflow-hidden shadow-sm`, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => setShowPrivacyModal(true)}
                        style={[tw`flex-row items-center justify-between p-5`, { backgroundColor: colors.cardBg }]}
                    >
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={[tw`p-3 rounded-2xl`, { backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff' }]}>
                                <Feather name="shield" size={20} color="#2563eb" />
                            </View>
                            <Text style={[tw`font-bold text-base`, { color: colors.text }]}>{t('privacySecurity')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[tw`h-[1px] mx-20`, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={[tw`flex-row items-center justify-between p-5`, { backgroundColor: colors.cardBg }]}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <View style={[tw`p-3 rounded-2xl`, { backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4' }]}>
                                <Feather name="file-text" size={20} color="#059669" />
                            </View>
                            <Text style={[tw`font-bold text-base`, { color: colors.text }]}>{t('regulations')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[tw`mt-4 border p-5 rounded-3xl flex-row items-center justify-center gap-3`, { backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2', borderColor: isDarkMode ? '#991b1b' : '#fecaca' }]}
                >
                    <Feather name="log-out" size={20} color="#ef4444" />
                    <Text style={[tw`font-bold text-base`, { color: isDarkMode ? '#fca5a5' : '#dc2626' }]}>{t('logout')}</Text>
                </TouchableOpacity>

                <Text style={[tw`text-center text-xs mt-4 font-bold tracking-wide uppercase`, { color: colors.textTertiary }]}>App Version 1.0.9 (i18n)</Text>
            </ScrollView>

            {/* Language Picker Modal */}
            <Modal
                visible={showLanguagePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowLanguagePicker(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={[tw`rounded-t-3xl p-6`, { backgroundColor: colors.surface }]}>
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={[tw`text-2xl font-bold`, { color: colors.text }]}>{t('selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                                <Feather name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                onPress={() => {
                                    setLanguage(lang.code);
                                    setShowLanguagePicker(false);
                                }}
                                style={[tw`flex-row items-center justify-between p-4 rounded-2xl mb-2`,
                                language === lang.code
                                    ? { backgroundColor: colors.primaryLight, borderWidth: 2, borderColor: '#4f46e5' }
                                    : { backgroundColor: colors.inputBg }
                                ]}
                            >
                                <View style={tw`flex-row items-center gap-3`}>
                                    <Text style={tw`text-3xl`}>{lang.flag}</Text>
                                    <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>{lang.name}</Text>
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
                    <View style={[tw`rounded-t-3xl p-6 max-h-[80%]`, { backgroundColor: colors.surface }]}>
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={[tw`text-2xl font-bold`, { color: colors.text }]}>{t('privacySecurity')}</Text>
                            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                                <Feather name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Privacy Policy */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={[tw`p-2 rounded-xl`, { backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff' }]}>
                                        <Feather name="lock" size={20} color="#2563eb" />
                                    </View>
                                    <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>{t('privacyPolicy')}</Text>
                                </View>
                                <Text style={[tw`leading-relaxed`, { color: colors.textSecondary }]}>
                                    Nav Sahayak is committed to protecting your privacy. All case data is encrypted and stored securely. We do not share your information with third parties without consent.
                                </Text>
                            </View>

                            {/* Data Protection */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={[tw`p-2 rounded-xl`, { backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4' }]}>
                                        <Feather name="database" size={20} color="#059669" />
                                    </View>
                                    <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>{t('dataProtection')}</Text>
                                </View>
                                <Text style={[tw`leading-relaxed`, { color: colors.textSecondary }]}>
                                    Compliant with Digital Personal Data Protection Act (DPDP), 2023. Your data is processed lawfully and stored within India.
                                </Text>
                            </View>

                            {/* Legal Compliance */}
                            <View style={tw`mb-6`}>
                                <View style={tw`flex-row items-center gap-3 mb-3`}>
                                    <View style={[tw`p-2 rounded-xl`, { backgroundColor: isDarkMode ? '#78350f' : '#fffbeb' }]}>
                                        <Feather name="file-text" size={20} color="#d97706" />
                                    </View>
                                    <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>{t('legalCompliance')}</Text>
                                </View>
                                <Text style={[tw`leading-relaxed`, { color: colors.textSecondary }]}>
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
