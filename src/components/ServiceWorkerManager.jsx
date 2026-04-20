import React from "react";

/**
 * ServiceWorkerManager Component
 * 
 * Manages Service Worker registration with platform-specific logic:
 * - Disables on iOS WebView for Apple App Store compliance
 * - Enables on Android and regular web browsers
 */
export default function ServiceWorkerManager() {
  React.useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }

    // Detect iOS (includes iPhone, iPad, iPod)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Detect if running in WebView/PWA mode
    const isWebView = window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

    // Additional check for iOS WebView (WKWebView detection)
    const isWKWebView = window.webkit && window.webkit.messageHandlers;

    // Disable Service Worker on iOS WebView to comply with App Store guidelines
    if (isIOS && (isWebView || isWKWebView)) {
      console.log('✅ Service Worker disabled on iOS WebView for App Store compliance');
      console.log('Platform: iOS, WebView: true, User Agent:', navigator.userAgent);

      // Unregister any existing service workers on iOS
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('Unregistered existing Service Worker on iOS');
        });
      });

      return;
    }

    // Register service worker for web browsers and Android
    console.log('✅ Service Worker enabled for web/Android');

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });

        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🆕 New Service Worker available');
                // Optional: Show user notification about update
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service Worker controller changed');
          // Optional: Reload page to activate new SW
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Cleanup function
    return () => {
      // Optional: Remove event listeners if needed
    };
  }, []);

  // This component doesn't render anything
  return null;
}