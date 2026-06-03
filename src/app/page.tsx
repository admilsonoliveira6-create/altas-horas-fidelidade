'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import config from '@/lib/config'

type Step = 'phone' | 'name'

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setError('Coloca o telefone completo com DDD.'); return }
    setError('')
    setLoading(true)

    const { data, error: dbError } = await supabase
      .from('customers').select('id, name').eq('phone', digits).maybeSingle()

    setLoading(false)
    if (dbError) { setError('Erro ao conectar. Tenta de novo.'); return }

    if (data) {
      sessionStorage.setItem('customer_id', data.id)
      sessionStorage.setItem('customer_name', data.name)
      router.push('/dashboard')
    } else {
      setStep('name')
    }
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) { setError('Coloca seu nome completo.'); return }
    setError('')
    setLoading(true)

    const digits = phone.replace(/\D/g, '')
    const { data, error: dbError } = await supabase
      .from('customers').insert({ phone: digits, name: name.trim(), points: 0 })
      .select('id, name').single()

    setLoading(false)
    if (dbError || !data) { setError('Erro ao cadastrar. Tenta de novo.'); return }

    sessionStorage.setItem('customer_id', data.id)
    sessionStorage.setItem('customer_name', data.name)
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-brand-red flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-6">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold mb-4 shadow-lg">
            <span className="text-4xl font-display text-brand-dark leading-none">{config.iniciais}</span>
          </div>
          <h1 className="font-display text-brand-gold text-5xl tracking-wider leading-none">
            {config.nome.toUpperCase()}
          </h1>
          <p className="text-white/80 text-sm font-body mt-1 tracking-wide uppercase">
            {config.subtitulo}
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-brand-dark rounded-2xl p-6 shadow-2xl">
          {step === 'phone' ? (
            <>
              <h2 className="font-display text-brand-gold text-3xl mb-1">SEU NÚMERO</h2>
              <p className="text-white/60 text-sm font-body mb-5">Coloca o telefone pra acessar seus pontos.</p>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <input type="tel" inputMode="numeric" placeholder="(24) 99999-9999" value={phone}
                  onChange={(e) => { setPhone(formatPhone(e.target.value)); setError('') }}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
                {error && <p className="text-brand-gold text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-brand-gold text-brand-dark font-display text-2xl py-3 rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-60">
                  {loading ? 'AGUARDA...' : 'ENTRAR'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-brand-gold text-3xl mb-1">SEU NOME</h2>
              <p className="text-white/60 text-sm font-body mb-5">Primeira vez aqui? Bem-vindo! Qual é o seu nome?</p>
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <input type="text" placeholder="Como te chamam?" value={name}
                  onChange={(e) => { setName(e.target.value); setError('') }}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  autoFocus
                />
                {error && <p className="text-brand-gold text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-brand-gold text-brand-dark font-display text-2xl py-3 rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-60">
                  {loading ? 'CADASTRANDO...' : 'COMEÇAR'}
                </button>
                <button type="button" onClick={() => { setStep('phone'); setError('') }}
                  className="w-full text-white/50 text-sm font-body py-1">
                  ← Voltar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="text-center pb-8">
        <p className="text-white/40 text-xs font-body">{config.tagline}</p>
      </div>
    </main>
  )
}
