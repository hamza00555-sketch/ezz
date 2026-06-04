'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { formatArabicDate } from '@/lib/utils';
import {
  Package, FileText, Wrench, MapPin, Calendar, AlertTriangle,
  ShieldCheck, ChevronLeft
} from 'lucide-react';

type HomeTab = 'items' | 'documents' | 'maintenance';

const itemCategoryLabels: Record<string, string> = {
  appliances: 'أجهزة',
  vehicles: 'سيارات',
  furniture: 'أثاث',
  tools: 'أدوات',
  other: 'أخرى',
};

const docTypeLabels: Record<string, string> = {
  contract: 'عقد',
  warranty: 'ضمان',
  invoice: 'فاتورة',
  insurance: 'تأمين',
  form: 'استمارة',
  other: 'أخرى',
};

const docTypeIcons: Record<string, string> = {
  contract: '📄',
  warranty: '🛡️',
  invoice: '🧾',
  insurance: '🔐',
  form: '📋',
  other: '📎',
};

export default function HomeSectionPage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('items');
  const { homeItems, documents, maintenance, currentFamilyGroupId } = useAppStore();

  const items = homeItems.filter((i) => i.familyGroupId === currentFamilyGroupId);
  const docs = documents.filter((d) => d.familyGroupId === currentFamilyGroupId);
  const maintenanceRecords = maintenance.filter((m) => m.familyGroupId === currentFamilyGroupId);

  const tabs = [
    { key: 'items', label: 'الممتلكات', count: items.length },
    { key: 'documents', label: 'الوثائق', count: docs.length },
    { key: 'maintenance', label: 'الصيانة', count: maintenanceRecords.length },
  ];

  const isExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const thirtyDays = new Date(Date.now() + 2592000000);
    return date <= thirtyDays && date > new Date();
  };

  return (
    <AppShell>
      <PageHeader title="البيت" />
      <Tabs tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as HomeTab)} />

      <div className="p-4 flex flex-col gap-3">
        {/* ITEMS */}
        {activeTab === 'items' && (
          <>
            {items.length === 0 ? (
              <EmptyState icon="🏠" title="لا توجد ممتلكات" description="أضف أجهزة وسيارات ومقتنيات البيت" />
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl"
                  style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2.5 rounded-xl flex-shrink-0"
                      style={{ background: '#F5F5F4' }}
                    >
                      <Package size={20} color="#78716C" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                          {item.name}
                        </p>
                        {item.warrantyExpiry && isExpiringSoon(item.warrantyExpiry) && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: '#FEF3C7', color: '#92400E' }}
                          >
                            ضمان قريب
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F5F4', color: '#78716C' }}>
                          {itemCategoryLabels[item.category] || item.category}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                            <MapPin size={10} />{item.location}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {item.purchaseDate && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#A8A29E' }}>
                            <Calendar size={10} />شُري {formatArabicDate(item.purchaseDate)}
                          </span>
                        )}
                        {item.warrantyExpiry && (
                          <span
                            className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: isExpiringSoon(item.warrantyExpiry) ? '#D97706' : '#A8A29E' }}
                          >
                            <ShieldCheck size={10} />
                            ضمان حتى {formatArabicDate(item.warrantyExpiry)}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-xs" style={{ color: '#A8A29E' }}>
                            {item.price.toLocaleString('ar-SA')} ريال
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs mt-1.5" style={{ color: '#78716C' }}>
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <>
            {docs.length === 0 ? (
              <EmptyState icon="📁" title="لا توجد وثائق" description="احفظ عقودك وضماناتك وتأميناتك" />
            ) : (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${isExpiringSoon(doc.expiryDate) ? '#FED7AA' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {docTypeIcons[doc.type]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                          {doc.name}
                        </p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: '#F5F5F4', color: '#78716C' }}
                        >
                          {docTypeLabels[doc.type]}
                        </span>
                      </div>
                      {doc.expiryDate && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {isExpiringSoon(doc.expiryDate) && (
                            <AlertTriangle size={12} color="#D97706" />
                          )}
                          <span
                            className="text-xs font-medium"
                            style={{ color: isExpiringSoon(doc.expiryDate) ? '#D97706' : '#78716C' }}
                          >
                            ينتهي {formatArabicDate(doc.expiryDate)}
                          </span>
                        </div>
                      )}
                      {doc.notes && (
                        <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>
                          {doc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <>
            {maintenanceRecords.length === 0 ? (
              <EmptyState icon="🔧" title="لا توجد سجلات صيانة" description="سجّل صيانة أجهزتك وسياراتك" />
            ) : (
              maintenanceRecords.map((m) => {
                const linkedItem = homeItems.find((i) => i.id === m.linkedItemId);
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl"
                    style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2.5 rounded-xl flex-shrink-0"
                        style={{ background: '#FFF7ED' }}
                      >
                        <Wrench size={18} color="#C8922A" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                          {m.type}
                        </p>
                        {linkedItem && (
                          <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
                            {linkedItem.name}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                            <Calendar size={10} />{formatArabicDate(m.date)}
                          </span>
                          {m.cost && (
                            <span className="text-xs" style={{ color: '#78716C' }}>
                              {m.cost} ريال
                            </span>
                          )}
                          {m.performedBy && (
                            <span className="text-xs" style={{ color: '#A8A29E' }}>
                              بواسطة: {m.performedBy}
                            </span>
                          )}
                        </div>
                        {m.nextReminder && (
                          <div
                            className="flex items-center gap-1 mt-2 px-2.5 py-1.5 rounded-xl"
                            style={{ background: '#FFF7ED' }}
                          >
                            <AlertTriangle size={12} color="#C8922A" />
                            <span className="text-xs font-medium" style={{ color: '#C8922A' }}>
                              الصيانة القادمة: {formatArabicDate(m.nextReminder)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
