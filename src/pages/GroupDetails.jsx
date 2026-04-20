import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, BookOpen, DollarSign, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function GroupDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const groupId = id || searchParams.get('id');

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!groupId
  });

  if (isLoading) return <div className="p-8 text-center">{t("common.loading")}</div>;
  if (!group) return <div className="p-8 text-center">{t("details.not_found")}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
        {t("common.back")}
      </Button>
      
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {group.image_url && (
            <img 
              src={group.image_url} 
              alt={group.name}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute bottom-0 right-0 p-6 text-white rtl:right-auto rtl:left-0 text-right rtl:text-left">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <div className="flex gap-2">
              <Badge variant="secondary">{group.subject}</Badge>
              <Badge variant="outline" className="text-white border-white">{group.stage}</Badge>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">{t("details.section_info")}</h3>
              <p className="text-gray-600 leading-relaxed">{group.description}</p>
              
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>{t("details.price")}: {group.price_per_session} {t("common.currency")}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{t("details.students_count")}: {group.students?.length || 0} / {group.max_students}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">{t("details.section_schedule")}</h3>
              <div className="grid gap-2">
                {group.schedule?.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{slot.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate(createPageUrl("EnrollGroup") + `?groupId=${group.id}`)}
          >
            {t("details.btn_enroll")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}