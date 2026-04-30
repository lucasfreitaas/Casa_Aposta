import { useState } from 'react'
import { useCompeticaoApostas } from '../hooks/useCompeticaoApostas'
import BettorsTable from './BettorsTable'
import BetModal from './BetModal'
import { db } from '../firebaseConfig'
import toast from 'react-hot-toast'

/**
 * Card de jogo com ODDs dinâmicas, tabelas de apostadores e retorno esperado.
 */
export default function GameCard({ competicao }) {
  const [betTarget, setBetTarget] = useState(null)

  const {
    competidor1,
    competidor2,
    dataHora,
    status,
    apostasFechadas,
    id,
    vencedor,
    placar,
  } = competicao

  // Hook centralizado — busca todas as apostas + calcula odds
  const {
    apostasComp1,
    apostasComp2,
    totalComp1,
    totalComp2,
    totalBanca,
    oddComp1,
    oddComp2,
    loading,
  } = useCompeticaoApostas(id)

  // Converte "YYYY-MM-DD" ou ISO string para mostrar apenas a data localmente
  let dataFormatada = '—'
  if (dataHora) {
    // Se for formato "YYYY-MM-DD", forçar meia-noite UTC para não alterar o dia por fuso horário
    const isoString = dataHora.length === 10 ? `${dataHora}T12:00:00Z` : dataHora
    dataFormatada = new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isAberto = status === 'aberto'
  const isCancelado = status === 'cancelado'

  return (
    <>
      <article className="card overflow-hidden hover:shadow-md transition-shadow duration-200">

        {/* Card Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate leading-snug">
                <span className="text-brand-600">{competidor1}</span>
                <span className="mx-2 text-gray-300 font-normal">vs</span>
                <span className="text-brand-600">{competidor2}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dataFormatada}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={
                isAberto ? 'badge-open flex-shrink-0' :
                isCancelado ? 'badge-closed bg-red-50 text-red-600 border-red-200 flex-shrink-0' :
                'badge-closed flex-shrink-0'
              }>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isAberto ? 'bg-emerald-500' :
                  isCancelado ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                {isAberto ? 'Aberto' : isCancelado ? 'Cancelado' : 'Encerrado'}
              </span>

              {isAberto && apostasFechadas && (
                <span className="badge-closed bg-amber-50 text-amber-700 border-amber-200 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Apostas Fechadas
                </span>
              )}
            </div>
          </div>

          {/* Banca total */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-xs font-bold text-gray-600">
                Banca Total:{' '}
                <span className="text-brand-700 ml-1">
                  {totalBanca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </span>
            </div>
            
            {/* Vencedor / Placar se encerrado */}
            {!isAberto && vencedor && placar && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  🏆 Vencedor: {vencedor === 'competidor1' ? competidor1 : competidor2}
                </span>
                <span className="text-xs font-black text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded">
                  {placar.competidor1} x {placar.competidor2}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tabelas lado a lado ou empilhadas */}
        <div className="px-5 py-4 flex flex-col md:flex-row gap-5">
          <BettorsTable
            apostas={apostasComp1}
            odd={oddComp1}
            label={competidor1}
            loading={loading}
          />

          {/* Divisor vertical */}
          <div className="w-px bg-gray-100 self-stretch flex-shrink-0" />

          <BettorsTable
            apostas={apostasComp2}
            odd={oddComp2}
            label={competidor2}
            loading={loading}
          />
        </div>

        {/* Footer com botões */}
        {isAberto && !apostasFechadas && (
          <div className="px-5 pb-5">
            <div className="flex gap-3 mb-3">
              <button
                id={`bet-comp1-${id}`}
                onClick={() => setBetTarget({ competidor: 'competidor1', nome: competidor1, odd: oddComp1, totalCompetidor: totalComp1 })}
                className="btn-primary flex-1 text-xs py-3"
              >
                🎱 APOSTAR em {competidor1}
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-black">
                  {oddComp1.toFixed(2)}x
                </span>
              </button>
              <button
                id={`bet-comp2-${id}`}
                onClick={() => setBetTarget({ competidor: 'competidor2', nome: competidor2, odd: oddComp2, totalCompetidor: totalComp2 })}
                className="btn-primary flex-1 text-xs py-3"
              >
                🎱 APOSTAR em {competidor2}
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-black">
                  {oddComp2.toFixed(2)}x
                </span>
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Modal de aposta */}
      {betTarget && (
        <BetModal
          competicao={competicao}
          competidor={betTarget.competidor}
          nomeCompetidor={betTarget.nome}
          oddAtual={betTarget.odd}
          totalCompetidor={betTarget.totalCompetidor}
          totalBanca={totalBanca}
          onClose={() => setBetTarget(null)}
        />
      )}
    </>
  )
}
