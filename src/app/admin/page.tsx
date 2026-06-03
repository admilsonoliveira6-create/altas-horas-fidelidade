'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type View = 'login' | 'add' | 'success'

export default function Admin() {
  const [view, setView] = useState<View>('login')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [newTotal, setNewTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'altashoras2026'

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setView('add')
    } else {
      setError('Senha errada.')
    }
  }

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handleAddPoints(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    const pts = Math.floor(parseFloat(amount))

    if (digits.length < 10) { setError('Telefone inválido.'); return }
    if (!pts || pts <= 0) { setError('Valor inválido.'); return }

    setError('')
    setLoading(true)

    const { data: cust, error: findErr } = await supabase
      .from('customers')
      .select('id, name, points')
      .eq('phone', digits)
      .maybeSingle()

    if (findErr || !cust) {
      setError('Cliente não encontrado. Peça pra ele se cadastrar primeiro.')
      setLoading(false)
      return
    }

    const updated = cust.points + pts

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('customers').update({ points: updated }).eq('id', cust.id),
      supabase.from('transactions').insert({
        customer_id: cust.id,
        points: pts,
        description: `Compra R$${amount}`,
      }),
    ])

    setLoading(false)

    if (e1 || e2) {
      setError('Erro ao salvar. Tenta de novo.')
      return
    }

    setCustomerName(cust.name)
    setNewTotal(updated)
    setView('success')
  }

  function reset() {
    setPhone('')
    setAmount('')
    setError('')
    setView('add')
  }

  if (view === 'login') {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="font-display text-brand-gold text-5xl">ADMIN</span>
            <p className="text-white/40 text-sm mt-1">Altas Horas Fidelidade</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
            />
            {error && <p className="text-brand-gold text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-gold text-brand-dark font-display text-2xl py-3 rounded-xl tracking-wider active:scale-95 transition-all"
            >
              ENTRAR
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (view === 'success') {
    return (
      <main className="min-h-screen bg-brand-red flex flex-col items-center justify-center px-6 text-center">
        <span className="text-7xl mb-4">✅</span>
        <h1 className="font-display text-brand-gold text-4xl mb-2">PONTOS ADICIONADOS!</h1>
        <p className="text-white text-xl font-body mb-1">{customerName}</p>
        <p className="text-white/60 text-sm font-body mb-8">
          Agora tem <span className="text-brand-gold font-bold text-lg">{newTotal} pts</span> no total
        </p>
        <button
          onClick={reset}
          className="bg-brand-gold text-brand-dark font-display text-2xl py-3 px-10 rounded-xl tracking-wider active:scale-95 transition-all"
        >
          PRÓXIMO CLIENTE
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-dark font-body">
      <div className="bg-brand-red px-5 pt-10 pb-6">
        <h1 className="font-display text-brand-gold text-4xl">ADICIONAR PONTOS</h1>
        <p className="text-white/60 text-sm mt-1">R$1 = 1 ponto</p>
      </div>

      <div className="px-5 py-6">
        <form onSubmit={handleAddPoints} className="space-y-5">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">
              Telefone do cliente
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="(24) 99999-9999"
              value={phone}
              onChange={(e) => { setPhone(formatPhone(e.target.value)); setError('') }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">
              Valor da compra (R$)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Ex: 45.50"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError('') }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
            />
            {amount && parseFloat(amount) > 0 && (
              <p className="text-brand-gold text-sm mt-1">
                +{Math.floor(parseFloat(amount))} pontos
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-dark font-display text-2xl py-4 rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'SALVANDO...' : 'ADICIONAR PONTOS'}
          </button>
        </form>
      </div>
    </main>
  )
}
