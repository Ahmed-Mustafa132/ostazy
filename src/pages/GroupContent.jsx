import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Upload, Trash2, Tag, Loader2, Link as LinkIcon, Video, File, Download, Folder, Search, FileText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function GroupContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('id');
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "file",
    file_url: "",
    importance: "essential",
    folder: t("content.default_folder"),
    tags: ""
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data } = await supabase.from('study_groups').select('*').eq('id', groupId).single();
      return data;
    },
    enabled: !!groupId
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['groupMaterials', groupId],
    queryFn: async () => {
      const { data } = await supabase
        .from('study_materials')
        .select('*')
        .eq('group_id', groupId)
        .order('order', { ascending: true });
      return data || [];
    },
    enabled: !!groupId
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (newMaterial) => {
      const tagsArray = newMaterial.tags ? newMaterial.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const { error } = await supabase.from('study_materials').insert({
        ...newMaterial,
        tags: tagsArray,
        group_id: groupId,
        teacher_email: user.email
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupMaterials', groupId]);
      setIsUploadOpen(false);
      setFormData({
        title: "",
        description: "",
        type: "file",
        file_url: "",
        importance: "essential",
        folder: t("content.default_folder"),
        tags: ""
      });
      toast.success(t("content.success_add"));
    },
    onError: (err) => toast.error(t("content.error_msg") + err.message)
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('study_materials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupMaterials', groupId]);
      toast.success(t("content.success_delete"));
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-purple-500" />;
      default: return <File className="w-5 h-5 text-orange-500" />;
    }
  };

  const defaultFolder = t("content.default_folder");
  const uniqueFolders = ['all', ...new Set(materials.map(m => m.folder || defaultFolder))];
  const uniqueTags = ['all', ...new Set(materials.flatMap(m => m.tags || []))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || (m.folder || defaultFolder) === selectedFolder;
    const matchesTag = selectedTag === 'all' || (m.tags && m.tags.includes(selectedTag));
    return matchesSearch && matchesFolder && matchesTag;
  });

  const materialsByFolder = selectedFolder === 'all' 
    ? filteredMaterials.reduce((acc, m) => {
        const folder = m.folder || defaultFolder;
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(m);
        return acc;
      }, {})
    : { [selectedFolder]: filteredMaterials };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100">
            <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("content.title")}</h1>
            <p className="text-gray-500 text-sm">{group?.name}</p>
          </div>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
              <Upload className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
              {t("content.btn_add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("content.dialog_add_title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("content.label_title")}</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={t("content.placeholder_title")}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("content.label_folder")}</Label>
                  <div className="relative">
                    <Input 
                      value={formData.folder}
                      onChange={(e) => setFormData({...formData, folder: e.target.value})}
                      placeholder={t("content.placeholder_folder")}
                      list="folders-list"
                    />
                    <datalist id="folders-list">
                      {uniqueFolders.filter(f => f !== 'all').map(f => (
                        <option key={f} value={f} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("content.label_type")}</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">{t("content.type_file")}</SelectItem>
                      <SelectItem value="video">{t("content.type_video")}</SelectItem>
                      <SelectItem value="link">{t("content.type_link")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("content.label_url")}</Label>
                <Input 
                  value={formData.file_url}
                  onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("content.label_tags")}</Label>
                <Input 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder={t("content.placeholder_tags")}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t("content.label_description")}</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t("content.placeholder_description")}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("content.label_importance")}</Label>
                <Select value={formData.importance} onValueChange={(v) => setFormData({...formData, importance: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essential">{t("content.imp_essential")}</SelectItem>
                    <SelectItem value="optional">{t("content.imp_optional")}</SelectItem>
                    <SelectItem value="review">{t("content.imp_review")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => createMaterialMutation.mutate(formData)}
                disabled={!formData.title || !formData.file_url || createMaterialMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {createMaterialMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : t("common.save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:right-auto rtl:left-3" />
              <Input 
                placeholder={t("content.search_placeholder")} 
                className="pr-10 rtl:pr-4 rtl:pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-[180px]">
                  <Folder className="w-4 h-4 ml-2 text-gray-500 rtl:ml-0 rtl:mr-2" />
                  <SelectValue placeholder={t("content.filter_folder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("content.all_folders")}</SelectItem>
                  {uniqueFolders.filter(f => f !== 'all').map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[180px]">
                  <Tag className="w-4 h-4 ml-2 text-gray-500 rtl:ml-0 rtl:mr-2" />
                  <SelectValue placeholder={t("content.filter_tag")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("content.all_tags")}</SelectItem>
                  {uniqueTags.filter(t => t !== 'all').map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-500">{t("common.loading")}</p>
          </div>
        ) : Object.keys(materialsByFolder).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t("content.no_results")}</p>
          </div>
        ) : (
          Object.entries(materialsByFolder).map(([folderName, folderMaterials]) => (
            folderMaterials.length > 0 && (
              <div key={folderName} className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 font-bold text-lg px-1">
                  <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  {folderName}
                  <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {folderMaterials.length}
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {folderMaterials.map((material) => (
                    <Card key={material.id} className="hover:shadow-md transition-shadow border-l-4 rtl:border-l-0 rtl:border-r-4" style={{ [t("common.direction") === 'rtl' ? 'borderRightColor' : 'borderLeftColor']: material.importance === 'essential' ? '#ef4444' : '#3b82f6' }}>
                      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                          {getIcon(material.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">{material.title}</h3>
                            {material.importance === 'essential' && (
                              <Badge variant="destructive" className="text-xs px-1.5 h-5">{t("content.badge_important")}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{material.description}</p>
                          
                          {material.tags && material.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {material.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                                  <Tag className="w-3 h-3 ml-1 rtl:ml-0 rtl:mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0">
                          <Button variant="outline" size="sm" asChild className="flex-1 md:flex-none">
                            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                              {t("content.btn_download")}
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                            onClick={() => {
                              if (confirm(t("content.confirm_delete"))) deleteMaterialMutation.mutate(material.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
} 