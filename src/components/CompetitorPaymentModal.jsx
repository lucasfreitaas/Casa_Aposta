import { useState } from 'react'
import { PIX_DISPLAY } from '../constants'

/**
 * Modal mostrando o PIX para o pagamento da aposta entre os competidores.
 */
export default function CompetitorPaymentModal({ competicao, onClose }) {
  const [copied, setCopied] = useState(false)

  const {
    modalidade,
    competidor1,
    competidor2,
    valorApostaCompetidores
  } = competicao

  const valorNum = Number(valorApostaCompetidores) || 0

  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_DISPLAY).then(() => {
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
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Aguardando Pagamento</p>
              {modalidade && (
                <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 text-[9px] font-black uppercase tracking-tighter border border-brand-100">
                  {modalidade}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Pagamento dos Competidores
            </h2>
          </div>
          <button
            id="close-competitor-modal"
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          
          <div className="text-center mb-2">
            <h3 className="text-base font-bold text-gray-800">
              <span className="text-brand-600">{competidor1}</span> <span className="text-gray-400">vs</span> <span className="text-brand-600">{competidor2}</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">Valor da aposta acordada entre os dois:</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {valorNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs text-amber-800 text-center leading-relaxed font-semibold">
              O evento só ficará aberto para apostas do público após o admin confirmar o pagamento deste valor na conta da casa.
            </p>
          </div>

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
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-brand-600/80 text-center">
                Escaneie o QR Code ou copie a chave PIX abaixo:
              </p>
              <button
                type="button"
                id="copy-pix-comp-btn"
                onClick={handleCopyPix}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                           bg-brand-600 text-white font-bold text-sm
                           hover:bg-brand-700 active:scale-95 transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Chave Copiada!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar Chave PIX · {PIX_DISPLAY}
                  </>
                )}
              </button>
              <p className="text-xs text-brand-600/60 text-center">
                Após transferir, envie o comprovante para o administrador.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              id="fechar-competitor-modal-btn"
              type="button"
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
