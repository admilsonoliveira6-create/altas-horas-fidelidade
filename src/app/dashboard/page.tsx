'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { supabase, Customer, Transaction, REWARDS } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  const loadData = useCallback(async (id: string) => {
    const [{ data: cust }, { data: txns }] = await Promise.all([
      supabase.from('customers').select('*').eq('id', id).single(),
      supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })
        .limit(10),
    ])
    if (cust) setCustomer(cust)
    if (txns) setTransactions(txns)
    setLoading(false)
  }, [])

  useEffect(() => {
    const id = sessionStorage.getItem('customer_id')
    if (!id) { router.push('/'); return }
    loadData(id)
  }, [router, loadData])

  function logout() {
    sessionStorage.clear()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-red flex items-center justify-center">
        <p className="font-display text-brand-gold text-3xl animate-pulse">CARREGANDO...</p>
      </main>
    )
  }

  if (!customer) return null

  const nextReward = REWARDS.find((r) => r.points > customer.points) ?? REWARDS[REWARDS.length - 1]
  const prevThreshold = REWARDS.find((r) => r.points <= customer.points)?.points ?? 0
  const progress = Math.min(
    ((customer.points - prevThreshold) / (nextReward.points - prevThreshold)) * 100,
    100
  )

  return (
    <main className="min-h-screen bg-brand-dark font-body">
      {/* Modal QR Code */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-brand-dark rounded-2xl p-6 text-center w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Seu QR Code</p>
            <p className="text-white font-display text-2xl mb-4">{customer.name}</p>
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG
                value={customer.phone}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#1A1A1A"
                level="M"
              />
            </div>
            <p className="text-white/40 text-xs mb-4">
              Mostra pro atendente escanear
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-brand-gold text-brand-dark font-display text-xl py-3 rounded-xl tracking-wider"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-red px-5 pt-10 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest">Bem-vindo de volta</p>
            <h1 className="font-display text-brand-gold text-3xl leading-tight">
              {customer.name.split(' ')[0].toUpperCase()}!
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-white/40 text-xs mt-1 hover:text-white/70 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Cartão de pontos */}
        <div className="bg-brand-dark rounded-2xl p-5 shadow-xl">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Seus pontos</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="font-display text-brand-gold text-6xl leading-none">
              {customer.points}
            </span>
            <span className="text-white/40 text-sm mb-2">pts</span>
          </div>

          <div className="mb-1">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{customer.points} pts</span>
              <span>{nextReward.emoji} {nextReward.points} pts</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-gold rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/40 text-xs mt-1">
              {Math.max(nextReward.points - customer.points, 0)} pts para {nextReward.name}
            </p>
          </div>
        </div>
      </div>

      {/* Botão QR Code */}
      <div className="px-5 pt-5">
        <button
          onClick={() => setShowQR(true)}
          className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-xl py-3 hover:border-brand-gold transition-colors"
        >
          <span className="text-2xl">📱</span>
          <span className="text-white font-display text-xl tracking-wide">MEU QR CODE</span>
        </button>
        <p className="text-white/30 text-xs text-center mt-2">
          Mostra pro atendente na hora da compra
        </p>
      </div>

      {/* Prêmios */}
      <div className="px-5 py-5">
        <h2 className="font-display text-white text-2xl mb-3 tracking-wide">PRÊMIOS</h2>
        <div className="space-y-3">
          {REWARDS.map((reward) => {
            const unlocked = customer.points >= reward.points
            return (
              <div
                key={reward.id}
                className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${
                  unlocked
                    ? 'bg-brand-gold/10 border-brand-gold'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-3xl">{reward.emoji}</span>
                <div className="flex-1">
                  <p className={`font-display text-xl ${unlocked ? 'text-brand-gold' : 'text-white/50'}`}>
                    {reward.name}
                  </p>
                  <p className="text-white/40 text-xs">{reward.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-display text-xl ${unlocked ? 'text-brand-gold' : 'text-white/30'}`}>
                    {reward.points}
                  </p>
                  <p className="text-white/30 text-xs">pts</p>
                </div>
              </div>
            )
          })}
        </div>

        {customer.points >= 200 && (
          <button
            onClick={() => router.push('/resgatar')}
            className="w-full mt-4 bg-brand-gold text-brand-dark font-display text-2xl py-3 rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all"
          >
            RESGATAR PRÊMIO
          </button>
        )}
      </div>

      {/* Histórico */}
      {transactions.length > 0 && (
        <div className="px-5 pb-10">
          <h2 className="font-display text-white text-2xl mb-3 tracking-wide">HISTÓRICO</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white text-sm">{tx.description}</p>
                  <p className="text-white/30 text-xs">
                    {new Date(tx.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`font-display text-xl ${tx.points > 0 ? 'text-brand-gold' : 'text-red-400'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
