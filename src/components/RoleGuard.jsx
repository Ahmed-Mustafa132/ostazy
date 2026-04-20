// components/RoleGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';

export const RoleGuard = ({ 
  children, 
  requiredRole = 'user',
  fallback = '/unauthorized' 
}) => {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasAccess = () => {
    if (requiredRole === 'user') return true;
    if (requiredRole === 'moderator') return role === 'moderator' || role === 'admin';
    if (requiredRole === 'admin') return role === 'admin';
    return false;
  };

  if (!hasAccess()) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

// مكون عرض شرطي بناءً على الصلاحيات
export const ShowForRole = ({ 
  children, 
  roles = [] 
}) => {
  const { role } = useRole();

  if (!roles.includes(role)) {
    return null;
  }

  return children;
};

// مثال الاستخدام:
// 
// 1. حماية صفحة كاملة:
// <RoleGuard requiredRole="admin">
//   <AdminDashboard />
// </RoleGuard>
//
// 2. عرض محتوى شرطي:
// <ShowForRole roles={['admin', 'moderator']}>
//   <button>حذف</button>
// </ShowForRole>
