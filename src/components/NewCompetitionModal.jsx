import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import toast from 'react-hot-toast'

/**
 * Modal para cadastrar uma nova competição no Firestore.
 * @param {function} onClose - fecha o modal
 * @param {function} onCreated - callback executado ao criar com sucesso
 */
export default function NewCompetitionModal({ onClose, onCreated }) {
  const [comp1, setComp1] = useState('')
  const [comp2, setComp2] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!comp1.trim() || !comp2.trim() || !dataHora) {
      toast.error('Preencha todos os campos.')
      return
    }
    if (comp1.trim().toLowerCase() === comp2.trim().toLowerCase()) {
      toast.error('Os competidores não podem ter o mesmo nome.')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'competicoes'), {
        competidor1: comp1.trim(),
        competidor2: comp2.trim(),
        dataHora:    dataHora, // Salva como YYYY-MM-DD
        status:      'aberto',
        criadoEm:    serverTimestamp(),
      })
      toast.success('Competição criada com sucesso! 🎱')
      if (onCreated) onCreated()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao criar competição. Verifique o Firestore.')
    } finally {
      setLoading(false)
    }
  }

  function stopPropagation(e) { e.stopPropagation() }

  // Valor mínimo para o date (hoje)
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={stopPropagation}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              Nova Competição
            </p>
            <h2 className="text-lg font-bold text-gray-900">Cadastrar Jogo</h2>
          </div>
          <button
            id="close-new-comp-modal"
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* VS layout */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label htmlFor="comp1-name" className="label">Competidor 1</label>
              <input
                id="comp1-name"
                type="text"
                className="input-field"
                placeholder="Ex: Genilsson"
                value={comp1}
                onChange={e => setComp1(e.target.value)}
                required
                maxLength={50}
              />
            </div>

            <div className="flex-shrink-0 mt-5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full
                               bg-gray-100 text-gray-500 text-xs font-black tracking-tight">
                VS
              </span>
            </div>

            <div className="flex-1">
              <label htmlFor="comp2-name" className="label">Competidor 2</label>
              <input
                id="comp2-name"
                type="text"
                className="input-field"
                placeholder="Ex: Wanderson"
                value={comp2}
                onChange={e => setComp2(e.target.value)}
                required
                maxLength={50}
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <label htmlFor="comp-datetime" className="label">Data da Competição</label>
            <input
              id="comp-datetime"
              type="date"
              className="input-field"
              min={minDate}
              value={dataHora}
              onChange={e => setDataHora(e.target.value)}
              required
            />
          </div>

          {/* Info */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              A competição ficará visível com status <strong>Aberto</strong>. 
              Você pode encerrá-la manualmente depois pelo painel admin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              id="cancel-new-comp-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              id="create-comp-btn"
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
                  Criando…
                </>
              ) : 'Criar Competição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
