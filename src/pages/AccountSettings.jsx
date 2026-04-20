import React, { useState, useEffect } from "react";
import { supabase } from "@/components/SupabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2, User, Phone, MapPin, BookOpen, Save, Camera } from "lucide-react";
import { toast } from "sonner"; // أو أي مكتبة تنبيهات تستخدمها

export default function AccountSettings() {
    const { t, isRTL } = useLanguage();
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. جلب بيانات المستخدم الحالية
    const { data: profile, isLoading } = useQuery({
        queryKey: ["currentUserProfile"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            console.log(data)
            return data;
        },
    });

    // 2. State لإدارة الحقول (تُحدث بمجرد تحميل البيانات)
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        bio: "",
        country: "",
        city: "",
        area: "",
        subject: "",
        avatar_url: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                bio: profile.bio || "",
                country: profile.country || "",
                city: profile.city || "",
                area: profile.area || "",
                subject: profile.subject || "",
                avatar_url: profile.avatar_url || "",
            });
        }
    }, [profile]);

    // دالة رفع الصورة إلى Supabase Storage
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // التحقق من حجم الملف (اختياري ولكن ينصح به)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("حجم الصورة كبير جداً، الحد الأقصى 2 ميجابايت");
            return;
        }

        setIsUpdating(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const fileExt = file.name.split('.').pop();
            // تنظيم الصور داخل فولدرات باسم الـ user id
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // 1. الرفع إلى 'user_avatar'
            const { error: uploadError } = await supabase.storage
                .from('user_avatar')
                .upload(fileName, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 2. جلب الرابط العام
            const { data } = supabase.storage
                .from('user_avatar')
                .getPublicUrl(fileName);

            const publicUrl = data.publicUrl;

            // 3. تحديث الـ State فوراً ليراها المستخدم
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            // نصيحة: يفضل تحديث قاعدة البيانات هنا أيضاً لضمان حفظ الرابط حتى لو لم يضغط حفظ
            await supabase
                .from("user_profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            toast.success(t("settings.avatar_upload_success") || "تم تحديث الصورة الشخصية");

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("فشل رفع الصورة: " + error.message);
        } finally {
            setIsUpdating(false);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // تحويل النص لمصفوفة
            const subjectsArray = formData.subject
                ? formData.subject.split(',').map(s => s.trim()).filter(s => s !== "")
                : [];

            const { error } = await supabase
                .from("user_profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    bio: formData.bio,
                    country: formData.country,
                    city: formData.city,
                    area: formData.area,
                    subjects: subjectsArray, // تأكد أن الاسم في الجدول subjects وليس subject
                    avatar_url: formData.avatar_url,
                    updated_at: new Date(),
                })
                .eq("id", user.id);

            if (error) throw error;
            toast.success(t("settings.update_success"));
            queryClient.invalidateQueries(["currentUserProfile"]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };
    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    const isTeacher = profile?.user_type === "teacher";

    return (
        <div className="max-w-3xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
            <Card>
                <CardHeader className="border-b mb-6">
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {t("settings.title")}
                        <span className="text-sm font-normal text-muted-foreground">
                            ({isTeacher ? t("common.teacher") : t("common.student")})
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-6">

                        {/* الصورة الشخصية (تحتاج دالة رفع صور منفصلة) */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="relative">
                                <img
                                    src={formData.avatar_url || "/default-avatar.png"}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                                    alt="Avatar"
                                />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUpdating}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* الاسم الكامل */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("settings.full_name")}</label>
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            {/* الهاتف */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("settings.phone")}</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className={isRTL ? "pr-10" : "pl-10"}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* الدولة والمدينة */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("settings.country")}</label>
                                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("settings.city")}</label>
                                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                            </div>

                            {/* المنطقة */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">{t("settings.area")}</label>
                                <Input value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                            </div>

                            {/* المادة (تتغير التسمية بناء على النوع) */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">
                                    {isTeacher ? t("settings.teaching_subject") : t("settings.favorite_subject")}
                                </label>
                                <Input
                                    placeholder={isTeacher ? t("settings.subject_placeholder_teacher") : t("settings.subject_placeholder_student")}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* نبذة تعريفية */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("settings.bio")}</label>
                            <Textarea
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg transition-all active:scale-[0.98]"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            <span className="text-lg">
                                {t("settings.save_btn")}
                            </span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}