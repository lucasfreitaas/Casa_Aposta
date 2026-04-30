import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebaseConfig'

/**
 * Hook que retorna a lista de apostas de um competidor em tempo real.
 * @param {string} competicaoId - ID do documento da competição
 * @param {string} competidor   - "competidor1" | "competidor2"
 */
export function useApostas(competicaoId, competidor) {
  const [apostas, setApostas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!competicaoId || !competidor) return

    const q = query(
      collection(db, 'competicoes', competicaoId, 'apostas'),
      orderBy('criadoEm', 'asc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const todas = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setApostas(todas.filter(a => a.competidorEscolhido === competidor))
      setLoading(false)
    })

    return () => unsub()
  }, [competicaoId, competidor])

  return { apostas, loading }
}
