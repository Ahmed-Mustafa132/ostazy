// hooks/useRole.js
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setRole(user.role || 'user');
      setLoading(false);
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user]);

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    isModeratorOrAdmin: role === 'moderator' || role === 'admin',
    isUser: role === 'user',
  };
};

// مثال الاستخدام:
// const { isAdmin, isModerator, isModeratorOrAdmin } = useRole();
// 
// if (isAdmin) {
//   // عرض لوحة التحكم الكاملة
// }
// 
// if (isModeratorOrAdmin) {
//   // عرض أدوات الإشراف
// }
