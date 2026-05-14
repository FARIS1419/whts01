'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, FileText, Phone, Video, MoreVertical, Check, CheckCheck, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'

const demoMessages: Record<string, any[]> = {
  'cccccccc-0001-0001-0001-cccccccccccc': [
    { id: '1', direction: 'incoming', content: 'السلام عليكم، أريد الاستفسار عن منتجاتكم', status: 'read', created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
    { id: '2', direction: 'outgoing', content: 'وعليكم السلام! أهلاً بك أحمد، يسعدنا مساعدتك. ما الذي تود الاستفسار عنه؟', status: 'read', created_at: new Date(Date.now() - 2.5 * 3600000).toISOString() },
    { id: '3', direction: 'incoming', content: 'أريد معرفة أسعار الباقات المتاحة لديكم', status: 'read', created_at: new Date(Date.now() - 2.3 * 3600000).toISOString() },
    { id: '4', direction: 'outgoing', content: 'بالتأكيد! لدينا 3 باقات:\n• الباقة الأساسية: 99 ريال/شهر\n• الباقة المتوسطة: 199 ريال/شهر\n• الباقة المميزة: 399 ريال/شهر\n\nكل باقة تشمل إرسال غير محدود داخل حدودها 🎁', status: 'delivered', created_at: new Date(Date.now() - 2.2 * 3600000).toISOString() },
    { id: '5', direction: 'incoming', content: 'شكراً جزيلاً، سأراجع العرض', status: 'delivered', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  ],
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={12} className="text-gray-400" />,
  sent: <Check size={12} className="text-gray-400" />,
  delivered: <CheckCheck size={12} className="text-gray-400" />,
  read: <CheckCheck size={12} style={{ color: '#3b82f6' }} />,
  failed: <X size={12} className="text-red-500" />,
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
}

interface ChatWindowProps {
  conversation: any
  onToggleProfile: () => void
}

export default function ChatWindow({ conversation, onToggleProfile }: ChatWindowProps) {
  const [messages, setMessages] = useState(
    demoMessages[conversation.id] || [
      { id: 'demo', direction: 'incoming', content: conversation.last_message_text, status: 'delivered', created_at: conversation.last_message_at }
    ]
  )
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const newMsg = {
      id: Date.now().toString(),
      direction: 'outgoing',
      content: input.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setSending(true)

    // Simulate send
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'sent' } : m))
      setSending(false)
      toast.success('تم إرسال الرسالة')
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onToggleProfile}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            {conversation.contact.name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{conversation.contact.name}</p>
            <p className="text-xs text-gray-400">+{conversation.contact.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Phone size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-bg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.direction === 'outgoing' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-xs lg:max-w-sm shadow-sm ${
                msg.direction === 'outgoing' ? 'bubble-out' : 'bubble-in'
              }`}
            >
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
                {msg.direction === 'outgoing' && statusIcons[msg.status]}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" title="إرفاق ملف">
              <Paperclip size={17} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" title="إرسال قالب">
              <FileText size={17} />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="اكتب رسالتك..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-700 resize-none placeholder-gray-400"
              style={{ outline: 'none', border: 'none', maxHeight: '120px', minHeight: '24px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            style={{ background: input.trim() ? '#25D366' : '#e5e7eb' }}
          >
            <Send size={16} className={input.trim() ? 'text-white' : 'text-gray-400'} style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
