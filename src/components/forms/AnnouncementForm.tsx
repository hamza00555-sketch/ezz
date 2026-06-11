'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { Sparkles } from 'lucide-react';

interface AnnouncementFormProps {
  open: boolean;
  onClose: () => void;
}

// ─── AI Text Analyzer ─────────────────────────────────────────────────────────

interface AnalysisResult {
  title: string;
  message: string;
  requiresConfirmation: boolean;
  isPinned: boolean;
  detectedType: 'visit' | 'event' | 'reminder' | 'general';
  detectedDay: string;
  detectedTime: string;
  detectedLocation: string;
}

function analyzeAnnouncement(text: string): AnalysisResult {
  // ── Intent ──
  const goRe  = /بنروح|سنروح|نروح[\s،]|بنذهب|سنذهب|نذهب|بنزور|سنزور|نزور|رحلة|زيارة/;
  const doRe  = /بنعمل|سنعمل|عندنا|بنجتمع|نجتمع|حفلة|وليمة|تجمع[\s،]|ضيوف/;
  const remRe = /تذكير|لا\s+تنسوا|لا\s+تنس|موعد\s+(طبي|مدرسة|مدرسي|اجتماع|طبيب)/;

  let detectedType: AnalysisResult['detectedType'] = 'general';
  if (goRe.test(text))       detectedType = 'visit';
  else if (doRe.test(text))  detectedType = 'event';
  else if (remRe.test(text)) detectedType = 'reminder';

  const typeEmoji = { visit: '🚗', event: '🎉', reminder: '⏰', general: '📢' }[detectedType];

  // ── Day ──
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  let detectedDay = '';
  for (const d of dayNames) {
    if (text.includes(d)) {
      detectedDay = d;
      const after = text.slice(text.indexOf(d) + d.length, text.indexOf(d) + d.length + 15);
      if (/القادم|الجاي|الجاية/.test(after)) detectedDay += ' القادم';
      break;
    }
  }
  if (!detectedDay) {
    if (/غداً|غدًا|بكرا|بكره|بكرة/.test(text)) detectedDay = 'غداً';
    else if (/بعد\s+غد/.test(text)) detectedDay = 'بعد غد';
    else if (/اليوم/.test(text)) detectedDay = 'اليوم';
  }

  // ── Time ──
  let detectedTime = '';
  const tm = text.match(/الساعة\s*([\d:]+)\s*(صباحاً|صباح|مساءً|مساء|ظهراً|ظهر|بعد\s+الظهر|الليل|العصر|المغرب)?/);
  if (tm) {
    const mod = tm[2]?.replace('بعد الظهر', 'مساءً') ?? '';
    detectedTime = `الساعة ${tm[1]}${mod ? ' ' + mod : ''}`.trim();
  }

  // ── Location — take up to 3 words after a trigger ──
  let detectedLocation = '';
  const locTriggers = ['بنروح ', 'سنروح ', 'نروح ', 'بنزور ', 'نزور ', 'إلى ', 'الى ', 'عند '];
  const stopRe = /الساعة|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت|غداً|بكرا|[،,.\n]/;
  for (const trigger of locTriggers) {
    const idx = text.indexOf(trigger);
    if (idx !== -1) {
      const after = text.slice(idx + trigger.length);
      const stop  = after.search(stopRe);
      const raw   = (stop > 0 ? after.slice(0, stop) : after.slice(0, 25)).trim();
      detectedLocation = raw.split(/\s+/).slice(0, 3).join(' ').trim();
      if (detectedLocation) break;
    }
  }

  // ── Title ──
  let titleBase = '';
  if (detectedType === 'visit')    titleBase = detectedLocation ? `زيارة ${detectedLocation}` : 'رحلة عائلية';
  else if (detectedType === 'event')    titleBase = detectedLocation ? `تجمع في ${detectedLocation}` : 'تجمع عائلي';
  else if (detectedType === 'reminder') titleBase = 'تذكير مهم';
  else                                  titleBase = text.split(/[.،\n]/)[0].slice(0, 30).trim();
  const title = `${typeEmoji} ${titleBase}`;

  // ── Structured message ──
  const infoLines: string[] = [];
  if (detectedDay)      infoLines.push(`📅 ${detectedDay}`);
  if (detectedTime)     infoLines.push(`🕐 ${detectedTime}`);
  if (detectedLocation) infoLines.push(`📍 ${detectedLocation}`);
  const message = infoLines.length > 0
    ? infoLines.join('\n') + '\n\n' + text.trim()
    : text.trim();

  return {
    title,
    message,
    requiresConfirmation: detectedType === 'event' || detectedType === 'visit',
    isPinned: detectedType === 'event' || detectedType === 'visit',
    detectedType,
    detectedDay,
    detectedTime,
    detectedLocation,
  };
}

const typeLabels = {
  visit:    '🚗 زيارة / رحلة',
  event:    '🎉 تجمع / فعالية',
  reminder: '⏰ تذكير / موعد',
  general:  '📢 إعلان عام',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AnnouncementForm({ open, onClose }: AnnouncementFormProps) {
  const { currentFamilyGroupId, currentUserId } = useAppStore(
    useShallow((s) => ({ currentFamilyGroupId: s.currentFamilyGroupId, currentUserId: s.currentUserId }))
  );

  const [naturalText, setNaturalText]     = useState('');
  const [analysis, setAnalysis]           = useState<AnalysisResult | null>(null);
  const [title, setTitle]                 = useState('');
  const [message, setMessage]             = useState('');
  const [isPinned, setIsPinned]           = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  function handleAnalyze() {
    if (!naturalText.trim()) return;
    const result = analyzeAnnouncement(naturalText.trim());
    setAnalysis(result);
    setTitle(result.title);
    setMessage(result.message);
    setRequiresConfirmation(result.requiresConfirmation);
    setIsPinned(result.isPinned);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim())   e.title   = 'العنوان مطلوب';
    if (!message.trim()) e.message = 'نص الإعلان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const localId = `ann-${Date.now()}`;
    const now = new Date().toISOString();
    const annData = {
      familyGroupId: currentFamilyGroupId,
      title: title.trim(),
      message: message.trim(),
      publishedBy: currentUserId,
      audience: 'all' as const,
      requiresConfirmation,
      confirmedBy: [] as string[],
      status: 'active' as const,
      isPinned,
    };

    // Optimistic local insert
    useAppStore.setState((state) => ({
      announcements: [
        ...state.announcements,
        { ...annData, id: localId, createdAt: now, updatedAt: now },
      ],
    }));

    // Sync to Supabase + replace local id with the real DB id (or roll back on failure)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddAnnouncement }) =>
        dbAddAnnouncement(annData).then(({ data, error }) => {
          if (error) {
            console.error('[AnnouncementForm] insert failed, rolling back', error);
            useAppStore.setState((s) => ({ announcements: s.announcements.filter((a) => a.id !== localId) }));
            return;
          }
          if (data?.id && data.id !== localId) {
            useAppStore.setState((s) => ({
              announcements: s.announcements.map((a) => (a.id === localId ? { ...a, id: data.id } : a)),
            }));
          }
        })
      ).catch((err) => {
        console.error('[AnnouncementForm] sync error, rolling back', err);
        useAppStore.setState((s) => ({ announcements: s.announcements.filter((a) => a.id !== localId) }));
      });
    }

    setTitle(''); setMessage(''); setNaturalText('');
    setIsPinned(false); setRequiresConfirmation(false);
    setAnalysis(null);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إعلان عائلي جديد">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

        {/* ── AI Section ── */}
        <div
          style={{
            padding: '14px',
            borderRadius: 18,
            background: 'rgba(201,122,102,0.08)',
            border: '1px solid rgba(201,122,102,0.22)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Sparkles size={14} color="var(--bronze)" />
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--bronze)' }}>
              صف الإعلان بشكل طبيعي
            </p>
          </div>

          <textarea
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
            placeholder={'الجمعة الجاية بنروح بيت الجد الساعة 4 مساء\nبكرا عندنا ضيوف العشاء الساعة 8\nتذكير: موعد مدرسة الأطفال الاثنين الساعة 7 صباح'}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(15,27,51,0.04)',
              border: '1px solid rgba(201,122,102,0.18)',
              borderRadius: 12, padding: '10px 12px',
              color: 'var(--text-primary)', fontSize: 13,
              fontFamily: 'inherit', direction: 'rtl',
              resize: 'none', outline: 'none',
              boxSizing: 'border-box',
              lineHeight: 1.6,
            }}
          />

          {/* Detected info badges */}
          {analysis && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 8px' }}>
              <span
                style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(201,122,102,0.18)', color: 'var(--bronze)',
                  border: '1px solid rgba(201,122,102,0.25)',
                }}
              >
                {typeLabels[analysis.detectedType]}
              </span>
              {analysis.detectedDay && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(15,27,51,0.06)', color: 'var(--text-secondary)' }}>
                  📅 {analysis.detectedDay}
                </span>
              )}
              {analysis.detectedTime && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(15,27,51,0.06)', color: 'var(--text-secondary)' }}>
                  🕐 {analysis.detectedTime}
                </span>
              )}
              {analysis.detectedLocation && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(15,27,51,0.06)', color: 'var(--text-secondary)' }}>
                  📍 {analysis.detectedLocation}
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!naturalText.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: analysis ? 0 : 8,
              padding: '7px 14px', borderRadius: 10,
              background: naturalText.trim() ? 'rgba(201,122,102,0.18)' : 'rgba(15,27,51,0.04)',
              color: naturalText.trim() ? 'var(--bronze)' : 'var(--text-muted)',
              border: `1px solid ${naturalText.trim() ? 'rgba(201,122,102,0.30)' : 'rgba(15,27,51,0.06)'}`,
              cursor: naturalText.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
            }}
            className="active:scale-95"
          >
            <Sparkles size={13} />
            {analysis ? 'إعادة التحليل' : 'تحليل ✨'}
          </button>
        </div>

        {/* ── Regular fields (auto-filled by AI or manual) ── */}
        <FormField label="عنوان الإعلان" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: 🎉 تجمع عائلي الجمعة"
            error={!!errors.title}
            autoFocus={!naturalText}
          />
        </FormField>

        <FormField label="نص الإعلان" required error={errors.message}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="تفاصيل الإعلان..."
            error={!!errors.message}
            rows={5}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <label
            className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: 'rgba(15,27,51,0.03)', border: '1px solid var(--border-soft)' }}
          >
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📌 تثبيت الإعلان</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>يظهر في الصفحة الرئيسية</p>
            </div>
          </label>

          <label
            className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: 'rgba(15,27,51,0.03)', border: '1px solid var(--border-soft)' }}
          >
            <input
              type="checkbox"
              checked={requiresConfirmation}
              onChange={(e) => setRequiresConfirmation(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>✅ يتطلب تأكيد القراءة</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>يُظهر زر تأكيد للأفراد</p>
            </div>
          </label>
        </div>

        <SubmitButton label="نشر الإعلان" />
      </form>
    </BottomSheet>
  );
}
