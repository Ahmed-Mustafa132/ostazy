import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { Toaster } from "@/components/ui/toaster"
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import PageNotFound from './lib/PageNotFound'
import { AuthProvider } from '@/lib/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { LanguageProvider } from './context/LanguageContext'

const { Pages, Layout, mainPage } = pagesConfig

const mainPageKey = mainPage ?? Object.keys(Pages)[0]

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>
      {children}
    </Layout>
  ) : (
    <>{children}</>
  )

function AppRoutes() {
  return (
    <Routes>
      {/* صفحات عامة */}
      <Route path="/login" element={<Navigate to="/userlogin" replace />} />
      <Route path="/register" element={<Navigate to="/userlogin" replace />} />

      {/* الصفحة الرئيسية */}
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            {(() => {
              const pageConfig = Pages[mainPageKey]
              const MainPageComponent = pageConfig?.component || pageConfig
              return <MainPageComponent />
            })()}
          </LayoutWrapper>
        }
      />

      {/* الصفحات من pages.config */}
      {Object.entries(Pages).map(([path, pageConfig]) => {
        // إذا كان pageConfig هو object فيه component و protected
        const PageComponent = pageConfig?.component || pageConfig
        const isProtected = pageConfig?.protected || false

        const content = (
          <LayoutWrapper currentPageName={path}>
            <PageComponent />
          </LayoutWrapper>
        )

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              isProtected
                ? <ProtectedRoute>{content}</ProtectedRoute>
                : content
            }
          />
        )
      })}

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>

      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AppRoutes />
          </Router>
          <Toaster />
          <VisualEditAgent />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}