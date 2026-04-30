import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import toast from 'react-hot-toast'

export default function ScoreModal({ competicao, onClose }) {
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [loading, setLoading] = useState(false)

  const { id, competidor1, competidor2 } = competicao

  async function handleSubmit(e) {
    e.preventDefault()

    const s1 = Number(score1)
    const s2 = Number(score2)

    if (score1 === '' || score2 === '' || isNaN(s1) || isNaN(s2)) {
      toast.error('Preencha os dois placares com valores válidos.')
      return
    }

    if (s1 === s2) {
      toast.error('Empates não são permitidos neste sistema de sinuca.')
      return
    }

    const vencedor = s1 > s2 ? 'competidor1' : 'competidor2'
    const nomeVencedor = s1 > s2 ? competidor1 : competidor2

    setLoading(true)
    try {
      await updateDoc(doc(db, 'competicoes', id), {
        status: 'encerrado',
        placar: {
          competidor1: s1,
          competidor2: s2
        },
        vencedor: vencedor
      })
      toast.success(`Jogo finalizado! Vencedor: ${nomeVencedor} 🏆`)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao finalizar jogo.')
    } finally {
      setLoading(false)
    }
  }

  function stopPropagation(e) { e.stopPropagation() }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={stopPropagation}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              Finalizar Jogo
            </p>
            <h2 className="text-lg font-bold text-gray-900">Informar Placar</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="flex items-center gap-4 text-center">
            <div className="flex-1">
              <label className="label truncate" title={competidor1}>{competidor1}</label>
              <input
                type="number"
                min="0"
                className="input-field text-center text-xl font-bold"
                value={score1}
                onChange={e => setScore1(e.target.value)}
                required
              />
            </div>
            <div className="flex-shrink-0 mt-5 text-gray-400 font-bold">X</div>
            <div className="flex-1">
              <label className="label truncate" title={competidor2}>{competidor2}</label>
              <input
                type="number"
                min="0"
                className="input-field text-center text-xl font-bold"
                value={score2}
                onChange={e => setScore2(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Finalizar Jogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
