import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import GameCard from './components/GameCard'

export default function App() {
  const [competicoes, setCompeticoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('aberto') // 'aberto' | 'encerrado' | 'todos'


  // Busca em tempo real as competições no Firestore
  useEffect(() => {
    let q;
    if (filtro !== 'todos') {
      q = query(collection(db, 'competicoes'), where('status', '==', filtro))
    } else {
      q = collection(db, 'competicoes')
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Local sort to avoid missing composite index errors on Firebase
        docs.sort((a, b) => {
          const timeA = a.criadoEm?.toMillis() || 0
          const timeB = b.criadoEm?.toMillis() || 0
          return timeB - timeA
        })
        setCompeticoes(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [filtro])


  const FILTROS = [
    { key: 'aberto',     label: 'Abertos'     },
    { key: 'encerrado',  label: 'Encerrados'  },
    { key: 'cancelado',  label: 'Cancelados'  },
    { key: 'todos',      label: 'Todos'       },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none" role="img" aria-label="sinuca">🎱</span>
            <div className="leading-tight">
              <p className="text-base font-black text-gray-900 tracking-tight">Casa de Aposta</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest -mt-0.5">Sinuca</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Sub-header com filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Jogos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? 'Carregando…' : `${competicoes.length} competiç${competicoes.length === 1 ? 'ão' : 'ões'} encontrada${competicoes.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {/* Filtros por status */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {FILTROS.map(f => (
              <button
                key={f.key}
                id={`filter-${f.key}`}
                onClick={() => { setFiltro(f.key); setLoading(true) }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  filtro === f.key
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estados: loading / vazio / grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-8 h-8 text-brand-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-sm text-gray-400">Carregando competições…</p>
          </div>
        ) : competicoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl select-none">🎱</span>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-700">Nenhuma competição encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Tente outro filtro.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1">
            {competicoes.map(comp => (
              <GameCard key={comp.id} competicao={comp} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row
                        items-center justify-between gap-2 text-xs text-gray-400">
          <span>🎱 Casa de Aposta · Sinuca</span>
          <span>Sistema baseado em confiança — sem gateway de pagamento</span>
        </div>
      </footer>

    </div>
  )
}
