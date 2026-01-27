/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CSV SERVICE - EXPORTAÇÃO DE DADOS EM FORMATO TABULAR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RESPONSABILIDADE:
 * Converter dados estruturados (JSON) para formato CSV (Comma-Separated Values).
 * 
 * FORMATO CSV:
 * - Primeira linha: Cabeçalhos das colunas
 * - Linhas seguintes: Dados de cada registro
 * - Campos entre aspas duplas para escapar vírgulas
 * - Aspas duplas internas escapadas como ""
 * 
 * COMPATIBILIDADE:
 * ✅ Microsoft Excel
 * ✅ Google Sheets
 * ✅ LibreOffice Calc
 * ✅ Python pandas.read_csv()
 * ✅ R read.csv()
 * 
 * CASO DE USO:
 * - Análise estatística em planilhas
 * - Importação em outros sistemas
 * - Visualização de dados tabulares
 */

import { Species } from '../types';

/**
 * FUNÇÃO HELPER: CONVERTER MATRIZ PARA STRING CSV
 * 
 * ESCAPAMENTO DE DADOS:
 * - Envolve todos os campos em aspas duplas
 * - Escapa aspas internas duplicando-as (" → "")
 * - Padrão RFC 4180 (CSV specification)
 * 
 * EXEMPLO:
 * Input: [['Nome', 'Descrição'], ['Embaúba', 'Cresce "rápido"']]
 * Output: "Nome","Descrição"\n"Embaúba","Cresce ""rápido"""
 * 
 * @param rows - Matriz de strings (linhas e colunas)
 * @returns String CSV formatada
 */
function toCSV(rows: string[][]): string {
  return rows.map((cols) => 
    cols.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API PÚBLICA DO SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const csvService = {
  /**
   * EXPORTAR LISTA DE ESPÉCIES PARA CSV
   * 
   * TRANSFORMAÇÃO DE DADOS:
   * 1. Define cabeçalhos das colunas
   * 2. Mapeia cada espécie para array de strings
   * 3. Converte timestamp para ISO 8601 (formato universal)
   * 4. Gera string CSV com helper toCSV()
   * 5. Cria Blob com charset UTF-8 (suporte a acentos)
   * 6. Dispara download via link temporário
   * 
   * FORMATO DA DATA:
   * - ISO 8601: 2026-01-26T15:30:00.000Z
   * - Vantagem: Ordenável lexicograficamente, sem ambiguidade de timezone
   * 
   * @param list - Array de espécies a exportar
   */
  exportToCSV(list: Species[]) {
    const headers = ['id', 'name', 'description', 'photoUrl', 'createdAt'];
    const rows = list.map((s) => [s.id, s.name, s.description, s.photoUrl, new Date(s.createdAt).toISOString()]);
    const csv = toCSV([headers, ...rows]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'species.csv';
    link.click();
    URL.revokeObjectURL(url);
  },
};
