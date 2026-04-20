import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/components/SupabaseClient";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, Clock, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext"; // ربط اللغة

export default function RateTeacher() {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const teacherEmail = searchParams.get("teacher_email");
  const studentEmail = searchParams.get("student_email");
  const groupId = searchParams.get("group_id");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [aspects, setAspects] = useState({
    teaching_quality: 0,
    communication: 0,
    punctuality: 0,
    materials: 0
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      // استخدام الـ supabase client المجهز مسبقاً لضمان عدم وجود مفاتيح صلبة
      const { data, error } = await supabase.from('reviews').insert([reviewData]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(t("reviews.submit_success"));
      navigate(-1);
    },
    onError: (error) => {
      toast.error(t("reviews.submit_error") + ": " + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t("reviews.select_rating_error"));
      return;
    }

    submitReviewMutation.mutate({
      teacher_email: teacherEmail,
      student_email: studentEmail,
      group_id: groupId,
      rating: rating,
      comment: comment,
      aspects: aspects,
      is_verified: true
    });
  };

  const StarRating = ({ value, onChange, size = "md", hover = false, onHover }) => {
    const stars = [1, 2, 3, 4, 5];
    const sizeClasses = size === "lg" ? "w-8 h-8" : "w-5 h-5";

    return (
      <div className="flex gap-1" onMouseLeave={() => hover && onHover(0)}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => hover && onHover(star)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`${sizeClasses} ${star <= (hover ? (hoverRating || value) : value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
                }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!teacherEmail) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-sm w-full text-center p-6 border-red-100">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{t("reviews.invalid_link")}</p>
        <Button className="mt-4 w-full text-gray-600" onClick={() => navigate("/")}>{t("common.home")}</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="max-w-2xl mx-auto shadow-2xl border-none rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="text-center bg-slate-900 text-white pb-10 pt-10">
          <CardTitle className="text-3xl font-black tracking-tight">{t("reviews.page_title")}</CardTitle>
          <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">{t("reviews.subtitle")}</p>
        </CardHeader>

        <CardContent className="pt-10 px-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* General Rating Area */}
            <div className="flex flex-col items-center gap-4 bg-amber-50/50 p-8 rounded-[1.5rem] border border-amber-100">
              <label className="text-xl font-bold text-gray-800">{t("reviews.general_rating")}</label>
              <StarRating
                value={rating}
                onChange={setRating}
                size="lg"
                hover={true}
                onHover={setHoverRating}
              />
              <span className="text-sm font-black text-amber-600 uppercase tracking-widest">
                {rating > 0 ? t(`reviews.labels.${rating}`) : t("reviews.pick_star")}
              </span>
            </div>

            {/* Detailed Aspects */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { key: "teaching_quality", icon: BookOpen, color: "text-blue-500", label: t("reviews.aspects.teaching") },
                { key: "communication", icon: MessageSquare, color: "text-green-500", label: t("reviews.aspects.communication") },
                { key: "punctuality", icon: Clock, color: "text-purple-500", label: t("reviews.aspects.punctuality") },
                { key: "materials", icon: ThumbsUp, color: "text-orange-500", label: t("reviews.aspects.materials") }
              ].map((item) => (
                <div key={item.key} className="space-y-3 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    {item.label}
                  </label>
                  <StarRating
                    value={aspects[item.key]}
                    onChange={(v) => setAspects({ ...aspects, [item.key]: v })}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">{t("reviews.comments_label")}</label>
              <Textarea
                placeholder={t("reviews.placeholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[140px] rounded-2xl border-gray-200 focus:border-slate-900 focus:ring-slate-900 resize-none p-4"
              />
            </div>

            <div className="flex gap-4 pt-4 pb-2">
              <Button
                type="submit"
                className="flex-[2] h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all"
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? t("common.sending") : t("reviews.submit_btn")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-14 border-gray-200 rounded-2xl font-bold"
                onClick={() => navigate(-1)}
              >
                {t("common.cancel")}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}