'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);

      trackEvent('pwa_install_prompt_shown', {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
      });
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);

      trackEvent('pwa_installed', {
        install_method: 'browser_prompt',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    trackEvent('pwa_install_prompt_response', {
      user_choice: outcome,
      prompt_type: 'custom_button',
    });

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    trackEvent('pwa_install_prompt_dismissed', {
      dismiss_method: 'user_click',
    });
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 lg:hidden">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">Install Luxury Spirits</h3>
            <p className="text-gray-300 text-xs">
              Get the full app experience with offline access and push notifications
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-400 text-xs hover:text-white transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-lg hover:bg-[#FFBF00] transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}