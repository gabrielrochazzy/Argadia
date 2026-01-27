import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para sincronizar estado React com LocalStorage
 * 
 * CONCEITO: Encapsula lógica de persistência, tornando-a reutilizável e type-safe.
 * Substitui múltiplas chamadas diretas ao localStorage por uma interface React idiomática.
 * 
 * BENEFÍCIOS:
 * - Abstração limpa do LocalStorage
 * - Type safety com TypeScript
 * - Sincronização automática estado ↔ storage
 * - Callbacks memorizados com useCallback
 * - Tratamento de erros centralizado
 * 
 * @example
 * const [items, setItems, { removeItem, clearAll }] = useLocalStorage<Species[]>('species', []);
 * 
 * @param key - Chave do LocalStorage
 * @param initialValue - Valor inicial se não houver dados salvos
 * @returns [estado, setState, operações auxiliares]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, { removeItem: (id: string) => void; clearAll: () => void }] {
  /**
   * Função helper para ler do LocalStorage
   * Executa apenas na inicialização (não causa re-renders)
   */
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse do JSON ou retorna valor inicial
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Estado React sincronizado com LocalStorage
  const [storedValue, setStoredValue] = useState<T>(readValue);

  /**
   * Função setter personalizada que persiste no LocalStorage
   * Aceita valor direto ou função updater (como useState padrão)
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Suporta sintaxe funcional: setState(prev => prev + 1)
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Atualiza estado React
        setStoredValue(valueToStore);
        
        // Persiste no LocalStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Erro ao salvar localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Remove um item específico da lista (assume que T é um array de objetos com id)
   * OTIMIZAÇÃO: useCallback evita criar nova função a cada render
   */
  const removeItem = useCallback(
    (id: string) => {
      setValue((prev) => {
        if (Array.isArray(prev)) {
          return prev.filter((item: any) => item.id !== id) as T;
        }
        return prev;
      });
    },
    [setValue]
  );

  /**
   * Limpa completamente o storage desta chave
   */
  const clearAll = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao limpar localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Sincroniza com LocalStorage ao montar o componente
   * Útil se múltiplas abas modificarem o storage
   */
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue, { removeItem, clearAll }];
}
