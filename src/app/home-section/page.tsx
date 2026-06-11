'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { formatArabicDate } from '@/lib/utils';
import { Package, Wrench, MapPin, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';

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
  const { homeItems, documents, maintenance, currentFamilyGroupId } = useAppStore(
    useShallow((s) => ({ homeItems: s.homeItems, documents: s.documents, maintenance: s.maintenance, currentFamilyGroupId: s.currentFamilyGroupId }))
  );

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

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* ITEMS */}
        {activeTab === 'items' && (
          <>
            {items.length === 0 ? (
              <EmptyState icon="🏠" title="لا توجد ممتلكات" description="أضف أجهزة وسيارات ومقتنيات البيت" />
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 14, borderRadius: 20,
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: 'rgba(15,27,51,0.06)' }}>
                      <Package size={20} color="var(--text-muted)" strokeWidth={1.7} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.name}
                        </p>
                        {item.warrantyExpiry && isExpiringSoon(item.warrantyExpiry) && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                            ضمان قريب
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(15,27,51,0.06)', color: 'var(--text-muted)' }}>
                          {itemCategoryLabels[item.category] || item.category}
                        </span>
                        {item.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <MapPin size={10} />{item.location}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        {item.purchaseDate && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Calendar size={10} />شُري {formatArabicDate(item.purchaseDate)}
                          </span>
                        )}
                        {item.warrantyExpiry && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: isExpiringSoon(item.warrantyExpiry) ? 'var(--warning)' : 'var(--text-muted)' }}>
                            <ShieldCheck size={10} />
                            ضمان حتى {formatArabicDate(item.warrantyExpiry)}
                          </span>
                        )}
                        {item.price && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {item.price.toLocaleString('ar-SA')} ريال
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <p style={{ fontSize: 11, marginTop: 6, color: 'var(--text-muted)' }}>
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
                  style={{
                    padding: 14, borderRadius: 20,
                    background: 'var(--surface-card)',
                    border: `1px solid ${isExpiringSoon(doc.expiryDate) ? 'rgba(253,186,116,0.30)' : 'var(--border-soft)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
                      {docTypeIcons[doc.type]}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {doc.name}
                        </p>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, flexShrink: 0, background: 'rgba(15,27,51,0.06)', color: 'var(--text-muted)' }}>
                          {docTypeLabels[doc.type]}
                        </span>
                      </div>
                      {doc.expiryDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                          {isExpiringSoon(doc.expiryDate) && (
                            <AlertTriangle size={12} color="var(--warning)" />
                          )}
                          <span style={{ fontSize: 12, fontWeight: 500, color: isExpiringSoon(doc.expiryDate) ? 'var(--warning)' : 'var(--text-muted)' }}>
                            ينتهي {formatArabicDate(doc.expiryDate)}
                          </span>
                        </div>
                      )}
                      {doc.notes && (
                        <p style={{ fontSize: 11, marginTop: 4, color: 'var(--text-muted)' }}>
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
                    style={{ padding: 14, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: 'rgba(201,122,102,0.15)' }}>
                        <Wrench size={18} color="var(--bronze)" strokeWidth={1.7} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {m.type}
                        </p>
                        {linkedItem && (
                          <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)' }}>
                            {linkedItem.name}
                          </p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Calendar size={10} />{formatArabicDate(m.date)}
                          </span>
                          {m.cost && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {m.cost} ريال
                            </span>
                          )}
                          {m.performedBy && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              بواسطة: {m.performedBy}
                            </span>
                          )}
                        </div>
                        {m.nextReminder && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '8px 10px', borderRadius: 12, background: 'rgba(201,122,102,0.12)' }}>
                            <AlertTriangle size={12} color="var(--bronze)" />
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--bronze)' }}>
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
