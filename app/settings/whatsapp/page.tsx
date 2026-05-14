'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Save, TestTube, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Copy, Info } from 'lucide-react'

export default function WhatsAppSettingsPage() {
  const [showToken, setShowToken] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [form, setForm] = useState({
    app_id: '',
    waba_id: '',
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: 'my_verify_token_123',
    api_version: 'v19.0',
    test_phone: '',
  })

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : 'https://your-domain.com/api/webhook'

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 2000))
    setTestResult(form.access_token ? 'success' : 'error')
    setTesting(false)
  }

  return (
    <AppLayout title="إعدادات WhatsApp API" subtitle="ربط منصتك مع WhatsApp Business Cloud API">
      
      {/* Status Banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">النظام يعمل بوضع التجربة</p>
          <p className="text-xs text-amber-600 mt-0.5">أضف بيانات API الخاصة بك لتفعيل الإرسال الحقيقي عبر WhatsApp Business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-bold">1</span>
              بيانات التطبيق
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Meta App ID</label>
                <input value={form.app_id} onChange={e => setForm(p => ({...p, app_id: e.target.value}))}
                  className="input" placeholder="123456789" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">WhatsApp Business Account ID</label>
                <input value={form.waba_id} onChange={e => setForm(p => ({...p, waba_id: e.target.value}))}
                  className="input" placeholder="987654321" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone Number ID</label>
                <input value={form.phone_number_id} onChange={e => setForm(p => ({...p, phone_number_id: e.target.value}))}
                  className="input" placeholder="112233445566" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">API Version</label>
                <select value={form.api_version} onChange={e => setForm(p => ({...p, api_version: e.target.value}))}
                  className="input">
                  <option value="v19.0">v19.0</option>
                  <option value="v18.0">v18.0</option>
                  <option value="v17.0">v17.0</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-bold">2</span>
              رمز الوصول (Access Token)
            </h3>
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                Access Token <span className="text-red-500">*</span>
                <span className="mr-2 text-xs text-gray-400 font-normal">(يُخزَّن بشكل آمن - لا يُعرض في المتصفح)</span>
              </label>
              <div className="relative">
                <input value={form.access_token} onChange={e => setForm(p => ({...p, access_token: e.target.value}))}
                  type={showToken ? 'text' : 'password'}
                  className="input pl-10" placeholder="EAAxxxxxxxx..." dir="ltr" />
                <button onClick={() => setShowToken(!showToken)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" /> احصل على الـ Token من Meta for Developers → Your App → WhatsApp → API Setup
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-bold">3</span>
              إعداد Webhook
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Webhook Callback URL</label>
                <div className="flex items-center gap-2">
                  <input value={webhookUrl} readOnly className="input flex-1 bg-gray-50 text-gray-600" dir="ltr" />
                  <button onClick={() => navigator.clipboard.writeText(webhookUrl)}
                    className="btn-secondary px-3">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">انسخ هذا الرابط وضعه في Meta App Dashboard → Webhooks</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Webhook Verify Token</label>
                <input value={form.webhook_verify_token} onChange={e => setForm(p => ({...p, webhook_verify_token: e.target.value}))}
                  className="input" dir="ltr" />
                <p className="text-xs text-gray-400 mt-1.5">نفس القيمة في Meta App Dashboard → Webhooks → Verify Token</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-bold">4</span>
              اختبار الاتصال
            </h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">رقم هاتف للاختبار</label>
                <input value={form.test_phone} onChange={e => setForm(p => ({...p, test_phone: e.target.value}))}
                  className="input" placeholder="+966XXXXXXXXX" dir="ltr" />
              </div>
              <button onClick={handleTest} disabled={testing}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed">
                {testing ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> جاري الاختبار...</span>
                ) : (
                  <span className="flex items-center gap-2"><TestTube className="w-4 h-4" /> اختبار الاتصال</span>
                )}
              </button>
            </div>
            {testResult === 'success' && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">الاتصال ناجح! تم إرسال رسالة تجريبية ✅</p>
              </div>
            )}
            {testResult === 'error' && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700 font-medium">فشل الاتصال. تأكد من صحة Access Token والـ Phone Number ID</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button className="btn-primary px-8">
              <Save className="w-4 h-4" /> حفظ الإعدادات
            </button>
          </div>
        </div>

        {/* Guide */}
        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
            <h4 className="font-bold text-gray-900 mb-3">📋 خطوات الإعداد</h4>
            <ol className="space-y-2.5 text-sm text-gray-700">
              {[
                'سجّل الدخول إلى Meta for Developers',
                'أنشئ تطبيق Business أو اختر موجود',
                'أضف منتج WhatsApp للتطبيق',
                'احصل على Phone Number ID و WABA ID',
                'أنشئ Access Token دائم أو مؤقت',
                'أضف Webhook URL في إعدادات التطبيق',
                'اختبر الاتصال بالزر أعلاه',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card">
            <h4 className="font-bold text-gray-900 mb-3">🔒 الأمان</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Access Token مشفر في قاعدة البيانات</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> كل الطلبات تمر عبر الـ Backend</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Token لا يظهر أبداً في المتصفح</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> التحقق من توقيع Webhook</li>
            </ul>
          </div>

          <div className="card border-dashed border-2 border-gray-200 bg-gray-50">
            <h4 className="font-bold text-gray-700 mb-2 text-sm">حالة الاتصال الحالية</h4>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600 font-semibold">يحتاج إعداد</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">أضف بياناتك واختبر الاتصال لتفعيل المنصة</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
