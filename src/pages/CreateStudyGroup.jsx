import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function CreateStudyGroup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [schedule, setSchedule] = React.useState([{ day: "Sunday", time: "16:00" }]);
  const [formData, setFormData] = React.useState({
    name: "",
    subject: "",
    stage: "",
    price_per_session: "",
    description: "",
    max_students: "10"
  });

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "Sunday", time: "16:00" }]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await supabase.auth.getCurrentUserWithProfile();
      if (!user) throw new Error(t("study_groups.error_auth"));

      const { error } = await supabase.from('study_groups').insert({
        teacher_email: user.email,
        name: formData.name,
        subject: formData.subject,
        stage: formData.stage,
        price_per_session: Number(formData.price_per_session),
        description: formData.description,
        max_students: Number(formData.max_students),
        schedule: schedule,
        status: 'active',
        students: []
      });

      if (error) throw error;

      toast.success(t("study_groups.success_create"));
      navigate(-1);
    } catch (error) {
      toast.error(t("study_groups.error_general") + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowRight className="w-4 h-4 ml-2" />
        {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t("study_groups.create_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("study_groups.label_name")}</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("study_groups.placeholder_name")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("study_groups.label_subject")}</Label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t("study_groups.placeholder_subject")}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("study_groups.label_stage")}</Label>
                <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("study_groups.placeholder_stage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">{t("stages.primary")}</SelectItem>
                    <SelectItem value="middle">{t("stages.middle")}</SelectItem>
                    <SelectItem value="high">{t("stages.high")}</SelectItem>
                    <SelectItem value="university">{t("stages.university")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("study_groups.label_price")}</Label>
                <Input
                  type="number"
                  required
                  value={formData.price_per_session}
                  onChange={(e) => setFormData({ ...formData, price_per_session: e.target.value })}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("study_groups.label_description")}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("study_groups.placeholder_description")}
              />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <Label className="text-base">{t("study_groups.label_weekly_schedule")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSchedule}>
                  <Plus className="w-4 h-4 ml-2" />
                  {t("study_groups.btn_add_slot")}
                </Button>
              </div>
              {schedule.map((slot, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>{t("study_groups.label_day")}</Label>
                    <Select value={slot.day} onValueChange={(v) => handleScheduleChange(index, 'day', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunday">{t("days.sunday")}</SelectItem>
                        <SelectItem value="Monday">{t("days.monday")}</SelectItem>
                        <SelectItem value="Tuesday">{t("days.tuesday")}</SelectItem>
                        <SelectItem value="Wednesday">{t("days.wednesday")}</SelectItem>
                        <SelectItem value="Thursday">{t("days.thursday")}</SelectItem>
                        <SelectItem value="Friday">{t("days.friday")}</SelectItem>
                        <SelectItem value="Saturday">{t("days.saturday")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>{t("study_groups.label_time")}</Label>
                    <Input
                      type="time"
                      value={slot.time}
                      onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    />
                  </div>
                  {schedule.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveSchedule(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("study_groups.btn_submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}