'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type RequestModalKind = 'request' | 'measure'

type RequestModalContextValue = {
  open: (kind?: RequestModalKind) => void
  close: () => void
}

const RequestModalContext = createContext<RequestModalContextValue | null>(null)

export function useRequestModal() {
  const ctx = useContext(RequestModalContext)
  if (!ctx) {
    throw new Error('useRequestModal must be used within RequestModalProvider')
  }
  return ctx
}

export default function RequestModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [kind, setKind] = useState<RequestModalKind>('request')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const close = useCallback(() => {
    setIsOpen(false)
    setStatus('idle')
    setErrorMessage('')
  }, [])

  const open = useCallback((nextKind: RequestModalKind = 'request') => {
    setKind(nextKind)
    setIsOpen(true)
    setStatus('idle')
    setErrorMessage('')
  }, [])

  const value = useMemo(() => ({ open, close }), [open, close])

  const title = kind === 'measure' ? 'Вызвать замерщика' : 'Оставить заявку'

  const submit = useCallback(async () => {
    if (!name.trim() || !phone.trim()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          phone: phone.trim(),
          comment: comment.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        setStatus('error')
        setErrorMessage(text || 'Не удалось отправить заявку')
        return
      }

      setStatus('success')
      setTimeout(() => {
        setName('')
        setPhone('')
        setComment('')
        close()
      }, 800)
    } catch (e) {
      setStatus('error')
      setErrorMessage(e instanceof Error ? e.message : 'Не удалось отправить заявку')
    }
  }, [name, phone, comment, kind, close])

  return (
    <RequestModalContext.Provider value={value}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={close}
            aria-label="Закрыть"
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Оставьте контакты — мы перезвоним и уточним детали.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                onClick={close}
                aria-label="Закрыть"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Имя</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                    placeholder="Как к вам обращаться"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Телефон</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Комментарий</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                    placeholder="Например: жалюзи на кухню, 2 окна, горизонтальные, район метро ..."
                  />
                </div>

                <button
                  type="button"
                  onClick={submit}
                  disabled={!name.trim() || !phone.trim() || status === 'submitting'}
                  className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting'
                    ? 'Отправка...'
                    : status === 'success'
                      ? 'Заявка принята'
                      : 'Отправить'}
                </button>

                {status === 'error' ? (
                  <p className="text-xs text-red-600">{errorMessage}</p>
                ) : null}

                <p className="text-[11px] text-zinc-500">
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </RequestModalContext.Provider>
  )
}
