import { useState, useEffect } from 'react';

/**
 * Hook customizado para aplicar debounce em valores
 * 
 * CONCEITO: Debounce adia a atualização do valor até que o usuário pare de digitar
 * por um determinado período (delay), evitando execuções excessivas de filtros/buscas.
 * 
 * BENEFÍCIO DE DESEMPENHO:
 * - Reduz re-renderizações durante digitação rápida
 * - Diminui operações de filtro/busca custosas
 * - Melhora responsividade da interface
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * // debouncedSearch só atualiza 300ms após usuário parar de digitar
 * 
 * @param value - Valor a ser debounced (geralmente vem de um input)
 * @param delay - Tempo de espera em milissegundos (recomendado: 300-500ms)
 * @returns Valor debounced que só atualiza após o delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado interno que armazena o valor debounced
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer que atualiza o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: Cancela o timer anterior se o valor mudar antes do delay
    // Isso garante que apenas a última alteração seja processada
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-executa quando value ou delay mudarem

  return debouncedValue;
}
