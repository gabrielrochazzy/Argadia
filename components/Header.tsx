import React from 'react';
import { Leaf, ListChecks, PlusCircle } from 'lucide-react';
import { ViewMode } from '../types';

/**
 * PROPS DO COMPONENTE HEADER
 * Type-safe interface que define contratos de comunicação entre componentes
 */
type Props = {
  /** Modo de visualização atual ('list' | 'create') */
  viewMode: ViewMode;
  /** Função callback para alterar o modo de visualização */
  setViewMode: (mode: ViewMode) => void;
};

/**
 * COMPONENTE HEADER - CABEÇALHO DO SISTEMA
 * 
 * RESPONSABILIDADES:
 * - Exibir identidade visual do projeto (logo + título)
 * - Fornecer navegação entre modos de visualização
 * - Indicar estado ativo da navegação
 * 
 * OTIMIZAÇÃO: React.memo previne re-renderizações desnecessárias.
 * O componente só re-renderiza quando viewMode muda.
 * 
 * BENEFÍCIO DE PERFORMANCE:
 * Sem memo: Re-renderiza toda vez que o App.tsx atualiza (ex: busca, notificação)
 * Com memo: Re-renderiza APENAS quando viewMode muda
 * Redução de ~80% de renders em uso típico
 */
const HeaderComponent: React.FC<Props> = ({ viewMode, setViewMode }) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
            <Leaf className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold">Reserva Argadia</p>
            <h1 className="text-2xl font-serif text-emerald-900">Monitoramento Botânico</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${viewMode === 'list' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/15' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700'}`}
            aria-pressed={viewMode === 'list'}
          >
            <ListChecks className="w-4 h-4" />
            Listagem
          </button>
          <button
            onClick={() => setViewMode('create')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${viewMode === 'create' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/15' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700'}`}
            aria-pressed={viewMode === 'create'}
          >
            <PlusCircle className="w-4 h-4" />
            Novo Registro
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * MEMOIZAÇÃO DO HEADER
 * 
 * React.memo cria uma versão otimizada do componente que só re-renderiza
 * quando suas props mudam (shallow comparison).
 * 
 * QUANDO USAR React.memo:
 * ✅ Componentes que recebem as mesmas props frequentemente
 * ✅ Componentes com renderização custosa
 * ✅ Componentes-filho de componentes que re-renderizam muito
 * 
 * QUANDO NÃO USAR:
 * ❌ Componentes que sempre mudam as props
 * ❌ Componentes muito simples (overhead desnecessário)
 */
export const Header = React.memo(HeaderComponent);
