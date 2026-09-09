'use client'

// Small centered confirm dialog — same shell as the account-closure modal in
// hesap/limitler/page.tsx, generalized for reuse (e.g. logout confirmation).
export default function ConfirmDialog({
  open, title, body, confirmLabel = 'Onayla', cancelLabel = 'Vazgeç', danger = true, onConfirm, onCancel,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[97] flex items-center justify-center bg-black/50 px-8" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 max-w-[320px] w-full" onClick={e => e.stopPropagation()}>
        <p className="text-[15px] font-bold text-[#1a2332]">{title}</p>
        <p className="text-[12px] text-[#737B8C] mt-2">{body}</p>
        <div className="flex gap-2.5 mt-5">
          <button onClick={onCancel} className="flex-1 h-[42px] rounded-xl border border-[#e8ecf1] text-[#1a2332] text-[13px] font-semibold">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-[42px] rounded-xl text-white text-[13px] font-semibold ${danger ? 'bg-[#e74c3c]' : 'bg-[#0E8FCF]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
