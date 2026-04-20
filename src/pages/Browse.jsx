import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, MapPin, Video, Home as HomeIcon, MessageCircle, RotateCcw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";
const DEFAULT_FILTERS = {
  entity_type: "teacher",
  subject: "all",
  stage: "all",
  curriculum: "all",
  teaching_type: "all",
};

export default function Browse() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
    retry: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["browse-all-data"],
    queryFn: async () => {
      const [groups, teachers, centers] = await Promise.all([
        supabase.from("study_groups").select("*").eq("status", "active"),
        supabase.from("user_profiles").select("*").eq("user_type", "teacher"),
        supabase.from("educational_centers").select("*").eq("is_approved", true),
      ]);

      return {
        groups: groups.data || [],
        teachers: teachers.data || [],
        centers: centers.data || [],
      };
    },
  });

  const { groups = [], teachers = [], centers = [] } = data || {};

  const textMatch = (value, search) =>
    value?.toString().toLowerCase().includes(search.toLowerCase());

  const filteredGroups = useMemo(() => {
    if (filters.entity_type !== "all" && filters.entity_type !== "group") return [];
    return groups.filter(g =>
      (!search || textMatch(g.name, search) || textMatch(g.subject, search) || textMatch(g.description, search)) &&
      (filters.subject === "all" || g.subject === filters.subject) &&
      (filters.stage === "all" || g.stage === filters.stage) &&
      (filters.curriculum === "all" || g.curriculum === filters.curriculum)
    );
  }, [groups, search, filters]);

  const filteredTeachers = useMemo(() => {
    if (filters.entity_type !== "all" && filters.entity_type !== "teacher") return [];
    return teachers.filter(t =>
      (!search || textMatch(t.name, search) || textMatch(t.bio, search)) &&
      (filters.subject === "all" || t.subjects?.includes(filters.subject)) &&
      (filters.stage === "all" || t.stages?.includes(filters.stage)) &&
      (filters.curriculum === "all" || t.curriculum?.includes(filters.curriculum)) &&
      (filters.teaching_type === "all" || t.teaching_type?.includes(filters.teaching_type))
    );
  }, [teachers, search, filters]);

  const filteredCenters = useMemo(() => {
    if (filters.entity_type !== "all" && filters.entity_type !== "center") return [];
    return centers.filter(c =>
      (!search || textMatch(c.name, search) || textMatch(c.description, search)) &&
      (filters.subject === "all" || c.subjects?.includes(filters.subject)) &&
      (filters.stage === "all" || c.stages?.includes(filters.stage)) &&
      (filters.curriculum === "all" || c.curriculum?.includes(filters.curriculum))
    );
  }, [centers, search, filters]);

  const allSubjects = [...new Set([...groups.map(g => g.subject), ...teachers.flatMap(t => t.subjects || []), ...centers.flatMap(c => c.subjects || [])])].filter(Boolean);
  const allStages = [...new Set([...groups.map(g => g.stage), ...teachers.flatMap(t => t.stages || []), ...centers.flatMap(c => c.stages || [])])].filter(Boolean);
  const allCurricula = [...new Set([...groups.map(g => g.curriculum), ...teachers.flatMap(t => t.curriculum || []), ...centers.flatMap(c => c.curriculum || [])])].filter(Boolean);

  const handleContact = (email) => {
    if (!user || isGuest) {
      navigate(createPageUrl("UserLogin"));
      return;
    }
    navigate(createPageUrl("Chat") + `?to=${email}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-green-600 hover:text-white transition-all"
          >
            <ArrowRight className={`w-4 h-4  ml-2 `} />
            {t("browse.back")}
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {isGuest ? t("browse.guest_title") : t("browse.title")}
            </h1>
            {isGuest && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t("browse.guest_subtitle")}</p>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <Input
                  placeholder={t("browse.search_placeholder")}
                  className={`pr-10 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-green-600 hover:text-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <Filter className={`w-4 h-4 ml-2`} />
                {t("browse.advanced_filter")}
              </Button>
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-6 gap-4 mt-4 pt-4 border-t dark:border-slate-600">
                <Select value={filters.entity_type} onValueChange={(v) => setFilters({ ...filters, entity_type: v })}>
                  <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue placeholder={t("browse.entity_types.all")}>
                      {filters.entity_type === "all" && "الكل"}
                      {filters.entity_type === "group" && "مجموعة دراسية"}
                      {filters.entity_type === "teacher" && "معلم"}
                      {filters.entity_type === "center" && "مركز تعليمي"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("browse.entity_types.all")}</SelectItem>
                    <SelectItem value="group">{t("browse.entity_types.group")}</SelectItem>
                    <SelectItem value="teacher">{t("browse.entity_types.teacher")}</SelectItem>
                    <SelectItem value="center">{t("browse.entity_types.center")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.subject} onValueChange={(v) => setFilters({ ...filters, subject: v })}>
                  <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue>{filters.subject === "all" ? t("browse.filters.all_subjects") : filters.subject}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("browse.filters.all_subjects")}</SelectItem>
                    {allSubjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filters.stage} onValueChange={(v) => setFilters({ ...filters, stage: v })}>
                  <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue>{filters.stage === "all" ? t("browse.filters.all_stages") : filters.stage}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("browse.filters.all_stages")}</SelectItem>
                    {allStages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filters.curriculum} onValueChange={(v) => setFilters({ ...filters, curriculum: v })}>
                  <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue>{filters.curriculum === "all" ? t("browse.filters.all_curricula") : filters.curriculum}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("browse.filters.all_curricula")}</SelectItem>
                    {allCurricula.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filters.teaching_type} onValueChange={(v) => setFilters({ ...filters, teaching_type: v })}>
                  <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue>{t(`browse.filters.teaching_style.${filters.teaching_type}`)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("browse.filters.teaching_style.all")}</SelectItem>
                    <SelectItem value="online">{t("browse.filters.teaching_style.online")}</SelectItem>
                    <SelectItem value="home">{t("browse.filters.teaching_style.home")}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters} className="flex gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-slate-700 dark:text-white">
                  <RotateCcw className="w-4 h-4" />
                  {t("browse.reset_filters")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{t("browse.results_count")}</span>
              {filteredGroups.length > 0 && <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{filteredGroups.length} {t("browse.entity_types.group")}</Badge>}
              {filteredTeachers.length > 0 && <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200">{filteredTeachers.length} {t("browse.entity_types.teacher")}</Badge>}
              {filteredCenters.length > 0 && <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200">{filteredCenters.length} {t("browse.entity_types.center")}</Badge>}
            </div>

            {(filteredGroups.length === 0 && filteredTeachers.length === 0 && filteredCenters.length === 0) ? (
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl"><CardContent className="p-12 text-center text-gray-500 dark:text-gray-400">{t("browse.no_results")}</CardContent></Card>
            ) : (
              <>
                {/* Groups */}
                {filteredGroups.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-xl font-bold text-gray-900 dark:text-white">{t("browse.groups_title")}</h2>
                    {filteredGroups.map((group) => (
                      <Card key={group.id} className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer rounded-3xl overflow-hidden group" onClick={() => isGuest ? navigate(createPageUrl("UserLogin")) : navigate(createPageUrl("GroupDetails") + `?id=${group.id}`)}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg group-hover:text-green-600 dark:text-white">{group.name}</h3>
                              <p className="text-sm text-gray-500">{group.subject} - {group.stage}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">{group.price} {t("payment.kw")}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{isGuest ? t("browse.guest_details_hidden") : group.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {group.is_online ? <Video className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
                            <span>{group.is_online ? t("browse.online") : t("browse.offline")}</span>
                            {group.location && <><MapPin className="w-4 h-4" /> <span>{group.location}</span></>}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-600">
                            <span className="text-green-600 font-bold">{group.current_students}/{group.max_students} {t("browse.student")}</span>
                            {!isGuest && <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleContact(group.teacher_email); }} className="hover:bg-green-600 hover:text-white"><MessageCircle className={`w-4 h-4 ml-1`} />{t("browse.contact")}</Button>}
                          </div>
                          {isGuest && <Button className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold">{t("browse.guest_prompt")}</Button>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Teachers */}
                {filteredTeachers.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-xl font-bold text-gray-900 dark:text-white mt-4">{t("browse.teachers_title")}</h2>
                    {filteredTeachers.map((teacher) => (
                      <Card key={teacher.id} className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer rounded-3xl overflow-hidden group" onClick={() => isGuest ? navigate(createPageUrl("UserLogin")) : navigate(createPageUrl("TeacherDetails") + `?id=${teacher.id}`)}>
                        {teacher.avatar_url && <div className="relative h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><img src={teacher.avatar_url} alt={teacher.name} className="h-full object-contain group-hover:scale-105 transition-transform" /></div>}
                        {console.log(teacher)}
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg group-hover:text-green-600 dark:text-white">{teacher.full_name}</h3>
                              <p className="text-sm text-gray-500">{teacher.subjects?.join(', ')}</p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700">{teacher.hourly_rate} {t("payment.kw")}/{t("browse.per_hour")}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{isGuest ? t("browse.guest_details_hidden") : teacher.bio}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {teacher.teaching_type?.includes('online') && <Video className="w-4 h-4" />}
                            {teacher.teaching_type?.includes('home') && <HomeIcon className="w-4 h-4" />}
                            <span>{teacher.teaching_type?.join(', ')}</span>
                            {teacher.city && <><MapPin className="w-4 h-4" /> <span>{teacher.city}</span></>}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-600">
                            <span className="text-green-600 font-bold">{t("browse.rating")}: {teacher.rating}</span>
                            {!isGuest && <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleContact(teacher.user_email); }} className="hover:bg-green-600 hover:text-white"><MessageCircle className={`w-4 h-4 ml-1`} />{t("browse.contact")}</Button>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Centers */}
                {filteredCenters.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-xl font-bold text-gray-900 dark:text-white mt-4">{t("browse.centers_title")}</h2>
                    {filteredCenters.map((center) => (
                      <Card key={center.id} className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer rounded-3xl overflow-hidden group" onClick={() => isGuest ? navigate(createPageUrl("UserLogin")) : navigate(createPageUrl("CenterDetails") + `?id=${center.id}`)}>
                        {center.images?.[0] && <div className="relative h-40"><img src={center.images[0]} alt={center.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg group-hover:text-green-600 dark:text-white">{center.name}</h3>
                              <p className="text-sm text-gray-500">{center.city} - {center.area}</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">{center.price_per_month} {t("payment.kw")}/{t("browse.per_month")}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{isGuest ? t("browse.guest_details_hidden") : center.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4"><MapPin className="w-4 h-4" /> <span>{center.address}</span></div>
                          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-600">
                            <span className="text-green-600 font-bold">{t("browse.rating")}: {center.rating}</span>
                            {!isGuest && <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleContact(center.user_email); }} className="hover:bg-green-600 hover:text-white"><MessageCircle className={`w-4 h-4 ml-1`} />{t("browse.contact")}</Button>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}