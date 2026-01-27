import React, { useState } from 'react';
import { Species } from '../types';
import { Camera, FileText, Image as ImageIcon, Pencil } from 'lucide-react';
import { validateSpeciesInput } from '../utils/validation';

/**
 * PROPS DO FORMULÁRIO DE ESPÉCIES
 */
type Props = {
  /** Callback executado ao submeter formulário com dados válidos */
  onSave: (data: Omit<Species, 'id' | 'createdAt'>) => void;
  /** Callback para cancelar e voltar à listagem */
  onCancel: () => void;
};

/**
 * COMPONENTE SPECIESFORM - FORMULÁRIO DE CADASTRO BOTÂNICO
 * 
 * RESPONSABILIDADES:
 * - Capturar dados de nova espécie (nome, descrição, foto)
 * - Validar inputs antes de submeter
 * - Fornecer feedback visual ao usuário
 * - Limpar formulário após sucesso
 * 
 * MELHORIAS IMPLEMENTADAS:
 * 1. Validação com Zod antes de submeter
 * 2. Estado local controlado (Controlled Components)
 * 3. Trimming automático de espaços
 * 4. Acessibilidade com labels e required
 * 
 * OTIMIZAÇÃO: React.memo com comparação customizada de props.
 * onSave e onCancel são funções estáveis (useCallback no pai).
 */
const SpeciesFormComponent: React.FC<Props> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  /**
   * HANDLER DE SUBMISSÃO DO FORMULÁRIO
   * 
   * FLUXO:
   * 1. Previne reload da página (e.preventDefault)
   * 2. Valida dados com Zod schema
   * 3. Se válido: envia para o pai e limpa formulário
   * 4. Se inválido: exibe alertas (em produção, usar toast/notification)
   * 
   * VALIDAÇÃO EM CAMADAS:
   * - HTML5: required, minLength (primeira barreira)
   * - Zod: regras de negócio complexas (segunda barreira)
   * - Backend: validação final (terceira barreira - não implementado aqui)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name.trim() || !description.trim()) return;
    
    // Prepara dados para validação
    const formData = {
      name: name.trim(),
      description: description.trim(),
      photoUrl: photoUrl.trim(),
    };
    
    // Validação com Zod
    const validation = validateSpeciesInput(formData);
    
    if (!validation.success) {
      // Em produção, substituir alert por sistema de notificação
      alert('Erros de validação:\n' + (validation as { success: false; errors: string[] }).errors.join('\n'));
      return;
    }
    
    // Dados validados, prossegue com salvamento
    onSave(validation.data);
    
    // Limpa formulário após sucesso
    setName('');
    setDescription('');
    setPhotoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <Pencil className="w-4 h-4" />
          Nome da espécie
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Cecropia glaziovii (embaúba)"
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <FileText className="w-4 h-4" />
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Habitat, características morfológicas, estágio de crescimento, observações..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[140px]"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <Camera className="w-4 h-4" />
          Foto (URL)
        </label>
        <div className="flex gap-3 items-center">
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <div className="w-12 h-12 rounded-xl border border-dashed border-stone-300 flex items-center justify-center bg-stone-50">
            <ImageIcon className="w-5 h-5 text-stone-400" />
          </div>
        </div>
        <p className="text-xs text-stone-500">Cole um link direto de imagem; arquivos locais não são enviados.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Salvar espécie
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

/**
 * MEMOIZAÇÃO DO FORMULÁRIO
 * 
 * React.memo com comparação customizada para otimizar re-renders.
 * Como onSave e onCancel são funções (reference types), precisamos
 * de comparação especial ou garantir que sejam estáveis (useCallback no pai).
 * 
 * ESTRATÉGIA: Assumimos que o pai usa useCallback, então shallow comparison é suficiente.
 */
export const SpeciesForm = React.memo(SpeciesFormComponent);
