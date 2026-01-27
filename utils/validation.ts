import { z } from 'zod';

/**
 * VALIDAÇÃO COM ZOD - GARANTIA DE INTEGRIDADE DE DADOS
 * 
 * CONCEITO: Zod é uma biblioteca de schema validation que garante type-safety
 * em runtime, não apenas em compile-time como TypeScript.
 * 
 * BENEFÍCIOS:
 * - Valida dados de entrada (formulários, LocalStorage)
 * - Previne dados corrompidos ou malformados
 * - Gera mensagens de erro claras e customizáveis
 * - Infere tipos TypeScript automaticamente
 * - Documenta estrutura de dados esperada
 */

/**
 * Schema para validação de espécies botânicas
 * 
 * REGRAS DE NEGÓCIO:
 * - ID: UUID válido gerado pelo sistema
 * - Nome: Obrigatório, mínimo 2 caracteres, apenas letras, números, espaços e parênteses
 * - Descrição: Obrigatória, mínimo 10 caracteres para garantir qualidade
 * - Photo URL: Opcional, mas se fornecida deve ser URL válida
 * - CreatedAt: Timestamp numérico positivo
 */
export const SpeciesSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(150, 'Nome não pode exceder 150 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s().-]+$/, 'Nome contém caracteres inválidos'),
  
  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres para ser informativa')
    .max(1000, 'Descrição não pode exceder 1000 caracteres'),
  
  photoUrl: z
    .string()
    .url('URL da foto inválida')
    .or(z.literal('')) // Permite string vazia
    .optional()
    .default(''),
  
  createdAt: z
    .number()
    .positive('Timestamp deve ser positivo')
    .int('Timestamp deve ser inteiro'),
});

/**
 * Schema para dados de entrada do formulário (antes de ter id e createdAt)
 */
export const SpeciesInputSchema = SpeciesSchema.omit({ id: true, createdAt: true });

/**
 * Schema para array de espécies (usado na validação do LocalStorage)
 */
export const SpeciesListSchema = z.array(SpeciesSchema);

/**
 * Tipos TypeScript inferidos automaticamente dos schemas
 * VANTAGEM: Um único schema define validação E tipo
 */
export type SpeciesValidated = z.infer<typeof SpeciesSchema>;
export type SpeciesInput = z.infer<typeof SpeciesInputSchema>;

/**
 * Função helper para validar com tratamento de erros amigável
 * 
 * @param data - Dados a validar
 * @returns Objeto com sucesso/erro e dados validados ou mensagens de erro
 * 
 * @example
 * const result = validateSpecies(formData);
 * if (result.success) {
 *   console.log('Dados válidos:', result.data);
 * } else {
 *   console.error('Erros:', result.errors);
 * }
 */
export function validateSpecies(data: unknown): 
  | { success: true; data: SpeciesValidated }
  | { success: false; errors: string[] } {
  const result = SpeciesSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Extrai mensagens de erro em formato legível
  const errors = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
  return { success: false, errors };
}

/**
 * Valida dados de entrada do formulário
 */
export function validateSpeciesInput(data: unknown): 
  | { success: true; data: SpeciesInput }
  | { success: false; errors: string[] } {
  const result = SpeciesInputSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
  return { success: false, errors };
}

/**
 * Valida lista completa de espécies (útil ao carregar do LocalStorage)
 */
export function validateSpeciesList(data: unknown): 
  | { success: true; data: SpeciesValidated[] }
  | { success: false; errors: string[] } {
  const result = SpeciesListSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
  return { success: false, errors };
}
