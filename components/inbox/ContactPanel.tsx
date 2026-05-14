'use client'

import { X, Phone, Mail, Tag, StickyNote, Edit2 } from 'lucide-react'

interface ContactPanelProps {
  contact: {
    id: string
    name: string
    phone: string
    email?: string
    tags: string[]
    notes?: string
    status: string
  }
  onClose: () => void
}

const tagColors = ['#dcfce7', '#dbeafe', '#ede9fe', '#fef3c7', '#fee2e2']
const tagTextColors = ['#16a34a', '#1d4ed8', '#7c3aed', '#b45309', '#dc2626']

export default function ContactPanel({ contact, onClose }: ContactPanelProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <h3 className="font-bold text-gray-800 text-sm">ملف جهة الاتصال</h3>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            {contact.name[0]}
          </div>
          <h3 className="font-bold text-gray-800 text-base">{contact.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">+{contact.phone}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: '#dcfce7', color: '#16a34a' }}>
            نشط
          </span>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">معلومات الاتصال</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} style={{ color: '#25D366' }} />
            <span dir="ltr">+{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} style={{ color: '#3b82f6' }} />
              <span>{contact.email}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contact.tags?.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
                <Tag size={13} style={{ color: '#8b5cf6' }} /> الوسوم
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: tagColors[i % tagColors.length],
                    color: tagTextColors[i % tagTextColors.length]
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
              <StickyNote size={13} style={{ color: '#f59e0b' }} /> الملاحظات
            </h4>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit2 size={13} />
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {contact.notes || 'لا توجد ملاحظات بعد'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600">
            <Tag size={16} style={{ color: '#8b5cf6' }} />
            إضافة وسم
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600">
            <StickyNote size={16} style={{ color: '#f59e0b' }} />
            إضافة ملاحظة
          </button>
        </div>
      </div>
    </div>
  )
}
