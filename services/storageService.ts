/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STORAGE SERVICE - CAMADA DE PERSISTÊNCIA DE DADOS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RESPONSABILIDADE:
 * Abstrai interações com LocalStorage, fornecendo API limpa para CRUD de espécies.
 * 
 * PADRÃO: Service Layer (Arquitetura em camadas)
 * - Separa lógica de persistência da lógica de apresentação
 * - Facilita testes (mock do LocalStorage)
 * - Permite trocar storage (ex: IndexedDB) sem afetar componentes
 * 
 * LIMITAÇÕES DO LOCALSTORAGE:
 * - Síncrono (bloqueia thread principal)
 * - Limite de ~5-10MB por domínio
 * - Strings apenas (requer JSON.stringify/parse)
 * - Não há índices ou queries avançadas
 * 
 * ALTERNATIVAS PARA ESCALA:
 * - IndexedDB: Assíncrono, maior capacidade, queries complexas
 * - Backend API: Persistência no servidor, sincronização multi-dispositivo
 */

import { Species } from '../types';

/** Chave única usada no LocalStorage para armazenar dados */
const STORAGE_KEY = 'argadia_species';

/**
 * FUNÇÃO HELPER: CARREGAR DADOS DO LOCALSTORAGE
 * 
 * TRATAMENTO DE ERROS:
 * - JSON malformado: Retorna array vazio
 * - Storage indisponível: Retorna array vazio
 * - Modo privado: Pode falhar, graceful degradation
 * 
 * @returns Array de espécies ou array vazio em caso de erro
 */
function load(): Species[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Se não houver dados, retorna array vazio (primeira execução)
    return raw ? (JSON.parse(raw) as Species[]) : [];
  } catch {
    // Falha silenciosa: Melhor retornar array vazio que quebrar a aplicação
    return [];
  }
}

/**
 * FUNÇÃO HELPER: PERSISTIR DADOS NO LOCALSTORAGE
 * 
 * SOBRESCREVE todo o conteúdo da chave com nova lista.
 * 
 * @param list - Array completo de espécies a ser salvo
 */
function persist(list: Species[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API PÚBLICA DO SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const storageService = {
  /**
   * OBTER TODAS AS ESPÉCIES
   * 
   * @returns Array de todas as espécies cadastradas
   */
  getAll(): Species[] {
    return load();
  },
  
  /**
   * SALVAR NOVA ESPÉCIE
   * 
   * ESTRATÉGIA: Prepend (adiciona no início)
   * - Espécies mais recentes aparecem primeiro
   * - Operação O(n) devido a criação de novo array
   * 
   * @param item - Espécie a ser adicionada
   */
  save(item: Species) {
    const data = load();
    persist([item, ...data]); // Spread operator cria novo array
  },
  
  /**
   * DELETAR ESPÉCIE POR ID
   * 
   * COMPLEXIDADE: O(n) - percorre array inteiro para filtrar
   * 
   * @param id - UUID da espécie a ser removida
   */
  delete(id: string) {
    const data = load().filter((s) => s.id !== id);
    persist(data);
  },
  
  /**
   * EXPORTAR BANCO DE DADOS COMPLETO COMO JSON
   * 
   * FLUXO:
   * 1. Carrega todos os dados do LocalStorage
   * 2. Converte para JSON formatado (2 espaços de indentação)
   * 3. Cria Blob (Binary Large Object) do tipo JSON
   * 4. Gera URL temporária do blob
   * 5. Cria link invisível e simula clique (download)
   * 6. Revoga URL para liberar memória
   * 
   * FORMATO: JSON pretty-printed para legibilidade humana
   * USO: Backup, migração, análise externa
   */
  exportJSON() {
    const data = load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'db.json';
    link.click();
    URL.revokeObjectURL(url);
  },
};
