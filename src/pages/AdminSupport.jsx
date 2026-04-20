import React, { useState, useEffect } from 'react';
import { supabase } from '@/components/SupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, User, MessageSquare, Trash2, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSupport() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      let query = supabase
        .from('ContactRequest')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'معلق');
      } else if (filter === 'replied') {
        query = query.eq('status', 'تم الرد');
      } else if (filter === 'closed') {
        query = query.eq('status', 'مغلق');
      }

      const { data, error } = await query;
      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('ContactRequest')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      loadRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t("admin.support.error_update"));
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm(t("admin.support.delete_confirm"))) return;

    try {
      const { error } = await supabase
        .from('ContactRequest')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert(t("admin.support.error_delete"));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'معلق': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
      'تم الرد': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      'مغلق': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig['معلق'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterButtons = [
    { label: t("admin.support.filters.all"), value: 'all', count: requests.length },
    { label: t("admin.support.filters.pending"), value: 'pending', color: 'bg-amber-600' },
    { label: t("admin.support.filters.replied"), value: 'replied', color: 'bg-green-600' },
    { label: t("admin.support.filters.closed"), value: 'closed', color: 'bg-gray-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-4 transition-colors duration-300"></div>
          <p className="text-slate-600 dark:text-gray-400 transition-colors duration-300">{t("admin.support.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                {t("admin.support.title")}
              </h1>
              <p className="text-slate-600 dark:text-gray-400 transition-colors duration-300">
                {t("admin.support.total_messages")}: {requests.length}
              </p>
            </div>
            <Button onClick={() => navigate(createPageUrl('Home'))} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("admin.support.back_home")}
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6 flex-wrap"
        >
          {filterButtons.map((btn, index) => (
            <Button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              variant={filter === btn.value ? 'default' : 'outline'}
              className={filter === btn.value ? `${btn.color || 'bg-green-600'} hover:${btn.color || 'bg-green-700'} text-white` : ''}
            >
              {btn.label} {btn.count ? `(${btn.count})` : ''}
            </Button>
          ))}
        </motion.div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl transition-colors duration-300">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t("admin.support.no_messages")}</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {request.name?.charAt(0) || '؟'}
                          </div>
                          <div>
                            <CardTitle className="text-xl dark:text-white transition-colors duration-300">{request.name}</CardTitle>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-gray-400 mt-3 transition-colors duration-300">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${request.email}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                              {request.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-4 transition-colors duration-300">
                      <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-300">{request.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {request.status === 'معلق' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(request.id, 'تم الرد')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 ml-1" />
                            {t("admin.support.actions.reply_done")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, 'مغلق')}
                          >
                            {t("admin.support.actions.close")}
                          </Button>
                        </>
                      )}

                      {request.status === 'تم الرد' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(request.id, 'مغلق')}
                        >
                          {t("admin.support.actions.close")}
                        </Button>
                      )}

                      {request.status === 'مغلق' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(request.id, 'معلق')}
                        >
                          {t("admin.support.actions.reopen")}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => deleteRequest(request.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        {t("admin.support.actions.delete")}
                      </Button>

                      <a
                        href={`mailto:${request.email}?subject=رد على: استفسار`}
                        className="inline-flex items-center px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Mail className="w-4 h-4 ml-1" />
                        {t("admin.support.actions.email_reply")}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}