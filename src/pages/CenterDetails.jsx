import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CenterDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const centerId = id || searchParams.get('id');

  const { data: center, isLoading } = useQuery({
    queryKey: ['center', centerId],
    queryFn: async () => {
      // تم الاحتفاظ بالبيانات التجريبية كما هي مع إمكانية ترجمتها لاحقاً من قاعدة البيانات
      return {
        name: t("center_data.name"),
        description: t("center_data.description"),
        address: t("center_data.address"),
        phone: "+965 1234 5678", // الأرقام عادة لا تُترجم
        rating: 4.8,
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        subjects: [
          t("subjects.math"),
          t("subjects.physics"),
          t("subjects.english")
        ]
      };
    }
  });

  if (isLoading) return <div className="p-8 text-center">{t("common.loading")}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        {t("common.back")}
      </Button>

      <Card className="overflow-hidden">
        <div className="h-64 relative">
          <img
            src={center.image_url}
            alt={center.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{center.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">{t("center_details.about")}</h2>
              <p className="text-gray-600 leading-relaxed">{center.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">{t("center_details.subjects")}</h2>
              <div className="flex flex-wrap gap-2">
                {center.subjects.map(sub => (
                  <span key={sub} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-gray-50 border-none">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold text-gray-900">{t("center_details.contact_info")}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{center.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe className="w-5 h-5" />
                    <span>{t("center_details.website")}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {t("center_details.contact_us")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}