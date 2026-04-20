import React, { useState } from "react";
import { supabase } from "@/components/SupabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Send, Paperclip, Megaphone, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "../components/chat/ChatInterface";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GroupChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      return data;
    },
    enabled: !!groupId,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['groupEnrollments', groupId],
    queryFn: async () => {
      const { data } = await supabase
        .from('enrollments')
        .select('*')
        .eq('group_id', groupId);
      return data || [];
    },
    enabled: !!groupId,
  });

  const sendAnnouncementMutation = useMutation({
    mutationFn: async (messageData) => {
      const { data: message } = await supabase
        .from('chat_messages')
        .insert([messageData])
        .select()
        .single();
      
      const studentEmails = enrollments.map(e => e.student_email);
      const notifications = studentEmails.map(email => ({
        user_email: email,
        title: t("chat.notif_title"),
        message: `${t("chat.notif_body")} ${group?.name}`,
        type: "announcement",
        link: createPageUrl("GroupChat") + `?id=${groupId}`,
        is_read: false
      }));
      
      await supabase.from('notifications').insert(notifications);
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chatMessages']);
      setShowAnnouncementDialog(false);
      setAnnouncementText("");
      setFileUrl("");
      setFileName("");
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat-files/${fileName}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      setFileName(file.name);
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendAnnouncement = () => {
    if (!announcementText.trim() && !fileUrl) return;

    sendAnnouncementMutation.mutate({
      sender_email: user?.email,
      group_id: groupId,
      message: announcementText || `${t("chat.file_shared")}: ${fileName}`,
      message_type: fileUrl ? "file" : "announcement",
      file_url: fileUrl,
      file_name: fileName,
      is_read: false
    });
  };

  const isTeacher = group?.teacher_email === user?.email;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl(isTeacher ? "TeacherGroups" : "StudentDashboard"))}
          className="mb-6"
        >
          <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
          {t("common.back")}
        </Button>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Group Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">{group?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t("chat.subject")}</p>
                  <Badge variant="secondary">{group?.subject}</Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t("chat.stage")}</p>
                  <Badge variant="secondary">{group?.stage}</Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    {t("chat.students")}
                  </p>
                  <p className="font-semibold">
                    {enrollments.length} / {group?.max_students}
                  </p>
                </div>

                {isTeacher && (
                  <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Megaphone className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                        {t("chat.btn_send_announcement")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("chat.dialog_title")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>{t("chat.label_text")}</Label>
                          <Textarea
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder={t("chat.placeholder_text")}
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>{t("chat.label_file")}</Label>
                          <Input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={uploadingFile}
                            className="mt-2"
                          />
                          {uploadingFile && (
                            <p className="text-xs text-gray-600 mt-1">{t("chat.status_uploading")}</p>
                          )}
                          {fileUrl && (
                            <p className="text-xs text-green-600 mt-1">{t("chat.status_uploaded")}: {fileName}</p>
                          )}
                        </div>

                        <Button 
                          onClick={handleSendAnnouncement}
                          disabled={(!announcementText.trim() && !fileUrl) || sendAnnouncementMutation.isPending}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {sendAnnouncementMutation.isPending ? t("chat.btn_sending") : t("chat.btn_submit")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <ChatInterface groupId={groupId} />
          </div>
        </div>
      </div>
    </div>
  );
}