import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    DollarSign
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminWalletRequests() {
    const { t, isRTL } = useLanguage();
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = React.useState(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState("all");

    // جلب طلبات السحب
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['walletRequests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('withdrawal_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error fetching withdrawal requests:', error);
                throw error;
            }
            return data || [];
        },
        refetchInterval: 5000, // تحديث كل 5 ثوان
    });

    // تعديل حالة الطلب
    const updateStatusMutation = useMutation({
        mutationFn: async ({ requestId, newStatus }) => {
            const { data, error } = await supabase
                .from('withdrawal_requests')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', requestId);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['walletRequests']);
            setIsDetailOpen(false);
            setSelectedRequest(null);
            toast.success(t("admin.status_updated") || "تم تحديث الحالة بنجاح");
        },
        onError: (err) => {
            toast.error(t("admin.status_update_error") || "خطأ في تحديث الحالة: " + err.message);
        }
    });

    // حذف طلب
    const deleteRequestMutation = useMutation({
        mutationFn: async (requestId) => {
            const { error } = await supabase
                .from('withdrawal_requests')
                .delete()
                .eq('id', requestId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['walletRequests']);
            setIsDetailOpen(false);
            setSelectedRequest(null);
            toast.success(t("admin.request_deleted") || "تم حذف الطلب بنجاح");
        },
        onError: (err) => {
            toast.error(t("admin.delete_error") || "خطأ في حذف الطلب: " + err.message);
        }
    });

    // فلترة الطلبات
    const filteredRequests = React.useMemo(() => {
        if (statusFilter === "all") return requests;
        return requests.filter(req => req.status === statusFilter);
    }, [requests, statusFilter]);

    // إحصائيات
    const stats = React.useMemo(() => {
        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            in_progress: requests.filter(r => r.status === 'in_progress').length,
            completed: requests.filter(r => r.status === 'completed').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            totalAmount: requests.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
        };
    }, [requests]);

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            in_progress: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: t("admin.status_pending") || "قيد الانتظار",
            in_progress: t("admin.status_in_progress") || "قيد التنفيذ",
            completed: t("admin.status_completed") || "مكتملة",
            rejected: t("admin.status_rejected") || "مرفوضة"
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'in_progress':
                return <Clock className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <div>
                <h1 className="text-3xl font-bold">{t("admin.wallet_requests") || "طلبات السحب"}</h1>
                <p className="text-gray-600 mt-1">{t("admin.manage_withdrawals") || "إدارة طلبات سحب المعلمين"}</p>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">{t("admin.total_requests") || "الإجمالي"}</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-sm text-yellow-700">{t("admin.pending") || "قيد الانتظار"}</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-sm text-blue-700">{t("admin.in_progress") || "قيد التنفيذ"}</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-sm text-green-700">{t("admin.completed") || "مكتملة"}</p>
                            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">{t("admin.total_amount") || "المجموع"}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalAmount.toFixed(2)} {t("payment.kw") || "د.ك"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* الفلاتر */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">
                            {t("admin.filter_by_status") || "تصفية حسب الحالة:"}
                        </label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("admin.all_status") || "الكل"}</SelectItem>
                                <SelectItem value="pending">{getStatusLabel("pending")}</SelectItem>
                                <SelectItem value="in_progress">{getStatusLabel("in_progress")}</SelectItem>
                                <SelectItem value="completed">{getStatusLabel("completed")}</SelectItem>
                                <SelectItem value="rejected">{getStatusLabel("rejected")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* جدول الطلبات */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("admin.withdrawal_requests") || "طلبات السحب"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">{t("admin.no_requests") || "لا توجد طلبات"}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t("admin.teacher") || "المعلم"}
                                        </th>
                                        <th className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t("admin.amount") || "المبلغ"}
                                        </th>
                                        <th className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t("admin.status") || "الحالة"}
                                        </th>
                                        <th className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t("admin.date") || "التاريخ"}
                                        </th>
                                        <th className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t("admin.actions") || "الإجراءات"}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900">{request.teacher_name || request.teacher_email}</p>
                                                    <p className="text-xs text-gray-500">{request.teacher_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 font-semibold text-green-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    {request.amount} {request.currency || t("payment.kw") || "د.ك"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${getStatusColor(request.status)} flex items-center gap-2 w-fit`}>
                                                    {getStatusIcon(request.status)}
                                                    {getStatusLabel(request.status)}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(request.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Eye className="w-4 h-4 ml-1" />
                                                    {t("admin.view") || "عرض"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog لتفاصيل الطلب */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("admin.request_details") || "تفاصيل الطلب"}</DialogTitle>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-4 py-4">
                            {/* معلومات المعلم */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{t("admin.teacher_info") || "معلومات المعلم"}</h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="text-gray-600">{t("admin.name") || "الاسم"}:</span>
                                        <span className="font-medium ml-2">{selectedRequest.teacher_name || selectedRequest.teacher_email}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-600">{t("admin.email") || "البريد"}:</span>
                                        <span className="font-medium ml-2 text-xs">{selectedRequest.teacher_email}</span>
                                    </p>
                                </div>
                            </div>

                            {/* تفاصيل السحب */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{t("admin.withdrawal_details") || "تفاصيل السحب"}</h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="text-gray-600">{t("admin.amount") || "المبلغ"}:</span>
                                        <span className="font-bold text-green-600 ml-2">
                                            {selectedRequest.amount} {selectedRequest.currency || t("payment.kw") || "د.ك"}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-gray-600">{t("admin.transfer_details") || "بيانات التحويل"}:</span>
                                        <span className="font-mono text-xs ml-2 bg-gray-100 p-1 rounded">
                                            {selectedRequest.transfer_details}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-gray-600">{t("admin.requested_date") || "تاريخ الطلب"}:</span>
                                        <span className="font-medium ml-2">
                                            {new Date(selectedRequest.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* تغيير الحالة */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{t("admin.status") || "الحالة"}</h3>
                                <Select
                                    value={selectedRequest.status}
                                    onValueChange={(newStatus) => {
                                        setSelectedRequest({ ...selectedRequest, status: newStatus });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">{getStatusLabel("pending")}</SelectItem>
                                        <SelectItem value="in_progress">{getStatusLabel("in_progress")}</SelectItem>
                                        <SelectItem value="completed">{getStatusLabel("completed")}</SelectItem>
                                        <SelectItem value="rejected">{getStatusLabel("rejected")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ملاحظات */}
                            {selectedRequest.notes && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{t("admin.notes") || "ملاحظات"}</h3>
                                    <p className="text-sm bg-gray-50 p-3 rounded text-gray-700">{selectedRequest.notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (window.confirm(t("admin.confirm_delete") || "هل أنت متأكد من حذف هذا الطلب؟")) {
                                    deleteRequestMutation.mutate(selectedRequest.id);
                                }
                            }}
                            disabled={deleteRequestMutation.isPending}
                        >
                            {deleteRequestMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                            ) : null}
                            {t("admin.delete") || "حذف"}
                        </Button>

                        <Button
                            onClick={() => {
                                updateStatusMutation.mutate({
                                    requestId: selectedRequest.id,
                                    newStatus: selectedRequest.status
                                });
                            }}
                            disabled={updateStatusMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {updateStatusMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                            ) : null}
                            {t("admin.save") || "حفظ"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
