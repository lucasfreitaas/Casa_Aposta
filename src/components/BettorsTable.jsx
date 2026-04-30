/**
 * Tabela de apostadores para um competidor com ODD e retorno esperado.
 * Recebe dados já processados do GameCard (sem hook próprio).
 */
export default function BettorsTable({ apostas, odd, label, loading }) {
  const total = apostas.reduce((acc, a) => acc + (Number(a.valor) || 0), 0)
  const retornoTotal = total * odd

  return (
    <div className="flex-1 min-w-0">
      {/* Cabeçalho do competidor */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Apostando em
          </p>
          <p className="text-sm font-bold text-gray-800 truncate">{label}</p>
        </div>
        {/* Badge de ODD */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                         bg-brand-50 border border-brand-100 text-brand-700
                         text-xs font-black tracking-tight flex-shrink-0">
          ODD {odd.toFixed(2)}x
        </span>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Apostador
              </th>
              <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Valor
              </th>
              <th className="text-right px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                A Receber
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400 text-xs">
                  Carregando…
                </td>
              </tr>
            ) : apostas.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-5 text-gray-400 text-xs">
                  Nenhuma aposta ainda
                </td>
              </tr>
            ) : (
              apostas.map((a) => {
                const retorno = Number(a.valor) * odd
                return (
                  <tr
                    key={a.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-2 py-2 text-xs font-medium text-gray-700 truncate max-w-[80px]" title={a.nomeApostador}>
                      {a.nomeApostador}
                    </td>
                    <td className="px-2 py-2 text-right text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {Number(a.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="px-2 py-2 text-right text-xs font-bold text-emerald-600 whitespace-nowrap">
                      {retorno.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          {apostas.length > 0 && (
            <tfoot>
              <tr className="bg-brand-50 border-t border-brand-100">
                <td className="px-2 py-2 text-[10px] font-bold text-brand-700 uppercase tracking-wide">
                  Total
                </td>
                <td className="px-2 py-2 text-right text-xs font-bold text-brand-700 whitespace-nowrap">
                  {total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="px-2 py-2 text-right text-xs font-bold text-emerald-700 whitespace-nowrap">
                  {retornoTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
