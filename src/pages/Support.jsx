import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/components/SupabaseClient";

export default function Support() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    document.title = "الدعم الفني - Support | أستاذي";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('ContactRequest').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        request_type: 'support',
        status: 'معلق'
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting support request:', error);
      alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-green-600 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية / Back to Home
          </Button>
        </div>

        {/* Content Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                الدعم الفني
              </h1>
              <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Support
              </h2>
            </div>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  تم إرسال رسالتك بنجاح!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your message has been sent successfully!
                </p>
              </div>
            </div>
          )}

          {/* Introduction */}
          <div className="mb-8 space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              نحن هنا لمساعدتك! يمكنك التواصل معنا من خلال النموذج أدناه، وسنرد عليك في أقرب وقت ممكن.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We're here to help! You can contact us through the form below, and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Mail className="w-5 h-5 text-green-600" />
                نموذج التواصل / Contact Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">
                    الاسم / Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل / Enter your full name"
                    required
                    className="mt-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">
                    البريد الإلكتروني / Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                    className="mt-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-900 dark:text-white">
                    الرسالة / Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب رسالتك هنا... / Write your message here..."
                    required
                    rows={6}
                    className="mt-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                >
                  {isSubmitting ? "جاري الإرسال... / Sending..." : "إرسال / Send"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              طرق التواصل الأخرى / Other Contact Methods
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span>Email: support@ostathi.com</span>
              </p>
              <p className="text-sm">
                نحن نستجيب عادة خلال 24-48 ساعة / We typically respond within 24-48 hours
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>Last updated: January 2026</p>
            <p>آخر تحديث: يناير 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}