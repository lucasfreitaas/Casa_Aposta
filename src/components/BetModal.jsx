import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { PIX_DISPLAY, PIX_KEY } from '../constants'
import toast from 'react-hot-toast'

/**
 * Modal de aposta com QR Code PIX, ODD atual e cálculo de retorno em tempo real.
 */
export default function BetModal({ competicao, competidor, nomeCompetidor, odd, totalBanca, onClose }) {
  const [nomeApostador, setNomeApostador] = useState('')
  const [valor, setValor] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const valorNum = Number(valor) || 0
  const retornoEstimado = valorNum * odd

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nomeApostador.trim() || !valor || valorNum <= 0) {
      toast.error('Preencha seu nome e um valor válido.')
      return
    }

    setLoading(true)
    try {
      await addDoc(
        collection(db, 'competicoes', competicao.id, 'apostas'),
        {
          nomeApostador:       nomeApostador.trim(),
          valor:               valorNum,
          competidorEscolhido: competidor,
          criadoEm:            serverTimestamp(),
        }
      )
      toast.success(`🎱 VOCÊ APOSTOU EM ${nomeCompetidor.toUpperCase()}!`, {
        duration: 5000,
        style: {
          background: '#4c1d95',
          color: '#fff',
          border: 'none',
          fontSize: '15px',
          fontWeight: 700,
        },
        iconTheme: { primary: '#fff', secondary: '#7c3aed' },
      })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao registrar aposta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function stopPropagation(e) { e.stopPropagation() }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={stopPropagation}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Nova Aposta</p>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Apostando em{' '}
              <span className="text-brand-600">{nomeCompetidor}</span>
            </h2>
          </div>
          <button
            id="close-bet-modal"
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ODD + Banca info */}
        <div className="px-6 pt-4 flex gap-3">
          <div className="flex-1 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-center">
            <p className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest mb-0.5">ODD Atual</p>
            <p className="text-2xl font-black text-brand-700">{odd.toFixed(2)}x</p>
          </div>
          <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Banca Total</p>
            <p className="text-lg font-bold text-gray-700">
              {totalBanca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Nome Apostador */}
          <div>
            <label htmlFor="bet-name" className="label">Seu Nome</label>
            <input
              id="bet-name"
              type="text"
              className="input-field"
              placeholder="Ex: João Silva"
              value={nomeApostador}
              onChange={e => setNomeApostador(e.target.value)}
              required
              maxLength={60}
            />
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="bet-value" className="label">Valor da Aposta (R$)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm select-none">
                R$
              </span>
              <input
                id="bet-value"
                type="number"
                min="1"
                step="0.01"
                className="input-field pl-10"
                placeholder="0,00"
                value={valor}
                onChange={e => setValor(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Retorno estimado (atualiza em tempo real) */}
          {valorNum > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Retorno se ganhar
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  {valorNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} × {odd.toFixed(2)}
                </p>
              </div>
              <p className="text-xl font-black text-emerald-700">
                {retornoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          )}

          {/* Seção PIX: Chave + QR Code */}
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 space-y-3">
            <p className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
              Pagamento via PIX
            </p>

            {/* QR Code */}
            <div className="flex justify-center py-2">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-brand-100">
                <img
                  src="/qrcode-pix.png"
                  alt="QR Code PIX"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>

            {/* Chave PIX para copiar */}
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-brand-800 bg-white border border-brand-200
                               rounded-lg px-3 py-2 truncate select-all">
                {PIX_DISPLAY}
              </code>
              <button
                type="button"
                id="copy-pix-btn"
                onClick={handleCopyPix}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-brand-600 text-white text-xs
                           font-semibold hover:bg-brand-700 active:scale-95 transition-all"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-brand-600/80">
              Escaneie o QR Code ou copie a chave PIX.
              O depósito é baseado em confiança — obrigado!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              id="cancel-bet-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              id="confirm-bet-btn"
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Salvando…
                </>
              ) : 'Confirmar Aposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
