import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/components/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import {
  Video,
  Home,
  Building2,
  GraduationCap,
  ArrowLeft,
  FileText,
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await supabase.auth.getCurrentUserWithProfile();
    },
    retry: false,
  });

  React.useEffect(() => {
    if (userData) {
      setUser(userData);
      if (!userData.user_type) {
        navigate(createPageUrl("CompleteProfile"));
      }
    }
  }, [userData, navigate]);

  React.useEffect(() => {
    document.title = `${t("home.title")} - ${t("home.subtitle")}`;
  }, [t]);

  const handleLogin = () => {
    navigate(createPageUrl("UserLogin"));
  };

  const handleGuestBrowse = () => {
    navigate(createPageUrl("Browse") + "?guest=true");
  };

  const teachingCategories = [
    {
      id: "online",
      title: t("home.categories.online.title"),
      description: t("home.categories.online.desc"),
      icon: Video,
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365478/Online_teacher_azc5ye.png",
      // تحويل النص لمصفوفة هنا
      features: t("home.categories.online.features").split(",")
    },
    {
      id: "home",
      title: t("home.categories.home.title"),
      description: t("home.categories.home.desc"),
      icon: Home,
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365477/Home_teacher_pb3x42.png",
      features: t("home.categories.home.features").split(",")
    },
    {
      id: "center",
      title: t("home.categories.center.title"),
      description: t("home.categories.center.desc"),
      icon: Building2,
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365472/Educational_center_owuixr.png",
      features: t("home.categories.center.features").split(",")
    },
    {
      id: "services",
      title: t("home.categories.services.title"),
      description: t("home.categories.services.desc"),
      icon: FileText,
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365474/Educational_services_bfcd7m.png",
      features: t("home.categories.services.features").split(",")
    }
  ];
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-orange-200 dark:border-slate-700 rounded-b-3xl transition-colors duration-300">
          <div className="px-3 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-2 md:py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{t("home.title")}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{t("home.subtitle")}</p>
                </div>
              </div>

              {!user && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleGuestBrowse}
                    variant="outline"
                    className="hover:bg-black hover:text-white text-xs md:text-base px-3 py-1.5 md:px-4 md:py-2 transition-all"
                  >
                    <UserPlus className="w-4 h-4 ml-1" />
                    {t("home.guest")}
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs md:text-base px-3 py-1.5 md:px-4 md:py-2 transition-all shadow-lg"
                  >
                    {t("home.login")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-3 md:py-12 pb-20 md:pb-12">
          <div className="text-center mb-3 md:mb-12">
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 md:mb-4">
              {t("home.welcome_title")}
            </h2>
            <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 md:max-w-2xl md:mx-auto">
              {t("home.welcome_desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-8">
            {teachingCategories.map((category) => (
              <Card
                key={category.id}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-t-3xl">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <CardContent className="relative p-2.5 md:p-6">
                  <h3 className="text-xs md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-3 text-center">
                    {category.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-4 text-center hidden md:block">
                    {category.description}
                  </p>
                  <div className="space-y-1 mb-2 md:mb-6 hidden md:block">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      if (category.id === 'services') {
                        navigate(createPageUrl("EducationalServices"));
                      } else {
                        navigate(createPageUrl("Browse") + `?type=${category.id}`);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs md:text-sm py-1.5 md:py-2 transition-all shadow-lg"
                  >
                    <span>{t("home.request_service")}</span>
                    <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {user && <MobileBottomNav />}
    </>
  );
}