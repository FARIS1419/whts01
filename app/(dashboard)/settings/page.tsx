'use client'
import AppLayout from '@/components/layout/AppLayout'
import { Save, Building2, Globe, Bell, Clock } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppLayout title="الإعدادات" subtitle="إعدادات مساحة العمل">
      <div className="max-w-2xl space-y-5">
        
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Building2 className="w-5 h-5 text-green-600" /> مساحة العمل</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">اسم مساحة العمل</label>
              <input className="input" defaultValue="شركتي للتجارة" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">الشعار</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">ش</div>
                <button className="btn-secondary text-sm">تغيير الشعار</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /> اللغة والمنطقة</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">اللغة الافتراضية</label>
              <select className="input"><option value="ar">العربية</option><option value="en">English</option></select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">المنطقة الزمنية</label>
              <select className="input">
                <option>Asia/Riyadh (GMT+3)</option>
                <option>Asia/Dubai (GMT+4)</option>
                <option>Africa/Cairo (GMT+2)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> الإشعارات</h3>
          <div className="space-y-3">
            {[
              { label: 'إشعار عند وصول رسالة جديدة', defaultChecked: true },
              { label: 'إشعار عند فشل إرسال رسالة', defaultChecked: true },
              { label: 'إشعار عند اكتمال الحملة', defaultChecked: true },
              { label: 'ملخص يومي بالإحصائيات', defaultChecked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-sm text-gray-700">{n.label}</span>
                <input type="checkbox" defaultChecked={n.defaultChecked} className="w-4 h-4 accent-green-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="card border-dashed border-2 border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-500 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> قريباً</h3>
          <p className="text-sm text-gray-400">إعدادات الاشتراك، الفوترة، المستخدمين، وأرقام WhatsApp المتعددة</p>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary px-8"><Save className="w-4 h-4" /> حفظ الإعدادات</button>
        </div>
      </div>
    </AppLayout>
  )
}
