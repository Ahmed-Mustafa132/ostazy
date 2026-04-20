import React from "react";

/**
 * ExternalLinkHandler Component
 * 
 * Handles external links to open in the device's default browser
 * instead of within the WebView. This is required for Apple App Store compliance.
 * 
 * Usage: Wrap your app content with this component in Layout or App.
 */
export default function ExternalLinkHandler({ children }) {
  React.useEffect(() => {
    // Log platform info for debugging
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isWebView = window.navigator.standalone === true || 
                      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    
    if (isIOS && isWebView) {
      console.log('✅ External Link Handler active on iOS WebView');
      console.log('User Agent:', navigator.userAgent);
    }

    const handleClick = (e) => {
      const link = e.target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Skip if no href or it's a hash link
      if (!href || href.startsWith('#')) return;
      
      // Check if it's an external link
      try {
        const currentDomain = window.location.hostname;
        const linkUrl = new URL(href, window.location.origin);
        const linkDomain = linkUrl.hostname;
        
        // If external domain, open in new tab/browser
        if (linkDomain !== currentDomain && !href.startsWith('/')) {
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      } catch (err) {
        // If URL parsing fails, it's likely a relative link, let it proceed normally
        console.debug('Link parsing skipped:', href);
      }
    };

    // Add click event listener to document
    document.addEventListener('click', handleClick, true);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return <>{children}</>;
}