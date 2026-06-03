'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Customer, REWARDS } from '@/lib/supabase'

export default function Resgatar() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const id = sessionStorage.getItem('customer_id')
    if (!id) { router.push('/'); return }
    supabase.from('customers').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setCustomer(data)
    })
  }, [router])

  async function handleRedeem() {
    if (!customer || !selected) return
    const reward = REWARDS.find((r) => r.id === selected)
    if (!reward || customer.points < reward.points) return

    setLoading(true)

    const newPoints = customer.points - reward.points

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('customers').update({ points: newPoints }).eq('id', customer.id),
      supabase.from('transactions').insert({
        customer_id: customer.id,
        points: -reward.points,
        description: `Resgate: ${reward.name}`,
      }),
    ])

    setLoading(false)

    if (e1 || e2) {
      alert('Erro ao resgatar. Tenta de novo.')
      return
    }

    setSuccess(true)
  }

  if (!customer) return null

  if (success) {
    const reward = REWARDS.find((r) => r.id === selected)!
    return (
      <main className="min-h-screen bg-brand-red flex flex-col items-center justify-center px-6 text-center">
        <span className="text-8xl mb-6">{reward.emoji}</span>
        <h1 className="font-display text-brand-gold text-5xl mb-2">RESGATADO!</h1>
        <p className="text-white text-lg font-body mb-2">{reward.name}</p>
        <p className="text-white/60 text-sm font-body mb-8">
          Mostra essa tela pro atendente e é só isso.
        </p>
        <div className="bg-brand-dark rounded-2xl p-6 w-full max-w-xs mb-8">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Cliente</p>
          <p className="text-white font-display text-2xl">{customer.name}</p>
          <p className="text-white/40 text-xs mt-3 uppercase tracking-widest">Prêmio</p>
          <p className="text-brand-gold font-display text-2xl">{reward.name}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-brand-gold text-brand-dark font-display text-2xl py-3 px-10 rounded-xl tracking-wider active:scale-95 transition-all"
        >
          VOLTAR
        </button>
      </main>
    )
  }

  const eligible = REWARDS.filter((r) => customer.points >= r.points)

  return (
    <main className="min-h-screen bg-brand-dark font-body">
      <div className="bg-brand-red px-5 pt-10 pb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-white/50 text-sm mb-4 block"
        >
          ← Voltar
        </button>
        <h1 className="font-display text-brand-gold text-4xl">RESGATAR</h1>
        <p className="text-white/60 text-sm mt-1">
          Você tem <span className="text-brand-gold font-bold">{customer.points} pontos</span>
        </p>
      </div>

      <div className="px-5 py-6 space-y-3">
        {eligible.map((reward) => (
          <button
            key={reward.id}
            onClick={() => setSelected(reward.id)}
            className={`w-full flex items-center gap-4 rounded-xl p-4 border text-left transition-all ${
              selected === reward.id
                ? 'bg-brand-gold/20 border-brand-gold'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <span className="text-4xl">{reward.emoji}</span>
            <div className="flex-1">
              <p className="text-white font-display text-2xl">{reward.name}</p>
              <p className="text-white/50 text-sm">{reward.description}</p>
            </div>
            <div>
              <p className="font-display text-brand-gold text-xl">{reward.points} pts</p>
            </div>
          </button>
        ))}

        {eligible.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 font-body">Pontos insuficientes para resgate.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="px-5 pb-10">
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="w-full bg-brand-gold text-brand-dark font-display text-2xl py-4 rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'AGUARDA...' : 'CONFIRMAR RESGATE'}
          </button>
          <p className="text-white/30 text-xs text-center mt-3">
            Apresente ao atendente para validar.
          </p>
        </div>
      )}
    </main>
  )
}
