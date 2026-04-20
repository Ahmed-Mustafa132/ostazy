import React, { useState } from "react";
import { supabase } from "@/components/SupabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  FileText,
  Award,
  Clock,
  Users,
  Target,
  Plus,
  Trash2,
  Bell,
  MessageCircle,
  Video,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/context/LanguageContext";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const dashboardImages = {
  activeGroups: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_300/v1767365471/Active_groups_afvv45.png",
  pendingAssignments: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_400/v1769070975/Pending_assignments_zdtxuu.png",
  progressRate: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365481/Progress_rate_gpsviq.png",
  sessions: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365483/Sessions_wlbx2f.png",
  findTeacher: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365475/Find_teacher_mfychb.png",
  assignments: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365484/Solve_assignments_r9uncg.png",
  chat: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365471/Chat_jhzx7q.png",
  personalGoals: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365479/personal_goals_komreh.png",
  objectives: "https://res.cloudinary.com/dufjbywcm/image/upload/q_auto,f_auto,fl_lossy,w_150/v1767365474/Educational_objectives_zjcjog.png"
};

export default function StudentDashboard() {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    category: "academic",
    target_date: "",
    progress_percentage: 0
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['studentEnrollments', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: allGroups = [] } = useQuery({
    queryKey: ['allGroups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('study_groups').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['studentAssignments'],
    queryFn: async () => {
      if (!user?.email) return [];
      const groupIds = enrollments.map(e => e.group_id);
      if (groupIds.length === 0) return [];

      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data.filter(a => groupIds.includes(a.group_id));
    },
    enabled: !!user?.email && enrollments.length > 0,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['studentSubmissions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('student_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: personalGoals = [] } = useQuery({
    queryKey: ['personalGoals', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('student_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['studentAnnouncements'],
    queryFn: async () => {
      if (!user?.email) return [];
      const groupIds = enrollments.map(e => e.group_id);
      if (groupIds.length === 0) return [];

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) throw error;

      return data.filter(a =>
        groupIds.includes(a.group_id) &&
        (!a.student_email || a.student_email === user?.email)
      ).slice(0, 5);
    },
    enabled: !!user?.email && enrollments.length > 0,
  });

  const { data: upcomingSessions = [] } = useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: async () => {
      if (!user?.email) return [];
      const groupIds = enrollments.map(e => e.group_id);
      if (groupIds.length === 0) return [];

      const { data, error } = await supabase
        .from('video_sessions')
        .select('*')
        .order('scheduled_date', { ascending: false });
      if (error) throw error;

      return data.filter(s => {
        if (!groupIds.includes(s.group_id)) return false;
        if (s.status !== 'scheduled') return false;

        const sessionDate = new Date(`${s.scheduled_date}T${s.scheduled_time}`);
        return sessionDate > new Date();
      }).slice(0, 3);
    },
    enabled: !!user?.email && enrollments.length > 0,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data) => {
      const { data: newGoal, error } = await supabase
        .from('personal_goals')
        .insert([{
          ...data,
          student_email: user?.email,
          status: 'active'
        }])
        .select();
      if (error) throw error;
      return newGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['personalGoals']);
      setShowGoalDialog(false);
      setGoalForm({
        title: "",
        description: "",
        category: "academic",
        target_date: "",
        progress_percentage: 0
      });
      toast.success("تم إضافة الهدف بنجاح");
    },
  });

  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ id, progress }) => {
      const { data: updated, error } = await supabase
        .from('personal_goals')
        .update({
          progress_percentage: progress,
          status: progress >= 100 ? 'completed' : 'active'
        })
        .eq('id', id)
        .select();
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['personalGoals']);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('personal_goals')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['personalGoals']);
      toast.success("تم حذف الهدف");
    },
  });

  const enrolledGroups = allGroups.filter(g =>
    enrollments.some(e => e.group_id === g.id && e.status === 'active')
  );

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');

  const pendingAssignments = assignments.filter(a =>
    !submissions.some(s => s.assignment_id === a.id)
  );

  const averageProgress = activeEnrollments.length > 0
    ? activeEnrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / activeEnrollments.length
    : 0;

  const stats = [
    {
      title: "المجموعات النشطة",
      value: activeEnrollments.length,
      icon: Users,
      image: dashboardImages.activeGroups,
      description: `${completedEnrollments.length} مكتملة`
    },
    {
      title: "الواجبات المعلقة",
      value: pendingAssignments.length,
      icon: FileText,
      image: dashboardImages.pendingAssignments,
      description: `${submissions.length} مسلمة`
    },
    {
      title: "معدل التقدم",
      value: `${averageProgress.toFixed(0)}%`,
      icon: TrendingUp,
      image: dashboardImages.progressRate,
      description: "عبر جميع المجموعات"
    },
    {
      title: "إجمالي الحصص",
      value: activeEnrollments.reduce((sum, e) => sum + (e.attendance_count || 0), 0),
      icon: Calendar,
      image: dashboardImages.sessions,
      description: "حضرتها"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-black hover:text-white"
          >
            <ArrowRight className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2 rotate-180"}`} />
            {t("dashboard.back")}
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {t("dashboard.welcome")}, {user?.full_name}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {t("dashboard.overview")}
          </p>

          <div className="flex flex-wrap gap-2 md:gap-4 mt-4">
            <Button
              onClick={() => navigate(createPageUrl("PaymentCheckout") + "?topup=true")}
              className="bg-green-600 hover:bg-black text-white transition-all text-xs md:text-sm"
            >
              <DollarSign className="w-4 h-4 ml-2" />
              {t("dashboard.topup_wallet")}
            </Button>

            <Button
              onClick={() => navigate(createPageUrl("StudentProgress"))}
              className="bg-blue-600 hover:bg-black text-white transition-all text-xs md:text-sm"
            >
              <TrendingUp className="w-4 h-4 ml-2" />
              {t("dashboard.view_progress")}
            </Button>
          </div>
        </div>

        {/* Stats Cards with Images */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all rounded-3xl overflow-hidden">
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={stat.image}
                    alt={stat.title}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                </div>
                <CardContent className="p-3 md:p-6">
                  <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1 md:mb-2 transition-colors duration-300">{stat.title}</h3>
                  <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                {t("dashboard.recent_announcements")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-3 md:p-4 rounded-lg border ${announcement.is_urgent
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                      : announcement.type === 'resource'
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600'
                      } transition-colors duration-300`}
                  >
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base transition-colors duration-300">{announcement.title}</h4>
                      <div className="flex gap-1">
                        {announcement.is_urgent && (
                          <Badge variant="destructive" className="text-xs">{t("dashboard.urgent")}</Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {announcement.type === 'announcement' ? t("dashboard.type_announcement") :
                            announcement.type === 'resource' ? t("dashboard.type_resource") : t("dashboard.type_reminder")}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{announcement.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {format(new Date(announcement.created_date), 'dd MMMM yyyy - HH:mm', { locale: isRTL ? ar : undefined })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 backdrop-blur-sm border-0 shadow-xl rounded-3xl border-r-4 border-r-blue-500 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100 transition-colors duration-300">
                <Video className="w-5 h-5 md:w-6 md:h-6" />
                {t("dashboard.upcoming_live_sessions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((videoSession) => {
                  const group = allGroups.find(g => g.id === videoSession.group_id);
                  const sessionDate = new Date(`${videoSession.scheduled_date}T${videoSession.scheduled_time}`);
                  const timeUntil = Math.ceil((sessionDate - new Date()) / (1000 * 60));
                  const canJoin = timeUntil <= 15;

                  return (
                    <div key={videoSession.id} className="p-3 md:p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors duration-300">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base transition-colors duration-300">{videoSession.title}</h4>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{group?.name}</p>
                        </div>
                        {canJoin && (
                          <Badge className="bg-green-600 animate-pulse text-xs">{t("dashboard.available_now")}</Badge>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {sessionDate.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')} - {videoSession.scheduled_time}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => canJoin ? navigate(createPageUrl("VideoSession") + `?id=${videoSession.id}`) : null}
                          className={`${canJoin ? 'bg-green-600 hover:bg-black' : ''} text-white transition-all text-xs md:text-sm w-full md:w-auto`}
                          disabled={!canJoin}
                        >
                          <Video className="w-4 h-4 ml-1" />
                          {canJoin ? t("dashboard.join_now") : t("dashboard.coming_soon")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions with Images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {[
            { title: t("dashboard.browse_teachers"), desc: t("dashboard.browse_teachers_desc"), icon: Users, img: dashboardImages.findTeacher, url: "Browse", color: "blue", btnText: t("dashboard.browse_now") },
            { title: t("dashboard.assignments"), desc: t("dashboard.assignments_desc"), icon: FileText, img: dashboardImages.assignments, url: "StudentAssignments", color: "green", btnText: t("dashboard.view") },
            { title: t("dashboard.chat"), desc: t("dashboard.chat_desc"), icon: MessageCircle, img: dashboardImages.chat, url: "Chat", color: "purple", btnText: t("dashboard.open") }
          ].map((action, i) => (
            <Card
              key={i}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group rounded-3xl overflow-hidden"
              onClick={() => navigate(createPageUrl(action.url))}
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={action.img}
                  alt={action.title}
                  className="w-full h-full object-contain bg-white p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-3 md:p-6 text-center">
                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900 dark:text-white transition-colors duration-300">{action.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-4 hidden md:block transition-colors duration-300">
                  {action.desc}
                </p>
                <Button className={`w-full bg-${action.color}-600 hover:bg-black text-white transition-all text-xs md:text-sm`}>
                  {action.btnText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Goals */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-gray-900 dark:text-white transition-colors duration-300">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                {t("dashboard.my_goals")}
              </span>
              <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-black text-white transition-all w-full md:w-auto">
                    <Plus className="w-4 h-4 ml-1" />
                    {t("dashboard.new_goal")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-slate-800">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">{t("dashboard.add_new_goal")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="dark:text-white">{t("dashboard.goal_title")}</Label>
                      <Input
                        value={goalForm.title}
                        onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                        placeholder={t("dashboard.goal_placeholder")}
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <Label className="dark:text-white">{t("dashboard.goal_description")}</Label>
                      <Textarea
                        value={goalForm.description}
                        onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                        placeholder={t("dashboard.goal_desc_placeholder")}
                        rows={3}
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <Label className="dark:text-white">{t("dashboard.goal_type")}</Label>
                      <Select value={goalForm.category} onValueChange={(value) => setGoalForm({ ...goalForm, category: value })}>
                        <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">{t("dashboard.goal_academic")}</SelectItem>
                          <SelectItem value="skill">{t("dashboard.goal_skill")}</SelectItem>
                          <SelectItem value="personal">{t("dashboard.goal_personal")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="dark:text-white">{t("dashboard.target_date")}</Label>
                      <Input
                        type="date"
                        value={goalForm.target_date}
                        onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      />
                    </div>
                    <Button
                      onClick={() => createGoalMutation.mutate(goalForm)}
                      disabled={!goalForm.title || createGoalMutation.isPending}
                      className="w-full bg-green-600 hover:bg-black text-white transition-all"
                    >
                      {createGoalMutation.isPending ? t("dashboard.saving") : t("dashboard.save_goal")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {personalGoals.filter(g => g.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">{t("dashboard.no_goals")}</p>
                <Button
                  size="sm"
                  onClick={() => setShowGoalDialog(true)}
                  className="bg-green-600 hover:bg-black text-white transition-all"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  {t("dashboard.add_goal")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {personalGoals.filter(g => g.status === 'active').map((goal) => (
                  <div key={goal.id} className="p-3 md:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-700 transition-colors duration-300">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base transition-colors duration-300">{goal.title}</h4>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {goal.category === 'academic' ? t("dashboard.goal_academic") : goal.category === 'skill' ? t("dashboard.goal_skill") : t("dashboard.goal_personal")}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(t("dashboard.confirm_delete_goal"))) {
                            deleteGoalMutation.mutate(goal.id);
                          }
                        }}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{goal.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t("dashboard.progress")}</span>
                        <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{goal.progress_percentage}%</span>
                      </div>
                      <Progress value={goal.progress_percentage || 0} className="h-2" />

                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress_percentage || 0}
                        onChange={(e) => updateGoalProgressMutation.mutate({
                          id: goal.id,
                          progress: parseInt(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrolled Groups */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center justify-between text-gray-900 dark:text-white transition-colors duration-300">
              <span>{t("dashboard.active_groups")}</span>
              <Badge>{enrolledGroups.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrolledGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 md:w-16 h-12 md:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base transition-colors duration-300">{t("dashboard.no_groups")}</p>
                <Button
                  onClick={() => navigate(createPageUrl("Browse"))}
                  className="bg-green-600 hover:bg-black text-white transition-all"
                >
                  {t("dashboard.browse_groups")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledGroups.map((group) => {
                  const enrollment = enrollments.find(e => e.group_id === group.id);
                  return (
                    <div key={group.id} className="p-3 md:p-4 bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base transition-colors duration-300">{group.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            {group.subject} - {group.stage}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {enrollment?.status === 'active' ? t("dashboard.status_active") : t("dashboard.status_completed")}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t("dashboard.progress")}</span>
                          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{enrollment?.progress_percentage || 0}%</span>
                        </div>
                        <Progress value={enrollment?.progress_percentage || 0} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          {t("dashboard.attendance")}: {enrollment?.attendance_count || 0}/{enrollment?.total_sessions || 0}
                        </span>
                        <span>{group.price_per_session} {t("dashboard.currency_unit")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}