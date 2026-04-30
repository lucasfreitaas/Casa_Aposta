import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebaseConfig'

/**
 * Hook que retorna TODAS as apostas de uma competição em tempo real,
 * separadas por competidor, com cálculo de ODDs pari-mutuel.
 *
 * Regras de ODD:
 * - Começa em 2.00 quando não há apostas nos dois lados
 * - ODD = totalBanca / totalApostadoNoCompetidor (pari-mutuel)
 * - Garante que pagamentos nunca ultrapassem o valor total da banca
 */
export function useCompeticaoApostas(competicaoId) {
  const [apostas, setApostas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!competicaoId) return

    const q = query(
      collection(db, 'competicoes', competicaoId, 'apostas'),
      orderBy('criadoEm', 'asc')
    )

    const unsub = onSnapshot(q, (snap) => {
      setApostas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return () => unsub()
  }, [competicaoId])

  // Separar apostas por competidor
  const apostasComp1 = apostas.filter(a => a.competidorEscolhido === 'competidor1')
  const apostasComp2 = apostas.filter(a => a.competidorEscolhido === 'competidor2')

  // Totais por lado
  const totalComp1 = apostasComp1.reduce((acc, a) => acc + (Number(a.valor) || 0), 0)
  const totalComp2 = apostasComp2.reduce((acc, a) => acc + (Number(a.valor) || 0), 0)
  const totalBanca = totalComp1 + totalComp2

  // Cálculo de ODD pari-mutuel
  // ODD = totalBanca / totalDoLado
  // Quando não há apostas nos dois lados, ODD padrão = 2.00
  let oddComp1 = 2.0
  let oddComp2 = 2.0

  if (totalBanca > 0 && totalComp1 > 0 && totalComp2 > 0) {
    oddComp1 = totalBanca / totalComp1
    oddComp2 = totalBanca / totalComp2
  }

  return {
    apostasComp1,
    apostasComp2,
    totalComp1,
    totalComp2,
    totalBanca,
    oddComp1,
    oddComp2,
    loading,
  }
}
