'use client';

// DEMO_REVIEW — delete this file + remove <DemoReviewBanner /> from AppShell to remove demo access.

import { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';

export function DemoReviewBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(document.cookie.split(';').some((c) => c.trim().startsWith('demo_review=1')));
  }, []);

  function exitDemo() {
    document.cookie = 'demo_review=; Max-Age=0; path=/';
    window.location.href = '/login';
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        height: 'calc(36px + env(safe-area-inset-top, 0px))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 16px calc(6px)',
        background: 'rgba(201,122,102,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(201,122,102,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Eye size={13} color="#0D0F12" />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0D0F12' }}>
          وضع المراجعة — بيانات تجريبية فقط
        </span>
      </div>
      <button
        onClick={exitDemo}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 10,
          background: 'rgba(0,0,0,0.18)', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <X size={11} color="#0D0F12" />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#0D0F12' }}>إنهاء</span>
      </button>
    </div>
  );
}
