import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '@/i18n';
import { supabase } from "@/components/SupabaseClient";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('language') || 'ar';
        }
        return 'ar';
    });

    const [isRTL, setIsRTL] = useState(true);

    useEffect(() => {
        const fetchUserPreference = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('UserPreference')
                        .select('language')
                        .eq('user_email', user.email)
                        .maybeSingle();
                    if (data?.language && data.language !== language) {
                        setLanguage(data.language);
                    }
                }
            } catch (e) {
                console.log("Error fetching language preference", e);
            }
        };
        fetchUserPreference();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem('language', language);
        }
        const rtl = language === 'ar' || language === 'ur';
        setIsRTL(true);
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key, defaultText = '') => {
        try {
            // دعم nested keys زي repentance.title
            if (key.includes('.')) {
                const parts = key.split('.');
                let value = translations[language];
                for (const part of parts) {
                    if (value && typeof value === 'object') {
                        value = value[part];
                    } else {
                        break;
                    }
                }
                if (value && typeof value === 'string') return value;
            }

            // البحث المباشر
            return translations[language]?.[key] || defaultText || key;
        } catch (error) {
            console.warn('Translation error for key:', key, error);
            return defaultText || key;
        }
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};